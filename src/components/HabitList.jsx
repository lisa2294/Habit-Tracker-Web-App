import HabitItem from './HabitItem';

function HabitList({ habits, completions, onToggleComplete, onEditHabit, onDeleteHabit }) {
  const today = new Date().toISOString().split('T')[0];

  const getStreak = (habitId) => {
    const habitCompletions = completions[habitId] || [];
    if (!habitCompletions.includes(today)) return 0;

    let streak = 0;
    const date = new Date(today);
    while (habitCompletions.includes(date.toISOString().split('T')[0])) {
      streak += 1;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  };

  const totalStreaks = habits.reduce((sum, habit) => sum + getStreak(habit.id), 0);
  const longestStreak = habits.length
    ? Math.max(...habits.map((habit) => getStreak(habit.id)))
    : 0;

  return (
    <section className="habit-section" aria-labelledby="habit-list-title">
      <div className="section-heading">
        <h2 id="habit-list-title">Habits</h2>

        <div className="streak-summary" aria-label="Streak summary">
          <div>
            <span>TOTAL STREAK</span>
            <strong>{String(totalStreaks).padStart(2, '0')}</strong>
          </div>
          <div>
            <span>LONGEST</span>
            <strong>{String(longestStreak).padStart(2, '0')}D</strong>
          </div>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="empty-state">
          <h3>No habits yet</h3>
          <p>Add your first habit above.</p>
        </div>
      ) : (
        <div className="habit-list">
          {habits.map((habit, index) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              index={index + 1}
              isCompletedToday={(completions[habit.id] || []).includes(today)}
              streak={getStreak(habit.id)}
              onToggleComplete={onToggleComplete}
              onEdit={onEditHabit}
              onDelete={onDeleteHabit}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default HabitList;
