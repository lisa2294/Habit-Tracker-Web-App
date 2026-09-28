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
  const longestStreak = habits.length > 0 ? Math.max(...habits.map((habit) => getStreak(habit.id))) : 0;

  return (
    <section className="habits-section" aria-label="Your habits">
      <header className="inline-section-header">
        <div>
          <p className="eyebrow">YOUR HABITS</p>
          <p className="inline-section-header__summary">
            {habits.length === 0 ? 'Your list is empty.' : `${habits.length} habit${habits.length === 1 ? '' : 's'} in today’s list.`}
          </p>
        </div>

        {habits.length > 0 && (
          <dl className="streak-summary">
            <div>
              <dt>CURRENT STREAKS</dt>
              <dd>{totalStreaks} days</dd>
            </div>
            <div>
              <dt>LONGEST</dt>
              <dd>{longestStreak} days</dd>
            </div>
          </dl>
        )}
      </header>

      {habits.length === 0 ? (
        <div className="content-card empty-state">
          <p className="eyebrow">NOTHING TO CHECK OFF YET</p>
          <p className="empty-state__title">Add the first habit you want to complete today.</p>
          <p>Once it is in the list, use the check control to record completion.</p>
        </div>
      ) : (
        <div className="habit-list">
          {habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
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
