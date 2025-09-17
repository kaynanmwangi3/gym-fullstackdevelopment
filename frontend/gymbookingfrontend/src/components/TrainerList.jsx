import React, { useState, useEffect } from 'react';
import TrainerForm from './TrainerForm';

const TrainerList = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all trainers
  const fetchTrainers = async () => {
    try {
      const response = await fetch('/api/trainers');
      if (!response.ok) throw new Error('Failed to fetch trainers');
      const data = await response.json();
      setTrainers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  // Create or Update trainer
  const handleSubmit = async (method, data) => {
    try {
      const url = editingId ? `/api/get_trainer_by_id/${editingId}` : '/api/trainers';
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      };
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`${method} failed`);
      setShowForm(false);
      setEditingId(null);
      fetchTrainers();  // Refresh list
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Delete trainer
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const response = await fetch(`/api/get_trainer_by_id/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      fetchTrainers();  // Refresh list
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Edit trainer
  const handleEdit = (trainer) => {
    setEditingId(trainer.id);
    setShowForm(true);
  };

  if (loading) return <div>Loading trainers...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="trainer-list">
      <h1>Gym Trainers</h1>
      <button onClick={() => { setShowForm(true); setEditingId(null); }}>
        {showForm ? 'Cancel' : 'Add New Trainer'}
      </button>

      {showForm && (
        <TrainerForm
          onSubmit={handleSubmit}
          initialData={trainers.find(t => t.id === editingId) || {}}
          isEdit={!!editingId}
        />
      )}

      <ul>
        {trainers.map((trainer) => (
          <li key={trainer.id} className="trainer-item">
            <h3>{trainer.name}</h3>
            <p><strong>Bio:</strong> {trainer.bio}</p>
            <p><strong>Specialization:</strong> {trainer.specialization || 'N/A'}</p>
            <p><strong>Phone:</strong> {trainer.phone_number}</p>
            <div className="actions">
              <button onClick={() => handleEdit(trainer)}>Edit</button>
              <button onClick={() => handleDelete(trainer.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {trainers.length === 0 && <p>No trainers found. Add one!</p>}
    </div>
  );
};

export default TrainerList;