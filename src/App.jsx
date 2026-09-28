import { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import AddHabitForm from './components/AddHabitForm';
import HabitList from './components/HabitList';
import ProgressBar from './components/ProgressBar';
import CalendarView from './components/CalendarView';
import StatisticsDashboard from './components/StatisticsDashboard';
import DataExport from './components/DataExport';
import SprintDashboard from './components/SprintDashboard';
import CirclesView from './components/CirclesView';
import { initialCircles } from './data/circles';

const tabs = [
  {
    id: 'sprint',
    label: 'Sprint',
    eyebrow: 'ACCOUNTABILITY SPRINT',
    title: 'Sprint',
    description: 'Set a four-week commitment, check in every day, and review progress with your coach.',
  },
  {
    id: 'habits',
    label: 'Today',
    eyebrow: 'DAILY CHECK-IN',
    title: 'Today',
    description: 'Add habits, record progress, and finish the work in front of you.',
  },
  {
    id: 'circles',
    label: 'Community',
    eyebrow: 'PRIVATE ACCOUNTABILITY',
    title: 'Community',
    description: 'Share a focused challenge with people you trust and ask for support when you need it.',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    eyebrow: 'COMPLETION HISTORY',
    title: 'Calendar',
    description: 'Review your daily record without losing sight of today’s plan.',
  },
  {
    id: 'statistics',
    label: 'Insights',
    eyebrow: 'PATTERNS AND PROGRESS',
    title: 'Insights',
    description: 'See the consistency behind your current habits.',
  },
  {
    id: 'data',
    label: 'Data',
    eyebrow: 'LOCAL RECORDS',
    title: 'Data',
    description: 'Back up, restore, or reset the habits stored on this device.',
  },
];

function getDateKey(date) {
  return date.toISOString().split('T')[0];
}

function getSprintStatus(sprint, checkIns, today) {
  if (!sprint) return null;

  const start = new Date(`${sprint.startDate}T12:00:00`);
  const end = new Date(start);
  const durationWeeks = sprint.durationWeeks || 4;
  end.setDate(end.getDate() + durationWeeks * 7 - 1);
  const elapsedDays = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));

  return {
    currentWeek: Math.max(1, Math.min(durationWeeks, Math.floor(elapsedDays / 7) + 1)),
    durationWeeks,
    isComplete: new Date() > end,
    todayCheckIn: checkIns[today],
  };
}

function formatCurrentDate() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());
}

