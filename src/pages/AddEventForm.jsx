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
  Image,
  Flex,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';

const AddEventForm = ({ baseUrl }) => {
  const toast = useToast();
  const [currentUserId, setCurrentUserId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '',
    location: { zip_code: '', address: '', city: '' },
    image: null,
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG, or GIF image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 5MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setForm((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
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

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('date', form.date);
      formData.append('zip_code', form.location.zip_code);
      formData.append('address', form.location.address);
      formData.append('city', form.location.city);
      formData.append('organiser', currentUserId);

      if (form.image) {
        formData.append('image', form.image);
      }

      await axios.post(`${baseUrl}events`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast({
        title: 'Event added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setForm({
        name: '',
        description: '',
        date: '',
        location: { zip_code: '', address: '', city: '' },
        image: null,
      });
      setPreviewImage(null);
    } catch (err) {
      console.error('Add event error:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.err || 'Could not add event',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
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
            <FormLabel>Event Image</FormLabel>
            <Flex direction='column' gap={2}>
              <Input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                hidden
                id='image-upload'
              />
              <Button
                as='label'
                htmlFor='image-upload'
                leftIcon={<Upload size={16} />}
                variant='outline'
                cursor='pointer'
              >
                Choose Image
              </Button>
              {previewImage && (
                <Box mt={2}>
                  <Image
                    src={previewImage}
                    alt='Preview'
                    maxH='200px'
                    borderRadius='md'
                  />
                  <Text fontSize='sm' color='gray.500' mt={1}>
                    {form.image.name}
                  </Text>
                </Box>
              )}
            </Flex>
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

          <Button
            type='submit'
            colorScheme='brand'
            width='full'
            isLoading={isUploading}
            loadingText='Uploading...'
          >
            Add Event
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddEventForm;
