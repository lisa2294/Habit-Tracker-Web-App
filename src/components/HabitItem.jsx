import { useState } from 'react';

function HabitItem({ habit, isCompletedToday, streak, onToggleComplete, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editDescription, setEditDescription] = useState(habit.description);

  const handleEditSubmit = (event) => {
    event.preventDefault();
    if (!editName.trim()) return;

    onEdit(habit.id, { name: editName.trim(), description: editDescription.trim() });
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditName(habit.name);
    setEditDescription(habit.description);
    setIsEditing(false);
  };

  return (
    <article className={`habit-card ${isCompletedToday ? 'is-complete' : ''}`}>
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="habit-edit-form">
          <label className="field">
            <span>HABIT NAME</span>
            <input
              type="text"
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
              className="field-input"
              required
            />
          </label>
          <label className="field">
            <span>NOTE · OPTIONAL</span>
            <input
              type="text"
              value={editDescription}
              onChange={(event) => setEditDescription(event.target.value)}
              className="field-input"
              placeholder="What counts as done?"
            />
          </label>
          <div className="habit-edit-form__actions">
            <button type="submit" className="button button-primary">Save</button>
            <button type="button" onClick={handleEditCancel} className="button button-outline">Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div className="habit-card__main">
            <button
              type="button"
              onClick={() => onToggleComplete(habit.id)}
              className="completion-toggle"
              aria-pressed={isCompletedToday}
              aria-label={isCompletedToday ? `Mark ${habit.name} incomplete` : `Mark ${habit.name} complete`}
            >
              {isCompletedToday ? '✓' : habit.icon || '·'}
            </button>

            <div className="habit-card__copy">
              <p className="eyebrow">{isCompletedToday ? 'COMPLETE' : 'IN PROGRESS'}</p>
              <p className="habit-card__name">{habit.name}</p>
              {habit.description && <p className="habit-card__description">{habit.description}</p>}
              <div className="habit-meta" aria-label={`${streak} day streak`}>
                <span>{streak}-day streak</span>
                {streak >= 7 && <span>7-day mark</span>}
                {streak >= 30 && <span>30-day mark</span>}
              </div>
            </div>
          </div>

          <div className="habit-card__actions">
            <button type="button" onClick={() => setIsEditing(true)} className="button button-quiet">Edit</button>
            <button type="button" onClick={() => onDelete(habit.id)} className="button button-quiet">Delete</button>
          </div>
        </>
      )}
    </article>
  );
}

export default HabitItem;
