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
import { useState, useEffect } from 'react';

const AddEventForm = ({ baseUrl }) => {
  const toast = useToast();
  const [currentUserId, setCurrentUserId] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '',
    location: { zip_code: '', address: '', city: '' },
    image: '',
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const { data } = await axios.get(`${baseUrl}auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(data.userId);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    getCurrentUser();
  }, [baseUrl]);

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
    if (!currentUserId) {
      toast({
        title: 'Error',
        description: 'Unable to identify current user. Please log in again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const payload = { ...form, organiser: currentUserId };
      await axios.post(`${baseUrl}events`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast({
        title: 'Event added',
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
      console.error('Add event error:', err);
      toast({
        title: 'Error',
        description: 'Could not add event',
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
