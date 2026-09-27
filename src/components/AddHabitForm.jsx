import { useState } from 'react';

function AddHabitForm({ onAddHabit }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    onAddHabit({ name: name.trim(), description: description.trim() });
    setName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="panel add-habit-panel">
      <div className="panel-heading">
        <h2>Add habit</h2>
      </div>

      <div className="form-stack">
        <div className="field-group">
          <label htmlFor="name">HABIT NAME</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Read for twenty minutes"
            autoComplete="off"
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="description">NOTE <span>/ OPTIONAL</span></label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="After dinner, before screens"
            autoComplete="off"
          />
        </div>

        <button type="submit" className="primary-button">
          Create habit
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}

export default AddHabitForm;
