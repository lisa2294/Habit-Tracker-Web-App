import { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import AddHabitForm from './components/AddHabitForm';
import HabitList from './components/HabitList';
import ProgressBar from './components/ProgressBar';
import CalendarView from './components/CalendarView';
import StatisticsDashboard from './components/StatisticsDashboard';
import DataExport from './components/DataExport';
import CirclesView from './components/CirclesView';
import { initialCircles } from './data/circles';

const tabs = [
  { id: 'habits', label: 'Today', icon: '◌' },
  { id: 'circles', label: 'Community', icon: '◎' },
  { id: 'calendar', label: 'Archive', icon: '□' },
  { id: 'statistics', label: 'Insights', icon: '↗' },
  { id: 'data', label: 'Data', icon: '⋯' },
];

const tabTitles = {
  habits: 'Today',
  circles: 'Community',
  calendar: 'Archive',
  statistics: 'Insights',
  data: 'Data',
};

function App() {
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [completions, setCompletions] = useLocalStorage('completions', {});
  const [circles, setCircles] = useLocalStorage('accountability-circles-v1', initialCircles);
  const [activeTab, setActiveTab] = useState('habits');

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const formattedDate = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(now);

  const addHabit = (newHabit) => {
    const habit = {
      id: Date.now().toString(),
      ...newHabit,
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, habit]);
  };

  const editHabit = (id, updatedHabit) => {
    setHabits(habits.map((habit) => (
      habit.id === id ? { ...habit, ...updatedHabit } : habit
    )));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id));
    const nextCompletions = { ...completions };
    delete nextCompletions[id];
    setCompletions(nextCompletions);
  };

  const toggleComplete = (id) => {
    const habitCompletions = completions[id] || [];
    const isCompleted = habitCompletions.includes(today);

    setCompletions({
      ...completions,
      [id]: isCompleted
        ? habitCompletions.filter((date) => date !== today)
        : [...habitCompletions, today],
    });
  };

  const getCurrentStreak = (habitId) => {
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

  const completedToday = habits.filter((habit) => (
    completions[habit.id] || []
  ).includes(today)).length;
  const completionPercentage = habits.length
    ? Math.round((completedToday / habits.length) * 100)
    : 0;
  const longestStreak = habits.length
    ? Math.max(...habits.map((habit) => getCurrentStreak(habit.id)))
    : 0;
  const activeTitle = tabTitles[activeTab];

  const openToday = () => {
    setActiveTab('habits');
    window.requestAnimationFrame(() => {
      document.getElementById('habit-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const openCircleCreator = () => {
    setActiveTab('circles');
    window.requestAnimationFrame(() => {
      document.getElementById('create-circle-trigger')?.click();
    });
  };

  const primaryAction = activeTab === 'circles'
    ? { label: 'New circle', onClick: openCircleCreator }
    : { label: 'Add habit', onClick: openToday };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-top">
          <a className="brand" href="#top" aria-label="Habit home">
            <span className="brand-mark" aria-hidden="true">●</span>
            <span>habit</span>
          </a>

          <span className="sidebar-label">Workspace</span>

          <nav className="tab-bar" aria-label="Habit tracker sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? 'tab-button is-active' : 'tab-button'}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <button type="button" className="new-habit-button" onClick={primaryAction.onClick}>
            <span aria-hidden="true">+</span>
            {activeTab === 'circles' ? 'New circle' : 'New habit'}
          </button>

        </div>
      </aside>

      <main className={`app-main ${activeTab === 'circles' ? 'is-community' : ''}`} id="top">
        <header className="app-main-header">
          <h1>{activeTitle}</h1>
          <div className="header-actions">
            <span>{formattedDate}</span>
            <button type="button" className="primary-button" onClick={primaryAction.onClick}>
              <span aria-hidden="true">+</span>
              {primaryAction.label}
            </button>
          </div>
        </header>

        <section className="app-content" id="habit-workspace">
          {activeTab === 'habits' && (
            <>
              <div className="dashboard-summary" aria-label="Today’s habit summary">
                <article className="summary-card summary-card-highlight">
                  <span>TODAY&apos;S SCORE</span>
                  <strong>{String(completionPercentage).padStart(2, '0')}%</strong>
                </article>
                <article className="summary-card">
                  <span>COMPLETED</span>
                  <strong>{String(completedToday).padStart(2, '0')}<em> / {String(habits.length).padStart(2, '0')}</em></strong>
                </article>
                <article className="summary-card">
                  <span>BEST STREAK</span>
                  <strong>{String(longestStreak).padStart(2, '0')}<em> days</em></strong>
                </article>
              </div>

              <div className="habits-overview">
                <AddHabitForm onAddHabit={addHabit} />
                <ProgressBar completed={completedToday} total={habits.length} />
              </div>
              <HabitList
                habits={habits}
                completions={completions}
                onToggleComplete={toggleComplete}
                onEditHabit={editHabit}
                onDeleteHabit={deleteHabit}
              />
            </>
          )}

          {activeTab === 'calendar' && (
            <CalendarView completions={completions} habits={habits} />
          )}

          {activeTab === 'circles' && (
            <CirclesView circles={circles} setCircles={setCircles} />
          )}

          {activeTab === 'statistics' && (
            <StatisticsDashboard habits={habits} completions={completions} />
          )}

          {activeTab === 'data' && (
            <DataExport habits={habits} completions={completions} circles={circles} />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
