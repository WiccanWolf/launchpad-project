import { Link as RouterLink } from 'react-router-dom';
import AddEventForm from './AddEventForm';
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
  SimpleGrid,
  Badge,
  Link as ChakraLink,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { CalendarIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { keyframes } from '@emotion/react';
import { useAuth0 } from '@auth0/auth0-react';

const Home = ({ baseUrl, isStaff }) => {
  const { isAuthenticated } = useAuth0();

  const animation = keyframes`to {background-position: 200%};`;
  const [showForm, setShowForm] = useState(false);

  return (
    <Container maxW='7xl' py={12}>
      <VStack spacing={12}>
        <VStack spacing={6} textAlign='center'>
          <Heading
            size='4xl'
            bgGradient='linear(to-r, brand.600, brand.400)'
            bgClip='text'
            fontSize='6xl'
            fontWeight='extrabold'
            backgroundSize='200% auto'
            animation={`${animation} 7s ease-in-out infinite alternate`}
          >
            Welcome to Flourish
          </Heading>
          <Text fontSize='xl' color='gray.600' maxW='2xl'>
            Discover and join amazing community events in your area. Connect
            with like-minded people and create lasting memories.
          </Text>
        </VStack>

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={8}
          w='full'
          maxW='4xl'
        >
          <Card
            shadow='lg'
            borderRadius='xl'
            _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s' }}
          >
            <CardBody p={8}>
              <VStack spacing={4}>
                <Icon as={CalendarIcon} boxSize={12} color='brand.500' />
                <Heading size='lg' color='brand.700'>
                  Browse Events
                </Heading>
                <Text textAlign='center' color='gray.600'>
                  Explore all available community events and find something that
                  interests you.
                </Text>
                <ChakraLink
                  as={RouterLink}
                  to='/events'
                  _hover={{ textDecoration: 'none' }}
                >
                  <Button
                    colorScheme='brand'
                    size='lg'
                    rightIcon={<ExternalLinkIcon />}
                  >
                    View All Events
                  </Button>
                </ChakraLink>
              </VStack>
            </CardBody>
          </Card>

          <Card
            shadow='lg'
            borderRadius='xl'
            _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s' }}
            opacity={isAuthenticated && !isStaff ? 0.5 : 1}
            filter={isAuthenticated && !isStaff ? 'grayscale(100%)' : 'none'}
          >
            <CardBody p={8}>
              <VStack spacing={4}>
                <Box
                  boxSize={12}
                  bg='brand.500'
                  borderRadius='full'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                >
                  <Text fontSize='2xl' fontWeight='bold' color='white'>
                    +
                  </Text>
                </Box>
                <Heading size='lg' color='brand.700'>
                  Create Event
                </Heading>
                <Text textAlign='center' color='gray.600'>
                  Organize your own community event and bring people together.
                </Text>
                {isStaff && (
                  <Button
                    colorScheme='brand'
                    variant='outline'
                    size='lg'
                    onClick={() => setShowForm((prev) => !prev)}
                  >
                    {showForm ? 'Cancel' : 'Add New Event'}
                  </Button>
                )}
                {isAuthenticated && !isStaff && (
                  <Box
                    p={3}
                    bg='gray.100'
                    borderRadius='md'
                    textAlign='center'
                    maxW='sm'
                  >
                    <Text fontSize='sm' color='gray.600' fontWeight='medium'>
                      Please Sign in as a Staff Member to create Events
                    </Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {showForm && (
          <Card w='full' maxW='2xl' shadow='xl' borderRadius='xl'>
            <CardBody p={8}>
              <AddEventForm baseUrl={baseUrl} />
            </CardBody>
          </Card>
        )}

        <Card w='full' maxW='4xl' bg='brand.50' borderRadius='xl'>
          <CardBody p={8}>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              gap={8}
              textAlign='center'
            >
              <VStack flex={1}>
                <Heading size='2xl' color='brand.600'>
                  500+
                </Heading>
                <Text color='gray.600'>Community Members</Text>
              </VStack>
              <VStack flex={1}>
                <Heading size='2xl' color='brand.600'>
                  50+
                </Heading>
                <Text color='gray.600'>Events This Month</Text>
              </VStack>
              <VStack flex={1}>
                <Heading size='2xl' color='brand.600'>
                  25+
                </Heading>
                <Text color='gray.600'>Active Organizers</Text>
              </VStack>
            </Flex>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default Home;
