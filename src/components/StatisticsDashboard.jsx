function getDateKey(date) {
  return date.toISOString().split('T')[0];
}

function StatisticsDashboard({ habits, completions }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const todayKey = getDateKey(today);
  const totalHabits = habits.length;

  const activeHabits = habits.filter((habit) => (completions[habit.id] || []).length > 0).length;

  const currentStreaks = habits.map((habit) => {
    const habitCompletions = completions[habit.id] || [];
    if (!habitCompletions.includes(todayKey)) return 0;

    let streak = 0;
    const date = new Date(today);
    while (habitCompletions.includes(getDateKey(date))) {
      streak += 1;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  });

  const longestCurrentStreak = Math.max(...currentStreaks, 0);
  const daysElapsed = today.getDate();
  const monthlyCompletions = Array.from({ length: daysElapsed }, (_, index) => {
    const date = new Date(currentYear, currentMonth, index + 1);
    const dateKey = getDateKey(date);
    return habits.filter((habit) => (completions[habit.id] || []).includes(dateKey)).length;
  });
  const avgMonthlyCompletion = monthlyCompletions.reduce((sum, total) => sum + total, 0) / daysElapsed;
  const monthlyCompletionRate = totalHabits > 0 ? Math.round((avgMonthlyCompletion / totalHabits) * 100) : 0;

  const habitStats = habits.map((habit) => {
    const habitCompletions = completions[habit.id] || [];
    const createdAt = new Date(habit.createdAt);
    const trackedDays = Math.max(1, Math.floor((today - createdAt) / (1000 * 60 * 60 * 24)) + 1);
    const completionRate = Math.min(100, Math.round((habitCompletions.length / trackedDays) * 100));

    return {
      ...habit,
      completionCount: habitCompletions.length,
      completionRate,
    };
  }).sort((firstHabit, secondHabit) => secondHabit.completionRate - firstHabit.completionRate);

  const recentActivity = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - 13 + index);
    const dateKey = getDateKey(date);
    const completed = habits.filter((habit) => (completions[habit.id] || []).includes(dateKey)).length;

    return { date, completed, isToday: index === 13 };
  });

  return (
    <section className="statistics-panel" aria-label="Habit statistics">
      <div className="panel-meta statistics-panel__meta">
        <p className="eyebrow">MONTH TO DATE</p>
        <p className="panel-meta__note">{today.toLocaleString('en-US', { month: 'long' })} activity so far.</p>
      </div>

      <div className="metrics-grid" aria-label="Habit statistics">
        <article className="metric-card">
          <p>TOTAL HABITS</p>
          <strong>{totalHabits}</strong>
          <span>in your list</span>
        </article>
        <article className="metric-card">
          <p>ACTIVE HABITS</p>
          <strong>{activeHabits}</strong>
          <span>with a check-in</span>
        </article>
        <article className="metric-card">
          <p>LONGEST STREAK</p>
          <strong>{longestCurrentStreak}</strong>
          <span>days in sequence</span>
        </article>
        <article className="metric-card metric-card--accent">
          <p>MONTHLY AVERAGE</p>
          <strong>{monthlyCompletionRate}%</strong>
          <span>completed so far</span>
        </article>
      </div>

      <div className="statistics-grid">
        <section className="content-card ranking-panel" aria-label="Top habits">
          <div className="panel-meta">
            <p className="eyebrow">CONSISTENCY RANKING</p>
            <p className="panel-meta__note">Habits with the strongest completion rate.</p>
          </div>

          {habitStats.length > 0 ? (
            <ol className="ranking-list">
              {habitStats.slice(0, 3).map((habit, index) => (
                <li key={habit.id}>
                  <span className="ranking-list__rank">0{index + 1}</span>
                  <span className="ranking-list__icon" aria-hidden="true">{habit.icon || '·'}</span>
                  <span className="ranking-list__habit">
                    <strong>{habit.name}</strong>
                    <small>{habit.completionCount} entries recorded</small>
                  </span>
                  <span className="ranking-list__rate">{habit.completionRate}%</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty-copy">Add habits and check them off to build your ranking.</p>
          )}
        </section>

        <section className="content-card activity-panel" aria-label="Recent activity">
          <div className="panel-meta">
            <p className="eyebrow">RECENT ACTIVITY</p>
            <p className="panel-meta__note">Completion count for the last 14 days.</p>
          </div>
          <div className="activity-chart" role="img" aria-label="Completion chart for the last 14 days">
            {recentActivity.map(({ date, completed, isToday }) => {
              const height = totalHabits > 0 ? (completed / totalHabits) * 100 : 0;
              return (
                <div className="activity-chart__column" key={date.toISOString()}>
                  <div className="activity-chart__track">
                    <i
                      className={`activity-chart__bar ${isToday ? 'is-today' : ''}`}
                      style={{ height: `${Math.max(height, completed > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                  <span>{date.getDate()}</span>
                </div>
              );
            })}
          </div>
          <p className="activity-panel__caption">{monthlyCompletionRate}% average completion rate this month.</p>
        </section>
      </div>
    </section>
  );
}

export default StatisticsDashboard;
