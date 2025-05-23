import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';

const AddEventForm = ({ organiserId, baseUrl }) => {
  const toast = useToast();

  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '',
    location: { zip_code: '', address: '', city: '' },
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['zip_code', 'address', 'city'].includes(name)) {
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEvent = {
      ...form,
      date: new Date(form.date),
    };

    try {
      const response = await axios.post(
        `${baseUrl}events/${organiserId}`,
        newEvent
      );
      console.log(`Updated organiser document: ${response.data}`);
      toast({
        title: 'Event added.',
        description: 'The event was successfully created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setForm({
        name: '',
        description: '',
        date: '',
        location: { zip_code: '', address: '', city: '' },
        image: '',
      });
    } catch (err) {
      console.error(`Error adding event: ${err}`);
      toast({
        title: 'Error',
        description: 'There was a problem adding the event.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW='md'
      mx='auto'
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius='lg'
      boxShadow='md'
    >
      <Heading as='h2' size='lg' mb={6} textAlign='center'>
        Add New Event
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Event Name</FormLabel>
            <Input
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder='Event Name'
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Input
              type='date'
              name='date'
              value={form.date}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>ZIP Code</FormLabel>
            <Input
              name='zip_code'
              value={form.location.zip_code}
              onChange={handleChange}
              placeholder='ZIP Code'
            />
          </FormControl>

          <FormControl>
            <FormLabel>Address</FormLabel>
            <Input
              name='address'
              value={form.location.address}
              onChange={handleChange}
              placeholder='Address'
            />
          </FormControl>

          <FormControl>
            <FormLabel>City</FormLabel>
            <Input
              name='city'
              value={form.location.city}
              onChange={handleChange}
              placeholder='City'
            />
          </FormControl>

          <FormControl>
            <FormLabel>Image URL</FormLabel>
            <Input
              name='image'
              value={form.image}
              onChange={handleChange}
              placeholder='Image URL'
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name='description'
              value={form.description}
              onChange={handleChange}
              placeholder='Description'
              resize='vertical'
            />
          </FormControl>

          <Button type='submit' colorScheme='brand' width='full'>
            Add Event
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddEventForm;
