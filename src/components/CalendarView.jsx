import { useState } from 'react';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function CalendarView({ completions, habits }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = Array.from({ length: firstDay.getDay() }, () => null);

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getCompletionStatus = (date) => {
    if (!date) return null;

    const dateString = date.toISOString().split('T')[0];
    const completedHabits = habits.filter((habit) => (
      completions[habit.id] || []
    ).includes(dateString)).length;

    if (completedHabits === 0) return 'none';
    if (completedHabits === habits.length) return 'full';
    return 'partial';
  };

  const navigateMonth = (direction) => {
    setCurrentDate((previousDate) => {
      const nextDate = new Date(previousDate);
      nextDate.setMonth(nextDate.getMonth() + direction);
      return nextDate;
    });
  };

  const days = getDaysInMonth(currentDate);

  return (
    <section className="panel calendar-panel" aria-labelledby="calendar-title">
      <div className="calendar-header">
        <h2 id="calendar-title">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>

        <div className="calendar-controls">
          <button type="button" onClick={() => navigateMonth(-1)} className="square-button" aria-label="Previous month">←</button>
          <button type="button" onClick={() => setCurrentDate(new Date())} className="ghost-button compact">Today</button>
          <button type="button" onClick={() => navigateMonth(1)} className="square-button" aria-label="Next month">→</button>
        </div>
      </div>

      <div className="calendar-grid">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
          <div key={day} className="weekday">{day}</div>
        ))}

        {days.map((date, index) => {
          const status = getCompletionStatus(date);
          const isToday = date && date.toDateString() === new Date().toDateString();

          return (
            <div
              key={date ? date.toISOString() : `empty-${index}`}
              className={`calendar-day ${date ? '' : 'is-empty'} ${isToday ? 'is-today' : ''}`}
              aria-label={date ? `${date.toDateString()}, ${status} completion` : undefined}
            >
              {date && (
                <>
                  <span className="day-number">{String(date.getDate()).padStart(2, '0')}</span>
                  <span className={`calendar-status status-${status}`} aria-hidden="true" />
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="calendar-legend">
        <div><span className="calendar-status status-full" />All complete</div>
        <div><span className="calendar-status status-partial" />In progress</div>
        <div><span className="calendar-status status-none" />No activity</div>
      </div>
    </section>
  );
}

export default CalendarView;
