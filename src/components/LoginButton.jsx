import { useAuth0 } from '@auth0/auth0-react';
import {
  Button,
  Container,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
} from '@chakra-ui/react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async (e) => {
    await loginWithRedirect({
      appState: {
        returnTo: '/home',
      },
      authorizationParams: {
        scope:
          'openid profile email https://www.googleapis.com/auth/calendar.events',
      },
    });
  };

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
                onClick={handleLogin}
              >
                Log In with Auth0
              </Button>
            </VStack>
          </CardBody>
        </Card>

        <Text color='gray.500' fontSize='sm' textAlign='center'>
          New to the platform? Contact your administrator for access.
        </Text>
      </VStack>
    </Container>
  );
};

export default LoginButton;
