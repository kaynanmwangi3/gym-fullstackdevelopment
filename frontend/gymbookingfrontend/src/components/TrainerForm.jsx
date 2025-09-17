import React, { useState, useEffect } from 'react';

const TrainerForm = ({ onSubmit, initialData = {}, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    specialization: '',
    phone_number: ''
  });

  useEffect(() => {
    if (isEdit && initialData.id) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', bio: '', specialization: '', phone_number: '' });
    }
  }, [initialData, isEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone_number) {
      alert('Name and phone number are required!');
      return;
    }
    onSubmit(isEdit ? 'PATCH' : 'POST', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="trainer-form">
      <h2>{isEdit ? 'Edit Trainer' : 'Add New Trainer'}</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <textarea
        name="bio"
        placeholder="Bio"
        value={formData.bio}
        onChange={handleChange}
        rows="3"
      />
      <input
        type="text"
        name="specialization"
        placeholder="Specialization (optional)"
        value={formData.specialization}
        onChange={handleChange}
      />
      <input
        type="tel"
        name="phone_number"
        placeholder="Phone Number (at least 10 digits)"
        value={formData.phone_number}
        onChange={handleChange}
        required
        minLength="10"
      />
      <button type="submit">{isEdit ? 'Update' : 'Add'}</button>
      {!isEdit && <button type="button" onClick={() => setFormData({ name: '', bio: '', specialization: '', phone_number: '' })}>Reset</button>}
    </form>
  );
};

export default TrainerForm;