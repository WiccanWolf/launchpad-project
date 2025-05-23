import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
} from '@chakra-ui/react';

const LoginButton = ({ baseUrl }) => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${baseUrl}staff-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('Login successful');
        console.log(`Logged in Staff: ${data.staff}`);
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(`Network Error: ${err}`);
      setMessage(`Login failed: Network Error`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxW='md' py={20}>
        <VStack spacing={8}>
          <VStack spacing={4} textAlign='center'>
            <Heading size='2xl' color='brand.700'>
              Welcome
            </Heading>
            <Text color='gray.600' fontSize='lg'>
              Please log in to access the Community Events Platform
            </Text>
          </VStack>

          <Card w='full' shadow='xl' borderRadius='xl'>
            <CardBody p={8}>
              <VStack spacing={6}>
                <Button
                  colorScheme='brand'
                  size='lg'
                  w='full'
                  py={6}
                  fontSize='lg'
                  onClick={() =>
                    loginWithRedirect({
                      authorizationParams: {
                        scope:
                          'openid profile email https://www.googleapis.com/auth/calendar.events',
                      },
                    })
                  }
                >
                  Log In with Auth0
                </Button>

                {/* Commented out staff login form as in original */}
                {/* 
                <Divider />
                
                <VStack spacing={4} w="full">
                  <Heading size="md" color="gray.700">
                    Staff Login
                  </Heading>
                  
                  <Box as="form" onSubmit={handleLogin} w="full">
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          bg="white"
                        />
                      </FormControl>
                      
                      <FormControl isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          bg="white"
                        />
                      </FormControl>
                      
                      <Button
                        type="submit"
                        colorScheme="blue"
                        w="full"
                        isLoading={isLoading}
                        loadingText="Logging in..."
                      >
                        Staff Log In
                      </Button>
                      
                      {message && (
                        <Alert status={message.includes('successful') ? 'success' : 'error'}>
                          <AlertIcon />
                          <AlertDescription>{message}</AlertDescription>
                        </Alert>
                      )}
                    </VStack>
                  </Box>
                </VStack>
                */}
              </VStack>
            </CardBody>
          </Card>

          <Text color='gray.500' fontSize='sm' textAlign='center'>
            New to the platform? Contact your administrator for access.
          </Text>
        </VStack>
      </Container>
    );
  }

  return null;
};

export default LoginButton;
