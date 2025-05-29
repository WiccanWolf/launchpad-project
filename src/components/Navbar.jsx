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
  Badge,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import StaffLogoutButton from './StaffLogoutButton';
import { FaUserShield } from 'react-icons/fa';

const Navbar = ({ isStaff }) => {
  const { isAuthenticated } = useAuth0();

  const bgColor = isStaff
    ? useColorModeValue('brand.100', 'brand.800')
    : useColorModeValue('white', 'gray.800');

  const borderColor = isStaff
    ? useColorModeValue('brand.300', 'brand.600')
    : useColorModeValue('gray.200', 'gray.700');

  const brandColor = isStaff
    ? useColorModeValue('brand.700', 'brand.200')
    : useColorModeValue('brand.700', 'brand.300');

  const hoverBg = isStaff
    ? useColorModeValue('brand.200', 'brand.700')
    : useColorModeValue('brand.50', 'gray.700');

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
            to='/home'
            _hover={{ textDecoration: 'none' }}
          >
            <Heading size='lg' color='brand.700' fontWeight='bold'>
              Flourish
              {isStaff && (
                <Badge
                  ml={2}
                  colorScheme='brand'
                  variant='solid'
                  display='inline-flex'
                  alignItems='center'
                >
                  <Box as={FaUserShield} mr={1} />
                  Staff
                </Badge>
              )}
            </Heading>
          </ChakraLink>

          <Spacer />

          <HStack spacing={4}>
            {(isAuthenticated || isStaff) && (
              <>
                <ChakraLink
                  as={RouterLink}
                  to='/home'
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
                {isAuthenticated ? <LogoutButton /> : <StaffLogoutButton />}
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
