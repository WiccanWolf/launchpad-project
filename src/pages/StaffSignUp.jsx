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
  Select,
} from '@chakra-ui/react';
import { Eye, EyeOff, User } from 'lucide-react';

const StaffSignUp = ({ baseUrl }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Staff',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

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

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${baseUrl}staff-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Registration successful',
          description: 'Your staff account has been created successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'Staff',
        });
        setMessage('');
      } else {
        setMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Network error. Please try again.');
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the server. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            <User size={32} />
          </Box>

          <Heading size='2xl' color='brand.700'>
            Staff Sign Up
          </Heading>

          <Text color='brand.600' fontSize='lg'>
            Create a new staff account to manage events
          </Text>
        </VStack>

        <Card w='full' shadow='xl' borderRadius='xl'>
          <CardBody p={8}>
            <Box as='form' onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <HStack w='full' spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color='brand.700' fontWeight='semibold'>
                      First Name
                    </FormLabel>
                    <Input
                      name='firstName'
                      type='text'
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder='First name'
                      bg='white'
                      borderColor='brand.300'
                      _hover={{ borderColor: 'brand.400' }}
                      _focus={{
                        borderColor: 'brand.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                      }}
                      size='lg'
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel color='brand.700' fontWeight='semibold'>
                      Last Name
                    </FormLabel>
                    <Input
                      name='lastName'
                      type='text'
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder='Last name'
                      bg='white'
                      borderColor='brand.300'
                      _hover={{ borderColor: 'brand.400' }}
                      _focus={{
                        borderColor: 'brand.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                      }}
                      size='lg'
                    />
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel color='brand.700' fontWeight='semibold'>
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
                      borderColor='brand.300'
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
                  <FormLabel color='brand.700' fontWeight='semibold'>
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
                      borderColor='brand.300'
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

                <FormControl isRequired>
                  <FormLabel color='brand.700' fontWeight='semibold'>
                    Confirm Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      name='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder='Confirm your password'
                      bg='white'
                      borderColor='brand.300'
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
                        onClick={toggleConfirmPasswordVisibility}
                        icon={
                          showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )
                        }
                        size='sm'
                        aria-label={
                          showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel color='brand.700' fontWeight='semibold'>
                    Role
                  </FormLabel>
                  <Select
                    name='role'
                    value={formData.role}
                    onChange={handleChange}
                    bg='white'
                    borderColor='brand.300'
                    _hover={{ borderColor: 'brand.400' }}
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
                    }}
                    size='lg'
                  >
                    <option value='Staff'>Staff</option>
                    <option value='Admin'>Admin</option>
                    <option value='Manager'>Manager</option>
                  </Select>
                </FormControl>

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
                  loadingText='Creating account...'
                  _hover={{ transform: 'translateY(-1px)', shadow: 'lg' }}
                  transition='all 0.2s'
                >
                  Create Account
                </Button>

                <HStack w='full'>
                  <Divider />
                  <Text fontSize='sm' color='brand.500' px={2}>
                    OR
                  </Text>
                  <Divider />
                </HStack>

                <Text color='brand.600' fontSize='sm' textAlign='center'>
                  Already have an account?{' '}
                  <Link
                    href='/staff-login'
                    color='brand.600'
                    fontWeight='medium'
                    _hover={{ color: 'brand.700', textDecoration: 'underline' }}
                  >
                    Sign in here
                  </Link>
                </Text>
              </VStack>
            </Box>
          </CardBody>
        </Card>

        <VStack spacing={2} textAlign='center'>
          <HStack spacing={4} fontSize='sm'>
            <Link color='brand.600' _hover={{ color: 'brand.700' }}>
              Support
            </Link>
            <Text color='brand.400'>•</Text>
            <Link color='brand.600' _hover={{ color: 'brand.700' }}>
              Privacy Policy
            </Link>
            <Text color='brand.400'>•</Text>
            <Link color='brand.600' _hover={{ color: 'brand.700' }}>
              Terms of Service
            </Link>
          </HStack>
        </VStack>
      </VStack>
    </Container>
  );
};

export default StaffSignUp;
