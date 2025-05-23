import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Flex,
  Heading,
  Spacer,
  HStack,
  useColorModeValue,
  Container,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  const { isAuthenticated } = useAuth0();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      px={4}
      borderBottom='1px'
      borderColor={borderColor}
      shadow='sm'
      position='sticky'
      top={0}
      zIndex={1000}
    >
      <Container maxW='7xl'>
        <Flex h={16} alignItems='center'>
          <ChakraLink
            as={RouterLink}
            to='/'
            _hover={{ textDecoration: 'none' }}
          >
            <Heading size='lg' color='brand.700' fontWeight='bold'>
              Community Events Platform
            </Heading>
          </ChakraLink>

          <Spacer />

          <HStack spacing={4}>
            {isAuthenticated && (
              <>
                <ChakraLink
                  as={RouterLink}
                  to='/'
                  px={3}
                  py={2}
                  rounded='md'
                  _hover={{
                    textDecoration: 'none',
                    bg: 'brand.50',
                    color: 'brand.700',
                  }}
                  color='gray.600'
                  fontWeight='medium'
                >
                  Home
                </ChakraLink>
                <ChakraLink
                  as={RouterLink}
                  to='/events'
                  px={3}
                  py={2}
                  rounded='md'
                  _hover={{
                    textDecoration: 'none',
                    bg: 'brand.50',
                    color: 'brand.700',
                  }}
                  color='gray.600'
                  fontWeight='medium'
                >
                  Events
                </ChakraLink>
                <LogoutButton />
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
