import { useMemo, useState } from 'react';

const SPRINT_WEEKS = 4;
const CHECK_IN_STATUSES = [
  { id: 'complete', label: 'Complete' },
  { id: 'partial', label: 'Partial' },
  { id: 'blocked', label: 'Blocked' },
];

function getDateKey(date) {
  return date.toISOString().split('T')[0];
}

function formatShortDate(dateString) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${dateString}T12:00:00`));
}

function getSprintSchedule(sprint) {
  const start = new Date(`${sprint.startDate}T12:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + (sprint.durationWeeks || SPRINT_WEEKS) * 7 - 1);
  const now = new Date();
  const elapsedDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const durationWeeks = sprint.durationWeeks || SPRINT_WEEKS;

  return {
    end,
    durationWeeks,
    currentWeek: Math.max(1, Math.min(durationWeeks, Math.floor(elapsedDays / 7) + 1)),
    isComplete: now > end,
  };
}

function statusLabel(status) {
  return CHECK_IN_STATUSES.find((item) => item.id === status)?.label || 'Pending';
}

function SprintSetup({ onStartSprint }) {
  const today = getDateKey(new Date());
  const [goal, setGoal] = useState('');
  const [coachName, setCoachName] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [commitments, setCommitments] = useState([
    { title: '', criteria: '' },
    { title: '', criteria: '' },
    { title: '', criteria: '' },
  ]);
  const [error, setError] = useState('');

  const updateCommitment = (index, field, value) => {
    setCommitments((current) => current.map((commitment, commitmentIndex) => (
      commitmentIndex === index ? { ...commitment, [field]: value } : commitment
    )));
  };

  const submitSetup = (event) => {
    event.preventDefault();
    const activeCommitments = commitments
      .filter((commitment) => commitment.title.trim())
      .map((commitment, index) => ({
        id: `${Date.now()}-${index}`,
        title: commitment.title.trim(),
        criteria: commitment.criteria.trim(),
      }));

    if (!goal.trim() || activeCommitments.length === 0) {
      setError('Add one sprint goal and at least one weekly commitment.');
      return;
    }

    onStartSprint({
      id: Date.now().toString(),
      goal: goal.trim(),
      coachName: coachName.trim() || 'Assigned coach',
      startDate,
      durationWeeks: SPRINT_WEEKS,
      commitments: activeCommitments,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <section className="content-card sprint-setup" aria-label="Start an accountability sprint">
      <div className="panel-meta">
        <div>
          <p className="eyebrow">START A 4-WEEK SPRINT</p>
          <p className="panel-meta__note">Choose one outcome and the commitments that will move it forward this week.</p>
        </div>
        <span className="sprint-setup__duration">4 weeks</span>
      </div>

      <form onSubmit={submitSetup} className="sprint-setup__form">
        <label className="field sprint-setup__goal">
          <span>SPRINT GOAL</span>
          <input
            id="sprint-goal"
            type="text"
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            className="field-input"
            placeholder="e.g. Build a consistent strength-training practice"
            required
          />
        </label>

        <div className="sprint-setup__details">
          <label className="field">
            <span>COACH</span>
            <input
              type="text"
              value={coachName}
              onChange={(event) => setCoachName(event.target.value)}
              className="field-input"
              placeholder="Coach name"
            />
          </label>
          <label className="field">
            <span>START DATE</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="field-input"
              required
            />
          </label>
        </div>

        <div className="sprint-setup__commitments">
          <div className="sprint-setup__commitments-meta">
            <p className="eyebrow">WEEK 1 COMMITMENTS</p>
            <p>Use one to three commitments with a clear definition of done.</p>
          </div>
          {commitments.map((commitment, index) => (
            <div className="sprint-setup__commitment" key={index}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <label className="field">
                <span className="visually-hidden">Commitment {index + 1}</span>
                <input
                  type="text"
                  value={commitment.title}
                  onChange={(event) => updateCommitment(index, 'title', event.target.value)}
                  className="field-input"
                  placeholder="Commitment"
                />
              </label>
              <label className="field">
                <span className="visually-hidden">Success criteria for commitment {index + 1}</span>
                <input
                  type="text"
                  value={commitment.criteria}
                  onChange={(event) => updateCommitment(index, 'criteria', event.target.value)}
                  className="field-input"
                  placeholder="What counts as done?"
                />
              </label>
            </div>
          ))}
        </div>

        {error && <p className="sprint-form-error" role="alert">{error}</p>}
        <button type="submit" className="button button-primary sprint-setup__submit">Start sprint</button>
      </form>
    </section>
  );
}

function ParticipantWorkspace({ sprint, checkIns, reviews, onSaveCheckIn }) {
  const today = getDateKey(new Date());
  const schedule = getSprintSchedule(sprint);
  const todayCheckIn = checkIns[today];
  const commitments = sprint.commitments || [];
  const [status, setStatus] = useState(todayCheckIn?.status || 'complete');
  const [note, setNote] = useState(todayCheckIn?.note || '');
  const [commitmentIds, setCommitmentIds] = useState(todayCheckIn?.commitmentIds || []);
  const [notice, setNotice] = useState('');

  const latestReview = reviews[0];
  const submittedCheckIns = Object.entries(checkIns).filter(([date]) => date >= sprint.startDate && date <= getDateKey(schedule.end));
  const completeCheckIns = submittedCheckIns.filter(([, checkIn]) => checkIn.status === 'complete').length;
  const checkInRate = submittedCheckIns.length > 0 ? Math.round((completeCheckIns / submittedCheckIns.length) * 100) : 0;

  const toggleCommitment = (commitmentId) => {
    setCommitmentIds((current) => (
      current.includes(commitmentId)
        ? current.filter((id) => id !== commitmentId)
        : [...current, commitmentId]
    ));
  };

  const submitCheckIn = (event) => {
    event.preventDefault();
    onSaveCheckIn(today, {
      status,
      note: note.trim(),
      commitmentIds,
      updatedAt: new Date().toISOString(),
    });
    setNotice('Today’s check-in is saved for your coach review.');
  };

  return (
    <section className="sprint-workspace" aria-label="Participant sprint workspace">
      <div className="sprint-overview">
        <article className="content-card sprint-goal-card">
          <p className="eyebrow">CURRENT SPRINT</p>
          <p className="sprint-goal-card__goal">{sprint.goal}</p>
          <div className="sprint-goal-card__meta">
            <span>Week {schedule.currentWeek} of {schedule.durationWeeks}</span>
            <span>{formatShortDate(sprint.startDate)} — {formatShortDate(getDateKey(schedule.end))}</span>
            <span>Coach: {sprint.coachName}</span>
          </div>
        </article>

        <article className="content-card sprint-summary-card">
          <p className="eyebrow">CHECK-IN RECORD</p>
          <strong>{submittedCheckIns.length}</strong>
          <span>daily check-ins submitted</span>
          <p>{checkInRate}% marked complete</p>
        </article>
      </div>

      <div className="sprint-main-grid">
        <section className="content-card check-in-card" aria-label="Daily check-in">
          <div className="panel-meta">
            <div>
              <p className="eyebrow">TODAY’S CHECK-IN</p>
              <p className="panel-meta__note">Record what happened before the day gets away from you.</p>
            </div>
            {todayCheckIn && <span className={`check-in-state is-${todayCheckIn.status}`}>{statusLabel(todayCheckIn.status)}</span>}
          </div>

          <form onSubmit={submitCheckIn} className="check-in-form">
            <div className="check-in-form__statuses" aria-label="Check-in status">
              {CHECK_IN_STATUSES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatus(item.id)}
                  className={`status-choice ${status === item.id ? 'is-selected' : ''}`}
                  aria-pressed={status === item.id}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="check-in-form__commitments">
              {commitments.map((commitment) => (
                <label className="commitment-toggle" key={commitment.id}>
                  <input
                    type="checkbox"
                    checked={commitmentIds.includes(commitment.id)}
                    onChange={() => toggleCommitment(commitment.id)}
                  />
                  <span>
                    <strong>{commitment.title}</strong>
                    {commitment.criteria && <small>{commitment.criteria}</small>}
                  </span>
                </label>
              ))}
            </div>

            <label className="field">
              <span>NOTE FOR YOUR COACH · OPTIONAL</span>
              <textarea
                id="sprint-check-in-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="field-input field-textarea"
                placeholder="What moved forward, or what got in the way?"
                rows="3"
              />
            </label>

            {notice && <p className="sprint-notice" role="status">{notice}</p>}
            <button type="submit" className="button button-primary">Save today’s check-in</button>
          </form>
        </section>

        <section className="content-card coach-feedback-card" aria-label="Latest coach feedback">
          <p className="eyebrow">LATEST COACH FEEDBACK</p>
          {latestReview ? (
            <>
              <p className="coach-feedback-card__message">{latestReview.feedback}</p>
              {latestReview.nextStep && (
                <div className="coach-feedback-card__next">
                  <span>NEXT WEEK</span>
                  <p>{latestReview.nextStep}</p>
                </div>
              )}
              <p className="coach-feedback-card__date">Week {latestReview.week} · {formatShortDate(latestReview.createdAt.slice(0, 10))}</p>
            </>
          ) : (
            <p className="empty-copy">Your coach’s first weekly review will appear here.</p>
          )}
        </section>
      </div>

      <section className="content-card sprint-commitments-panel" aria-label="Weekly commitments">
        <div className="panel-meta">
          <div>
            <p className="eyebrow">THIS WEEK’S COMMITMENTS</p>
            <p className="panel-meta__note">Keep these visible when you choose what to do next.</p>
          </div>
          <span id="sprint-commitments" className="sprint-commitments-panel__week">Week {schedule.currentWeek}</span>
        </div>
        <div className="sprint-commitment-list">
          {commitments.map((commitment, index) => (
            <article className="sprint-commitment" key={commitment.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <p>{commitment.title}</p>
                {commitment.criteria && <small>{commitment.criteria}</small>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function CoachWorkspace({ sprint, checkIns, reviews, onSaveReview }) {
  const schedule = getSprintSchedule(sprint);
  const today = getDateKey(new Date());
  const todayCheckIn = checkIns[today];
  const [feedback, setFeedback] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [notice, setNotice] = useState('');
  const recentCheckIns = useMemo(() => (
    Object.entries(checkIns)
      .sort(([firstDate], [secondDate]) => secondDate.localeCompare(firstDate))
      .slice(0, 7)
  ), [checkIns]);

  const submitReview = (event) => {
    event.preventDefault();
    if (!feedback.trim()) return;

    onSaveReview({
      id: Date.now().toString(),
      week: schedule.currentWeek,
      feedback: feedback.trim(),
      nextStep: nextStep.trim(),
      createdAt: new Date().toISOString(),
    });
    setFeedback('');
    setNextStep('');
    setNotice('Weekly review is now visible in the participant workspace.');
  };

  return (
    <section className="sprint-workspace coach-workspace" aria-label="Coach sprint workspace">
      <div className="coach-status-grid">
        <article className="content-card coach-status-card">
          <p className="eyebrow">PARTICIPANT</p>
          <p>You</p>
          <span>One active accountability sprint</span>
        </article>
        <article className="content-card coach-status-card">
          <p className="eyebrow">TODAY</p>
          <p>{todayCheckIn ? statusLabel(todayCheckIn.status) : 'No check-in'}</p>
          <span>{todayCheckIn ? 'Recorded today' : 'Needs follow-up'}</span>
        </article>
        <article className="content-card coach-status-card coach-status-card--accent">
          <p className="eyebrow">REVIEW</p>
          <p>Week {schedule.currentWeek}</p>
          <span>{reviews.some((review) => review.week === schedule.currentWeek) ? 'Submitted' : 'Needs review'}</span>
        </article>
      </div>

      <div className="sprint-main-grid">
        <section className="content-card coach-review-card" aria-label="Write weekly review">
          <div className="panel-meta">
            <div>
              <p className="eyebrow">WEEKLY COACH REVIEW</p>
              <p className="panel-meta__note">Give concise feedback and make the next step explicit.</p>
            </div>
            <span className="coach-review-card__week">Week {schedule.currentWeek}</span>
          </div>

          <form onSubmit={submitReview} className="coach-review-form">
            <label className="field">
              <span>FEEDBACK</span>
              <textarea
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                className="field-input field-textarea"
                placeholder="What worked, what got in the way, and what should change?"
                rows="4"
                required
              />
            </label>
            <label className="field">
              <span>NEXT WEEK’S FOCUS</span>
              <input
                type="text"
                value={nextStep}
                onChange={(event) => setNextStep(event.target.value)}
                className="field-input"
                placeholder="One concrete next step"
              />
            </label>
            {notice && <p className="sprint-notice" role="status">{notice}</p>}
            <button type="submit" className="button button-primary">Publish review</button>
          </form>
        </section>

        <section className="content-card check-in-history-card" aria-label="Recent check-in history">
          <p className="eyebrow">RECENT CHECK-INS</p>
          {recentCheckIns.length > 0 ? (
            <div className="check-in-history-list">
              {recentCheckIns.map(([date, checkIn]) => (
                <article key={date}>
                  <span>{formatShortDate(date)}</span>
                  <strong>{statusLabel(checkIn.status)}</strong>
                  <p>{checkIn.note || 'No note added.'}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-copy">Daily check-ins will appear here for review.</p>
          )}
        </section>
      </div>

      <section className="content-card coach-sprint-summary" aria-label="Sprint context">
        <p className="eyebrow">SPRINT CONTEXT</p>
        <p>{sprint.goal}</p>
        <span>{formatShortDate(sprint.startDate)} — {formatShortDate(getDateKey(schedule.end))} · {sprint.commitments?.length || 0} active commitments</span>
      </section>
    </section>
  );
}

function SprintDashboard({ sprint, checkIns, reviews, role, onRoleChange, onStartSprint, onSaveCheckIn, onSaveReview }) {
  if (!sprint) return <SprintSetup onStartSprint={onStartSprint} />;

  return (
    <section className="sprint-dashboard" aria-label="Accountability Sprint">
      <div className="sprint-dashboard__toolbar">
        <div>
          <p className="eyebrow">ACCOUNTABILITY SPRINT</p>
          <p className="sprint-dashboard__toolbar-copy">Switch views to check the participant experience or write a coach review.</p>
        </div>
        <div className="role-toggle" aria-label="Sprint workspace view">
          <button
            type="button"
            onClick={() => onRoleChange('participant')}
            className={role === 'participant' ? 'is-active' : ''}
            aria-pressed={role === 'participant'}
          >
            Participant
          </button>
          <button
            type="button"
            onClick={() => onRoleChange('coach')}
            className={role === 'coach' ? 'is-active' : ''}
            aria-pressed={role === 'coach'}
          >
            Coach
          </button>
        </div>
      </div>

      {role === 'coach' ? (
        <CoachWorkspace sprint={sprint} checkIns={checkIns} reviews={reviews} onSaveReview={onSaveReview} />
      ) : (
        <ParticipantWorkspace sprint={sprint} checkIns={checkIns} reviews={reviews} onSaveCheckIn={onSaveCheckIn} />
      )}
    </section>
  );
}

export default SprintDashboard;