function App() {
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [completions, setCompletions] = useLocalStorage('completions', {});
  const [sprint, setSprint] = useLocalStorage('accountability-sprint', null);
  const [sprintCheckIns, setSprintCheckIns] = useLocalStorage('sprint-check-ins', {});
  const [sprintReviews, setSprintReviews] = useLocalStorage('sprint-reviews', []);
  const [sprintRole, setSprintRole] = useLocalStorage('sprint-role', 'participant');
  const [circles, setCircles] = useLocalStorage('accountability-circles-v1', initialCircles);
  const [activeTab, setActiveTab] = useState('sprint');
  const today = getDateKey(new Date());

  const addHabit = (newHabit) => {
    const habit = {
      id: Date.now().toString(),
      ...newHabit,
      createdAt: new Date().toISOString(),
      icon: getRandomIcon(),
    };
    setHabits([...habits, habit]);
  };

  const editHabit = (id, updatedHabit) => {
    setHabits(habits.map((habit) => (habit.id === id ? { ...habit, ...updatedHabit } : habit)));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id));
    const newCompletions = { ...completions };
    delete newCompletions[id];
    setCompletions(newCompletions);
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

  const startSprint = (newSprint) => {
    setSprint(newSprint);
    setSprintCheckIns({});
    setSprintReviews([]);
    setSprintRole('participant');
  };

  const saveSprintCheckIn = (date, checkIn) => {
    setSprintCheckIns({ ...sprintCheckIns, [date]: checkIn });
  };

  const saveSprintReview = (review) => {
    setSprintReviews([review, ...sprintReviews]);
  };

  const importData = (importedData) => {
    setHabits(importedData.habits);
    setCompletions(importedData.completions);

    if (Object.prototype.hasOwnProperty.call(importedData, 'sprint')) {
      setSprint(importedData.sprint || null);
      setSprintCheckIns(importedData.sprintCheckIns || {});
      setSprintReviews(Array.isArray(importedData.sprintReviews) ? importedData.sprintReviews : []);
      setSprintRole(importedData.sprintRole === 'coach' ? 'coach' : 'participant');
    }

    if (Array.isArray(importedData.circles)) {
      setCircles(importedData.circles);
    }
  };

  const clearAllData = () => {
    setHabits([]);
    setCompletions({});
    setSprint(null);
    setSprintCheckIns({});
    setSprintReviews([]);
    setSprintRole('participant');
    setCircles([]);
  };

  const focusHabitEntry = () => {
    setActiveTab('habits');
    requestAnimationFrame(() => document.getElementById('name')?.focus());
  };

  const focusSprintWork = () => {
    setActiveTab('sprint');
    if (!sprint) {
      requestAnimationFrame(() => document.getElementById('sprint-goal')?.focus());
    }
  };

  const completedToday = habits.filter((habit) => (completions[habit.id] || []).includes(today)).length;
  const nextHabit = habits.find((habit) => !(completions[habit.id] || []).includes(today));
  const sprintStatus = getSprintStatus(sprint, sprintCheckIns, today);
  const usesSprintFocus = Boolean(sprint);
  const currentWork = sprint ? sprint.goal : 'Daily habits';
  const currentStatus = sprint
    ? sprintStatus.isComplete
      ? 'Sprint complete'
      : `Week ${sprintStatus.currentWeek} of ${sprintStatus.durationWeeks}${sprintStatus.todayCheckIn ? ' · checked in' : ' · check-in pending'}`
    : `${completedToday} of ${habits.length} complete`;
  const nextAction = sprint
    ? sprintStatus.isComplete
      ? 'Review your sprint and choose what is next'
      : sprintStatus.todayCheckIn
        ? 'Review this week’s commitments'
        : 'Submit today’s check-in'
    : habits.length === 0
      ? 'Add your first habit'
      : nextHabit
        ? `Complete ${nextHabit.name}`
        : 'All habits are complete';
  const activePage = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const workspaceLabel = sprintRole === 'coach' ? 'Coach workspace' : 'Participant space';

  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Primary navigation">
        <div className="sidebar-brand">
          <span className="sidebar-brand__mark" aria-hidden="true">H</span>
          <span>Habit Ledger</span>
        </div>

        <nav className="app-nav" aria-label="Habit tracker sections">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`app-nav__item ${activeTab === tab.id ? 'is-active' : ''}`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <span className="app-nav__index">0{index + 1}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-profile">
          <span className="profile-avatar" aria-hidden="true">HL</span>
          <span>
            <strong>{workspaceLabel}</strong>
            <small>{sprint ? 'Sprint records stored locally' : 'Stored on this device'}</small>
          </span>
        </div>
      </aside>

      <div className="app-content">
        <header className="app-topbar">
          <p className="app-topbar__date">{formatCurrentDate()}</p>
          <div className="app-topbar__account">
            <span className="app-topbar__indicator" aria-hidden="true" />
            <span>{workspaceLabel}</span>
          </div>
        </header>

        <section className="focus-strip" aria-label="Current work, status, and next action">
          <div className="focus-strip__item">
            <span>{sprint ? 'CURRENT SPRINT' : 'CURRENT WORK'}</span>
            <strong>{currentWork}</strong>
          </div>
          <div className="focus-strip__item">
            <span>STATUS</span>
            <strong>{currentStatus}</strong>
          </div>
          <div className="focus-strip__item focus-strip__next">
            <span>NEXT ACTION</span>
            <strong>{nextAction}</strong>
          </div>
          <button
            type="button"
            onClick={usesSprintFocus ? focusSprintWork : focusHabitEntry}
            className="focus-strip__action"
          >
            {usesSprintFocus ? 'Open sprint' : habits.length === 0 ? 'Add habit' : 'Open habits'}
          </button>
        </section>

        <main className="workspace">
          <header className="page-header">
            <p className="eyebrow">{activePage.eyebrow}</p>
            <h1>{activePage.title}</h1>
            <p>{activePage.description}</p>
          </header>

          <div className="tab-panel">
            {activeTab === 'sprint' && (
              <SprintDashboard
                sprint={sprint}
                checkIns={sprintCheckIns}
                reviews={sprintReviews}
                role={sprintRole}
                onRoleChange={setSprintRole}
                onStartSprint={startSprint}
                onSaveCheckIn={saveSprintCheckIn}
                onSaveReview={saveSprintReview}
              />
            )}

            {activeTab === 'habits' && (
              <>
                <AddHabitForm onAddHabit={addHabit} />
                <ProgressBar completed={completedToday} total={habits.length} />
                <HabitList
                  habits={habits}
                  completions={completions}
                  onToggleComplete={toggleComplete}
                  onEditHabit={editHabit}
                  onDeleteHabit={deleteHabit}
                />
              </>
            )}

            {activeTab === 'circles' && <CirclesView circles={circles} setCircles={setCircles} />}

            {activeTab === 'calendar' && <CalendarView completions={completions} habits={habits} />}

            {activeTab === 'statistics' && <StatisticsDashboard habits={habits} completions={completions} />}

            {activeTab === 'data' && (
              <DataExport
                habits={habits}
                completions={completions}
                sprint={sprint}
                sprintCheckIns={sprintCheckIns}
                sprintReviews={sprintReviews}
                sprintRole={sprintRole}
                circles={circles}
                onImportData={importData}
                onClearAllData={clearAllData}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function getRandomIcon() {
  const icons = ['✦', '→', '◐', '↗', '◇', '⊕', '⌁', '○', '◈', '∴'];
  return icons[Math.floor(Math.random() * icons.length)];
}

export default App;
