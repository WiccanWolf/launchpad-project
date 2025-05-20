import axios from 'axios';
import { useState } from 'react';

const AddEventForm = ({ organiserId, baseUrl }) => {
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
      setForm({
        name: '',
        description: '',
        date: '',
        location: { zip_code: '', address: '', city: '' },
        image: '',
      });
    } catch (err) {
      console.error(`Error adding event: ${err}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name='name'
        value={form.name}
        onChange={handleChange}
        placeholder='Event Name'
      />
      <input
        name='date'
        type='date'
        value={form.date}
        onChange={handleChange}
      />
      <input
        name='zip_code'
        value={form.location.zip_code}
        onChange={handleChange}
        placeholder='ZIP Code'
      />
      <input
        name='address'
        value={form.location.address}
        onChange={handleChange}
        placeholder='Address'
      />
      <input
        name='city'
        value={form.location.city}
        onChange={handleChange}
        placeholder='City'
      />
      <input
        name='image'
        value={form.image}
        onChange={handleChange}
        placeholder='Image URL'
      />
      <textarea
        name='description'
        value={form.description}
        onChange={handleChange}
        placeholder='Description'
      />
      <button type='submit'>Add Event</button>
    </form>
  );
};

export default AddEventForm;
