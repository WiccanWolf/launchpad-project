import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  Text,
  Input,
  Image,
  VStack,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Divider,
  SimpleGrid,
  FormControl,
  FormLabel,
  Collapse,
  useToast,
} from '@chakra-ui/react';
import { ExternalLinkIcon, CalendarIcon, DownloadIcon } from '@chakra-ui/icons';

const EventsPage = ({ baseUrl }) => {
  const [showSignupFormId, setShowSignupFormId] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [signupLoading, setSignupLoading] = useState(false);
  const eventsPerPage = 20;
  const toast = useToast();

  const generateGoogleCalendarUrl = (event) => {
    const start = new Date(event.date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const formatDate = (date) =>
      date.toISOString().replace(/[-:]|(\.\d{3})/g, '');

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.name
    )}&dates=${formatDate(start)}/${formatDate(
      end
    )}&details=${encodeURIComponent(
      event.description || ''
    )}&location=${encodeURIComponent(
      (event.location?.address || '') + ', ' + (event.location?.city || '')
    )}&sf=true&output=xml`;
  };

  const downloadICS = (event) => {
    const start = new Date(event.date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const pad = (n) => (n < 10 ? '0' + n : n);

    const formatICSDate = (date) => {
      return (
        date.getUTCFullYear().toString() +
        pad(date.getUTCMonth() + 1) +
        pad(date.getUTCDate()) +
        'T' +
        pad(date.getUTCHours()) +
        pad(date.getUTCMinutes()) +
        pad(date.getUTCSeconds()) +
        'Z'
      );
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.name}
DTSTART:${formatICSDate(start)}
DTEND:${formatICSDate(end)}
LOCATION:${
      (event.location?.address || '') + ', ' + (event.location?.city || '')
    }
DESCRIPTION:${event.description || ''}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.name}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSignup = async (eventId, eventName) => {
    if (!emailInput.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSignupLoading(true);

    try {
      const response = await fetch(`${baseUrl}events/${eventId}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailInput.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      toast({
        title: 'Registration Successful!',
        description: `You've been registered for "${eventName}" with email: ${emailInput}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setEmailInput('');
      setShowSignupFormId(null);
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'An error occurred during registration.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSignupLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await fetch(`${baseUrl}events`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data || []);
      } catch (error) {
        console.error(`Error retrieving events:`, error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, [baseUrl]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  if (loading) {
    return (
      <Container centerContent py={20}>
        <VStack spacing={4}>
          <Spinner size='xl' color='brand.500' thickness='4px' />
          <Heading size='lg' color='gray.600'>
            Loading Event Data...
          </Heading>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container py={10}>
        <Alert status='error' borderRadius='lg'>
          <AlertIcon />
          <AlertDescription>Failed to Load Event Data.</AlertDescription>
        </Alert>
      </Container>
    );
  }

  const validEvents = events.filter(
    (event) => event && event.name && event.date
  );

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = validEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(validEvents.length / eventsPerPage);

  if (validEvents.length === 0) {
    return (
      <Container py={10}>
        <Alert status='info' borderRadius='lg'>
          <AlertIcon />
          <AlertDescription>No events found.</AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW='7xl' py={8}>
      <VStack spacing={8} align='stretch'>
        <Heading
          size='2xl'
          textAlign='center'
          fontSize='2em'
          color='brown.700'
          mb={4}
        >
          Community Events
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {currentEvents.map((event, index) => (
            <Card
              key={event._id || index}
              shadow='lg'
              borderRadius='xl'
              height='100%'
              display='flex'
              flexDirection='column'
            >
              <CardBody flex='1' display='flex' flexDirection='column'>
                <VStack spacing={4} align='stretch' flex='1'>
                  {event.image && (
                    <Image
                      src={event.image}
                      alt={event.name}
                      borderRadius='md'
                      objectFit='cover'
                      w='full'
                      h='200px'
                    />
                  )}

                  <VStack align='start' spacing={2}>
                    <Heading size='md' color='brown.700'>
                      {event.name}
                    </Heading>

                    <Badge colorScheme='blue' alignSelf='start'>
                      {new Date(event.date).toLocaleDateString()}
                    </Badge>

                    {event.organiser ? (
                      <VStack align='start' spacing={1}>
                        <Badge colorScheme='orange' fontSize='xs'>
                          Organised by
                        </Badge>
                        <Text fontSize='sm' color='gray.600'>
                          {event.organiser.firstName} {event.organiser.lastName}{' '}
                          {event.organiser.email && (
                            <Text
                              as='span'
                              fontSize='xs'
                              color='gray.500'
                              display='block'
                            >
                              {event.organiser.email}
                            </Text>
                          )}
                        </Text>
                      </VStack>
                    ) : (
                      <Badge colorScheme='gray' fontSize='xs'>
                        No Organiser Assigned
                      </Badge>
                    )}
                  </VStack>

                  <Box>
                    <Text fontWeight='semibold' color='gray.700' mb={1}>
                      Location:
                    </Text>
                    <Text color='gray.600' fontSize='sm'>
                      {event.location?.address || 'Address not provided'}
                      {event.location?.city && `, ${event.location.city}`}
                      {event.location?.zip_code &&
                        ` (${event.location.zip_code})`}
                    </Text>
                  </Box>

                  <Box flex='1'>
                    <Text fontWeight='semibold' color='gray.700' mb={2}>
                      Description:
                    </Text>
                    <Text color='gray.600' fontSize='sm' noOfLines={4}>
                      {event.description || 'No description provided'}
                    </Text>
                  </Box>

                  <VStack spacing={3} align='stretch' mt='auto'>
                    <Button
                      colorScheme='brand'
                      onClick={() =>
                        setShowSignupFormId(
                          showSignupFormId === event._id ? null : event._id
                        )
                      }
                      leftIcon={<CalendarIcon />}
                      size='sm'
                    >
                      {showSignupFormId === event._id ? 'Cancel' : 'Sign Up'}
                    </Button>

                    <Collapse in={showSignupFormId === event._id}>
                      <VStack spacing={4} p={4} bg='gray.50' borderRadius='md'>
                        <FormControl>
                          <FormLabel fontSize='sm'>Email Address</FormLabel>
                          <Input
                            type='email'
                            placeholder='Enter your email'
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            bg='white'
                            size='sm'
                          />
                        </FormControl>

                        <Button
                          colorScheme='green'
                          size='sm'
                          w='full'
                          onClick={() => handleSignup(event._id, event.name)}
                          isLoading={signupLoading}
                          loadingText='Registering...'
                          isDisabled={!emailInput.trim()}
                        >
                          Confirm Registration
                        </Button>

                        <Divider />

                        <VStack w='full' spacing={2}>
                          <Button
                            as='a'
                            href={generateGoogleCalendarUrl(event)}
                            target='_blank'
                            rel='noreferrer'
                            size='sm'
                            variant='outline'
                            colorScheme='brand'
                            w='full'
                            leftIcon={<ExternalLinkIcon />}
                          >
                            Google Calendar
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            colorScheme='brand'
                            w='full'
                            leftIcon={<DownloadIcon />}
                            onClick={() => downloadICS(event)}
                          >
                            Download iCalendar
                          </Button>
                        </VStack>
                      </VStack>
                    </Collapse>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {totalPages > 0 && (
          <Flex justify='center' align='center' gap={4} pt={8}>
            <Button
              variant='outline'
              colorScheme='brand'
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              isDisabled={currentPage === 1}
            >
              Previous
            </Button>

            <Badge colorScheme='brand.50' px={4} py={2} fontSize='md'>
              Page {currentPage} of {totalPages}
            </Badge>

            <Button
              variant='outline'
              colorScheme='brand'
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              isDisabled={currentPage === totalPages}
            >
              Next
            </Button>
          </Flex>
        )}
      </VStack>
    </Container>
  );
};

export default EventsPage;
