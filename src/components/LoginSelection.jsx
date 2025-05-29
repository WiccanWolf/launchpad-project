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
  Divider,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, UserPlus } from 'lucide-react';

const LoginSelection = () => {
  const navigate = useNavigate();
  const handleUserLogin = () => {
    navigate('/user-login');
  };
  const handleStaffLogin = () => {
    navigate('/staff-login');
  };
  const handleStaffSignUp = () => {
    navigate('/staff-signup');
  };

  return (
    <Container maxW='md' py={20}>
      <VStack spacing={8}>
        <VStack spacing={4} textAlign='center'>
          <Heading size='2xl' color='brand.700'>
            Welcome to Flourish
          </Heading>
          <Text color='grey.600' fontSize='lg'>
            Choose how you'd like to sign in to access the platform:
          </Text>
        </VStack>
        <Card w='full' shadow='xl' borderRadius='xl'>
          <CardBody p={8}>
            <VStack spacing={6}>
              <VStack spacing={4} w='full'>
                <HStack spacing={3}>
                  <Box
                    w={10}
                    h={10}
                    bg='brand.500'
                    borderRadius='lg'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    color='white'
                  >
                    <Users size={20} />
                  </Box>
                  <VStack align='start' spacing={1}>
                    <Text fontSize='lg' fontWeight='semibold' color='brand.800'>
                      Community Members
                    </Text>
                    <Text fontSize='sm' color='brand.600'>
                      Browse and join events in your area
                    </Text>
                  </VStack>
                </HStack>

                <Button
                  colorScheme='brand'
                  size='lg'
                  w='full'
                  py={6}
                  fontSize='lg'
                  onClick={handleUserLogin}
                  _hover={{
                    bg: 'brand.700',
                    transform: 'translateY(-1px)',
                    shadow: 'lg',
                  }}
                  transition='all 0.2s'
                >
                  Sign In as Community Member
                </Button>
              </VStack>

              <HStack w='full'>
                <Divider />
                <Text fontSize='sm' color='brand.500' px={2}>
                  OR
                </Text>
                <Divider />
              </HStack>

              <VStack spacing={4} w='full'>
                <HStack spacing={3}>
                  <Box
                    w={10}
                    h={10}
                    bg='brand.600'
                    borderRadius='lg'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    color='white'
                  >
                    <Shield size={20} />
                  </Box>
                  <VStack align='start' spacing={1}>
                    <Text fontSize='lg' fontWeight='semibold' color='brand.800'>
                      Staff Members
                    </Text>
                    <Text fontSize='sm' color='brand.600'>
                      Manage events and platform administration
                    </Text>
                  </VStack>
                </HStack>

                <Button
                  variant='outline'
                  colorScheme='brand'
                  size='lg'
                  w='full'
                  py={6}
                  fontSize='lg'
                  onClick={handleStaffLogin}
                  _hover={{
                    bg: 'brand.50',
                    transform: 'translateY(-1px)',
                    shadow: 'lg',
                  }}
                  transition='all 0.2s'
                >
                  Staff Sign In
                </Button>

                <Button
                  leftIcon={<UserPlus size={20} />}
                  variant='ghost'
                  colorScheme='brand'
                  size='md'
                  w='full'
                  onClick={handleStaffSignUp}
                  _hover={{
                    bg: 'brand.100',
                    transform: 'translateY(-1px)',
                    shadow: 'lg',
                  }}
                  transition='all 0.2s'
                >
                  Create Staff Account
                </Button>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        <VStack spacing={2} textAlign='center'>
          <Text color='brand.500' fontSize='sm'>
            New to the platform? Contact your administrator for access.
          </Text>

          <HStack spacing={4} fontSize='sm'>
            <Text
              color='brand.600'
              cursor='pointer'
              _hover={{ color: 'brand.700' }}
            >
              Support
            </Text>
            <Text color='brand.400'>•</Text>
            <Text
              color='brand.600'
              cursor='pointer'
              _hover={{ color: 'brand.700' }}
            >
              About
            </Text>
            <Text color='brand.400'>•</Text>
            <Text
              color='brand.600'
              cursor='pointer'
              _hover={{ color: 'brand.700' }}
            >
              Contact
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Container>
  );
};

export default LoginSelection;
