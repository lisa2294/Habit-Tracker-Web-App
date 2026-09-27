import { useState } from 'react';

function HabitItem({ habit, index, isCompletedToday, streak, onToggleComplete, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editDescription, setEditDescription] = useState(habit.description || '');

  const handleEditSubmit = (event) => {
    event.preventDefault();
    if (!editName.trim()) return;

    onEdit(habit.id, {
      name: editName.trim(),
      description: editDescription.trim(),
    });
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditName(habit.name);
    setEditDescription(habit.description || '');
    setIsEditing(false);
  };

  return (
    <article className={`habit-item ${isCompletedToday ? 'is-complete' : ''}`}>
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <div className="edit-fields">
            <div className="field-group">
              <label htmlFor={`edit-name-${habit.id}`}>HABIT NAME</label>
              <input
                id={`edit-name-${habit.id}`}
                type="text"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                required
              />
            </div>
            <div className="field-group">
              <label htmlFor={`edit-description-${habit.id}`}>NOTE / OPTIONAL</label>
              <input
                id={`edit-description-${habit.id}`}
                type="text"
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                placeholder="Add a useful cue"
              />
            </div>
          </div>
          <div className="edit-actions">
            <button type="submit" className="primary-button compact">Save changes</button>
            <button type="button" onClick={handleEditCancel} className="ghost-button compact">Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <button
            type="button"
            onClick={() => onToggleComplete(habit.id)}
            className="completion-toggle"
            aria-pressed={isCompletedToday}
            aria-label={`${isCompletedToday ? 'Mark incomplete' : 'Mark complete'}: ${habit.name}`}
          >
            {isCompletedToday ? '✓' : String(index).padStart(2, '0')}
          </button>

          <div className="habit-copy">
            <div className="habit-title-row">
              <h3>{habit.name}</h3>
              {isCompletedToday && <span className="completion-label">COMPLETE</span>}
            </div>
            {habit.description && <p>{habit.description}</p>}
          </div>

          <div className="habit-meta">
            <span>STREAK</span>
            <strong>{String(streak).padStart(2, '0')} DAYS</strong>
          </div>

          <div className="habit-actions">
            <button type="button" onClick={() => setIsEditing(true)} className="text-button">
              Edit
            </button>
            <button type="button" onClick={() => onDelete(habit.id)} className="text-button delete-button">
              Delete
            </button>
          </div>
        </>
      )}
    </article>
  );
}

export default HabitItem;
