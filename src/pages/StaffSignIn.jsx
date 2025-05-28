import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon,
  AlertDescription,
  Link,
  Divider,
  useToast,
  Flex,
} from '@chakra-ui/react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffSignIn = ({ baseUrl }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login to:', `${baseUrl}staff-login`);

      const response = await fetch(`${baseUrl}staff-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      console.log('Login response status:', response.status);
      console.log(
        'Login response headers:',
        Object.fromEntries(response.headers.entries())
      );

      const data = await response.json();
      console.log('Login response data:', data);

      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          console.log('Token stored:', data.token);
        }

        console.log('Waiting for session to be established...');
        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log('Checking session at:', `${baseUrl}check-staff-session`);

        const sessionCheck = await fetch(`${baseUrl}check-staff-session`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(data.token && { Authorization: `Bearer ${data.token}` }),
          },
        });

        console.log('Session check status:', sessionCheck.status);
        console.log(
          'Session check headers:',
          Object.fromEntries(sessionCheck.headers.entries())
        );

        const sessionData = await sessionCheck.json();
        console.log('Session data:', sessionData);

        if (sessionData.isAuthenticated || data.token) {
          localStorage.setItem(
            'staffAuth',
            JSON.stringify({
              email: formData.email,
              timestamp: Date.now(),
            })
          );

          toast({
            title: 'Login successful',
            description: 'Welcome back! Redirecting to dashboard...',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });

          console.log('Logged in Staff:', data.staff);

          setFormData({ email: '', password: '' });
          setMessage('');

          setTimeout(() => navigate('/'), 2000);
        } else {
          console.error(
            'Session creation failed. Login response was OK but session check failed.'
          );
          console.error('This might indicate:');
          console.error('1. Backend session creation issue');
          console.error('2. Cookie/session configuration problem');
          console.error('3. Timing issue between login and session check');

          if (data.token) {
            console.log(
              'Proceeding with token-based auth despite session check failure'
            );

            localStorage.setItem(
              'staffAuth',
              JSON.stringify({
                email: formData.email,
                timestamp: Date.now(),
              })
            );

            toast({
              title: 'Login successful',
              description: 'Welcome back! (Session warning - check console)',
              status: 'warning',
              duration: 4000,
              isClosable: true,
            });

            setFormData({ email: '', password: '' });
            setMessage('');
            setTimeout(() => navigate('/', { replace: true }), 2000);
          } else {
            throw new Error(
              'Session creation failed - no session or token available'
            );
          }
        }
      } else {
        console.error('Login request failed:', response.status, data);
        setMessage(
          data.message || 'Login failed. Please check your credentials.'
        );
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.message.includes('Session creation failed')) {
        setMessage(
          'Session error. Please try logging in again or contact support.'
        );
        toast({
          title: 'Session Error',
          description:
            'There was an issue creating your session. Please try again.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } else if (
        error.name === 'TypeError' &&
        error.message.includes('fetch')
      ) {
        setMessage(
          'Network error. Please check your connection and try again.'
        );
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to the server. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        setMessage('An unexpected error occurred. Please try again.');
        toast({
          title: 'Login Error',
          description: error.message || 'An unexpected error occurred.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxW='md' py={20} px={4}>
      <VStack spacing={8}>
        <VStack spacing={4} textAlign='center'>
          <Box
            w={16}
            h={16}
            bg='brand.500'
            borderRadius='xl'
            display='flex'
            alignItems='center'
            justifyContent='center'
            color='white'
            fontSize='2xl'
            fontWeight='bold'
            shadow='lg'
          >
            <Lock size={32} />
          </Box>

          <Heading size='2xl' color='brand.700'>
            Staff Sign In
          </Heading>

          <Text color='gray.600' fontSize='lg'>
            Access your staff dashboard and manage events
          </Text>
        </VStack>

        <Card w='full' shadow='xl' borderRadius='xl'>
          <CardBody p={8}>
            <Box as='form' onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel color='gray.700' fontWeight='semibold'>
                    Email Address
                  </FormLabel>
                  <InputGroup>
                    <Input
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='Enter your email address'
                      bg='white'
                      borderColor='gray.300'
                      _hover={{ borderColor: 'brand.400' }}
                      _focus={{
                        borderColor: 'brand.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                      }}
                      size='lg'
                    />
                  </InputGroup>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color='gray.700' fontWeight='semibold'>
                    Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder='Enter your password'
                      bg='white'
                      borderColor='gray.300'
                      _hover={{ borderColor: 'brand.400' }}
                      _focus={{
                        borderColor: 'brand.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                      }}
                      size='lg'
                    />
                    <InputRightElement h='full'>
                      <IconButton
                        variant='ghost'
                        onClick={togglePasswordVisibility}
                        icon={
                          showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )
                        }
                        size='sm'
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Flex justify='space-between' w='full' align='center'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setRememberMe(!rememberMe)}
                    color={rememberMe ? 'brand.600' : 'gray.600'}
                    fontWeight={rememberMe ? 'semibold' : 'normal'}
                  >
                    ✓ Remember me
                  </Button>

                  <Link
                    color='brand.600'
                    fontSize='sm'
                    fontWeight='medium'
                    _hover={{ color: 'brand.700', textDecoration: 'underline' }}
                  >
                    Forgot password?
                  </Link>
                </Flex>

                {message && (
                  <Alert status='error' borderRadius='md'>
                    <AlertIcon />
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type='submit'
                  colorScheme='brand'
                  size='lg'
                  w='full'
                  py={6}
                  fontSize='lg'
                  isLoading={isLoading}
                  loadingText='Signing in...'
                  _hover={{
                    bg: 'brand.600',
                    transform: 'translateY(-1px)',
                    shadow: 'lg',
                  }}
                  transition='all 0.2s'
                >
                  Sign In
                </Button>

                <HStack w='full'>
                  <Divider />
                  <Text fontSize='sm' color='gray.500' px={2}>
                    OR
                  </Text>
                  <Divider />
                </HStack>

                <Button
                  variant='outline'
                  size='lg'
                  w='full'
                  py={6}
                  fontSize='md'
                  colorScheme='brand'
                  _hover={{ bg: 'brand.50', transform: 'translateY(-1px)' }}
                  transition='all 0.2s'
                >
                  Continue with SSO
                </Button>
              </VStack>
            </Box>
          </CardBody>
        </Card>

        <VStack spacing={2} textAlign='center'>
          <Text color='gray.500' fontSize='sm'>
            Need access? Contact your system administrator
          </Text>

          <HStack spacing={4} fontSize='sm'>
            <Link color='brand.600' _hover={{ color: 'brand.700' }}>
              Support
            </Link>
            <Text color='gray.400'>•</Text>
            <Link color='brand.600' _hover={{ color: 'brand.700' }}>
              Privacy Policy
            </Link>
            <Text color='gray.400'>•</Text>
            <Link color='brand.600' _hover={{ color: 'brand.700' }}>
              Terms of Service
            </Link>
          </HStack>
        </VStack>
      </VStack>
    </Container>
  );
};

export default StaffSignIn;
