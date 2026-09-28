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
    <section className="content-card habit-form" aria-label="Add a habit">
      <div className="panel-meta">
        <p className="eyebrow">ADD A HABIT</p>
        <p className="panel-meta__note">Create the next item in your daily list.</p>
      </div>

      <form onSubmit={handleSubmit} className="habit-form__fields">
        <label className="field">
          <span>HABIT NAME</span>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="field-input"
            placeholder="Drink water, move for 30 minutes…"
            required
          />
        </label>

        <label className="field">
          <span>NOTE · OPTIONAL</span>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="field-input"
            placeholder="What counts as done?"
          />
        </label>

        <button type="submit" className="button button-primary habit-form__submit">
          Add habit
        </button>
      </form>
    </section>
  );
}

export default AddHabitForm;
