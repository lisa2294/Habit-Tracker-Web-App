function StatisticsDashboard({ habits, completions }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const todayString = today.toISOString().split('T')[0];

  const totalHabits = habits.length;
  const activeHabits = habits.filter((habit) => (
    completions[habit.id] || []
  ).length > 0).length;

  const currentStreaks = habits.map((habit) => {
    const habitCompletions = completions[habit.id] || [];
    if (!habitCompletions.includes(todayString)) return 0;

    let streak = 0;
    const date = new Date(today);
    while (habitCompletions.includes(date.toISOString().split('T')[0])) {
      streak += 1;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  });

  const longestCurrentStreak = Math.max(...currentStreaks, 0);
  const daysElapsed = today.getDate();
  const monthlyCompletions = [];

  for (let day = 1; day <= daysElapsed; day += 1) {
    const date = new Date(currentYear, currentMonth, day);
    const dateString = date.toISOString().split('T')[0];
    const completed = habits.filter((habit) => (
      completions[habit.id] || []
    ).includes(dateString)).length;
    monthlyCompletions.push(completed);
  }

  const averageMonthlyCompletion = monthlyCompletions.reduce((sum, value) => sum + value, 0) / daysElapsed;
  const monthlyCompletionRate = totalHabits
    ? Math.round((averageMonthlyCompletion / totalHabits) * 100)
    : 0;

  const habitStats = habits.map((habit) => {
    const habitCompletions = completions[habit.id] || [];
    const daysActive = Math.max(
      1,
      Math.ceil((today - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24)),
    );

    return {
      ...habit,
      completionCount: habitCompletions.length,
      completionRate: Math.min(100, Math.round((habitCompletions.length / daysActive) * 100)),
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  const topHabits = habitStats.slice(0, 3);
  const recentCompletions = monthlyCompletions.slice(-14);
  const firstChartDay = daysElapsed - recentCompletions.length + 1;

  const metrics = [
    { label: 'Total habits', value: String(totalHabits).padStart(2, '0') },
    { label: 'Active habits', value: String(activeHabits).padStart(2, '0') },
    { label: 'Longest streak', value: `${String(longestCurrentStreak).padStart(2, '0')}D` },
    { label: 'Monthly average', value: `${String(monthlyCompletionRate).padStart(2, '0')}%`, inverted: true },
  ];

  return (
    <section className="statistics-section" aria-label="Habit insights">
      <div className="metric-grid">
        {metrics.map((metric) => (
          <article key={metric.label} className={`metric-card ${metric.inverted ? 'is-inverted' : ''}`}>
            <strong>{metric.value}</strong>
            <p>{metric.label}</p>
          </article>
        ))}
      </div>

      <div className="statistics-grid">
        <article className="panel ranking-panel">
          <div className="panel-heading compact-heading">
            <h3>Top habits</h3>
            <span className="panel-index">Top 3</span>
          </div>

          {topHabits.length > 0 ? (
            <ol className="ranking-list">
              {topHabits.map((habit, index) => (
                <li key={habit.id}>
                  <span className="rank-number">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{habit.name}</strong>
                    <span>{habit.completionCount} completions</span>
                  </div>
                  <output>{habit.completionRate}%</output>
                </li>
              ))}
            </ol>
          ) : (
            <p className="panel-empty">Complete a habit to establish a ranking.</p>
          )}
        </article>

        <article className="panel chart-panel">
          <div className="panel-heading compact-heading">
            <h3>Last 14 days</h3>
            <span className="panel-index">Avg {monthlyCompletionRate}%</span>
          </div>

          <div className="bar-chart" aria-label="Habit completions over the last fourteen days">
            {recentCompletions.map((completed, index) => {
              const height = totalHabits ? (completed / totalHabits) * 100 : 0;
              const isToday = index === recentCompletions.length - 1;

              return (
                <div className="bar-column" key={`${firstChartDay}-${index}`}>
                  <div
                    className={`chart-bar ${isToday ? 'is-today' : ''}`}
                    style={{ height: `${Math.max(height, 4)}%` }}
                    title={`${completed} habits completed`}
                  />
                  <span>{String(firstChartDay + index).padStart(2, '0')}</span>
                </div>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}

export default StatisticsDashboard;
