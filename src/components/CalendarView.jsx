import { useState } from 'react';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
    if (!date || habits.length === 0) return 'none';

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

  const goToToday = () => setCurrentDate(new Date());
  const days = getDaysInMonth(currentDate);

  return (
    <section className="content-card calendar-panel" aria-label="Completion calendar">
      <div className="calendar-panel__toolbar">
        <div className="panel-meta">
          <p className="eyebrow">MONTH VIEW</p>
          <p className="panel-meta__note">Each marker records the habits completed that day.</p>
        </div>
        <div className="calendar-controls" aria-label="Calendar controls">
          <button
            type="button"
            onClick={() => navigateMonth(-1)}
            className="icon-button"
            aria-label="Previous month"
          >
            ←
          </button>
          <button type="button" onClick={goToToday} className="button button-primary button-small">Today</button>
          <button
            type="button"
            onClick={() => navigateMonth(1)}
            className="icon-button"
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      <div className="calendar-month">
        <p className="eyebrow">SELECTED MONTH</p>
        <p>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
      </div>

      <div className="calendar-grid" role="grid" aria-label={`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()} completion calendar`}>
        {weekDays.map((day) => (
          <div key={day} className="calendar-weekday" role="columnheader">{day}</div>
        ))}

        {days.map((date, index) => {
          const status = getCompletionStatus(date);
          const isToday = date && date.toDateString() === new Date().toDateString();

          return (
            <div
              key={date ? date.toISOString() : `empty-${index}`}
              className={`calendar-day ${date ? `is-${status}` : 'is-empty'} ${isToday ? 'is-today' : ''}`}
              role={date ? 'gridcell' : undefined}
              aria-label={date ? `${date.toDateString()}: ${status} completion` : undefined}
            >
              {date && (
                <>
                  <span>{date.getDate()}</span>
                  <i className="calendar-status-marker" aria-hidden="true" />
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="calendar-legend" aria-label="Completion legend">
        <span><i className="calendar-status-marker is-full" aria-hidden="true" />All complete</span>
        <span><i className="calendar-status-marker is-partial" aria-hidden="true" />Some complete</span>
        <span><i className="calendar-status-marker is-none" aria-hidden="true" />No completion</span>
      </div>
    </section>
  );
}

export default CalendarView;
