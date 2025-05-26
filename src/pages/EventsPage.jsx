import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
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
} from '@chakra-ui/react';
import { ExternalLinkIcon, CalendarIcon, DownloadIcon } from '@chakra-ui/icons';

const EventsPage = ({ baseUrl }) => {
  const [showSignupFormId, setShowSignupFormId] = useState({});
  const [emailInput, setEmailInput] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 20;

  const capitaliseFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

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
      event.description
    )}&location=${encodeURIComponent(
      event.location.address + ', ' + event.location.city
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
LOCATION:${event.location.address}, ${event.location.city}
DESCRIPTION:${event.description}
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

  const handleSignup = (eventId, eventName) => {
    console.log('Sign up email:', emailInput, 'for event:', eventId);
    alert(`Signed up ${emailInput} for ${eventName}`);
    setEmailInput('');
    setShowSignupFormId(null);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${baseUrl}events`);
        setEvents(response.data);
      } catch (error) {
        console.error(`Error retrieving events:`, error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
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

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

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

        <VStack spacing={6} align='stretch'>
          {currentEvents.map((eventWrapper, index) => (
            <Card
              p={3}
              key={eventWrapper._id || index}
              shadow='lg'
              borderRadius='xl'
            >
              <CardHeader borderTopRadius='xl'>
                <VStack align='start' spacing={2}>
                  <Badge colorScheme='orange' fontSize='sm' fontWeight='bold'>
                    Event Organiser
                  </Badge>
                  <Heading size='lg' fontStyle='italic' color='brown.700'>
                    {eventWrapper.organiser.firstName}{' '}
                    {eventWrapper.organiser.lastName}
                  </Heading>
                  <Text color='gray.600' fontSize='sm'>
                    Event Date:{' '}
                    {new Date(eventWrapper.timestamp_day).toLocaleDateString()}
                  </Text>
                </VStack>
              </CardHeader>

              <CardBody>
                <VStack spacing={6} align='stretch'>
                  <Heading size='md' color='brown.600'>
                    Individual Events
                  </Heading>

                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    {eventWrapper.events.map((singleEvent) => (
                      <Card
                        key={singleEvent._id}
                        variant='outline'
                        borderColor='brown.200'
                        p={4}
                        height='100%'
                        display='flex'
                        flexDirection='column'
                      >
                        <CardBody
                          flex='1'
                          display='flex'
                          flexDirection='column'
                        >
                          <VStack spacing={4} align='stretch' flex='1'>
                            {singleEvent.image && (
                              <Image
                                src={singleEvent.image}
                                alt={singleEvent.name}
                                borderRadius='md'
                                objectFit='cover'
                                w='full'
                                h='100%'
                                maxH='10rem'
                              />
                            )}

                            <Heading size='md' color='brown.700'>
                              {capitaliseFirstLetter(singleEvent.name)}
                            </Heading>

                            <Badge colorScheme='blue' alignSelf='start'>
                              {new Date(singleEvent.date).toLocaleDateString()}
                            </Badge>

                            <Box>
                              <Text
                                fontWeight='semibold'
                                color='gray.700'
                                mb={1}
                              >
                                Location:
                              </Text>
                              <Text color='gray.600' fontSize='sm'>
                                {singleEvent.location.address},{' '}
                                {singleEvent.location.city}(
                                {singleEvent.location.zip_code})
                              </Text>
                            </Box>

                            <Box>
                              <Text
                                fontWeight='semibold'
                                color='gray.700'
                                mb={2}
                              >
                                Description:
                              </Text>
                              <Text
                                color='gray.600'
                                fontSize='sm'
                                noOfLines={10}
                                w='full'
                                maxW='512px'
                              >
                                {singleEvent.description}
                              </Text>
                            </Box>

                            <VStack spacing={3} align='stretch'>
                              <Button
                                colorScheme='brand'
                                onClick={() =>
                                  setShowSignupFormId(
                                    showSignupFormId === singleEvent._id
                                      ? null
                                      : singleEvent._id
                                  )
                                }
                                leftIcon={<CalendarIcon />}
                                size='sm'
                              >
                                {showSignupFormId === singleEvent._id
                                  ? 'Cancel'
                                  : 'Sign Up'}
                              </Button>

                              <Collapse
                                in={showSignupFormId === singleEvent._id}
                              >
                                <VStack
                                  spacing={4}
                                  p={4}
                                  bg='gray.50'
                                  borderRadius='md'
                                >
                                  <FormControl>
                                    <FormLabel fontSize='sm'>
                                      Email Address
                                    </FormLabel>
                                    <Input
                                      type='email'
                                      placeholder='Enter your email'
                                      value={emailInput}
                                      onChange={(e) =>
                                        setEmailInput(e.target.value)
                                      }
                                      bg='white'
                                      size='sm'
                                    />
                                  </FormControl>

                                  <Button
                                    colorScheme='green'
                                    size='sm'
                                    w='full'
                                    onClick={() =>
                                      handleSignup(
                                        singleEvent._id,
                                        singleEvent.name
                                      )
                                    }
                                  >
                                    Confirm Registration
                                  </Button>

                                  <Divider />

                                  <VStack w='full' spacing={2}>
                                    <Button
                                      as='a'
                                      href={generateGoogleCalendarUrl(
                                        singleEvent
                                      )}
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
                                      onClick={() => downloadICS(singleEvent)}
                                    >
                                      Download .ics
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
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>

        <Flex justify='center' align='center' gap={4} pt={8}>
          <Button
            variant='outline'
            colorScheme='brown'
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            isDisabled={currentPage === 1}
          >
            Previous
          </Button>

          <Badge colorScheme='brown' px={4} py={2} fontSize='md'>
            Page {currentPage} of {totalPages}
          </Badge>

          <Button
            variant='outline'
            colorScheme='brown'
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            isDisabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
};

export default EventsPage;
