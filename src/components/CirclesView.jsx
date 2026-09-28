import { useEffect, useRef, useState } from 'react';
import { currentUserId, pilotCoaches } from '../data/circles';
import '../circles.css';

const sectionTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'people', label: 'People' },
  { id: 'coach', label: 'Coach' },
];

const statusMeta = {
  complete: { label: 'Complete', symbol: '✓' },
  partial: { label: 'In progress', symbol: '◐' },
  blocked: { label: 'Blocked', symbol: '!' },
  skipped: { label: 'Skipped', symbol: '–' },
  due: { label: 'Check-in due', symbol: '○' },
};

const nudgeTemplates = [
  'You’ve got this—one focused block is enough to restart.',
  'Want to name the smallest next step for today?',
  'Checking in from the circle. Need help clearing a blocker?',
];

function createId(prefix) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() || Date.now().toString(36)}`;
}

function formatRelativeTime(isoDate) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(isoDate).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function Avatar({ member, size = 'medium' }) {
  return (
    <span
      className={`circle-avatar is-${size}`}
      style={{ '--avatar-accent': member.accent || '#d8d4cf' }}
      aria-hidden="true"
    >
      {member.initials}
    </span>
  );
}

function StatusPill({ status }) {
  const meta = statusMeta[status] || statusMeta.due;
  return (
    <span className={`circle-status is-${status}`}>
      <span aria-hidden="true">{meta.symbol}</span>
      {meta.label}
    </span>
  );
}

function Dialog({ title, label, onClose, children, wide = false }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`dialog-card ${wide ? 'is-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <header className="dialog-header">
          <div>
            {label && <span>{label}</span>}
            <h2 id="dialog-title">{title}</h2>
          </div>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close dialog">×</button>
        </header>
        {children}
      </section>
    </div>
  );
}

function CreateCircleDialog({ onClose, onSubmit }) {
  return (
    <Dialog title="Create a circle" label="PRIVATE GROUP" onClose={onClose} wide>
      <form className="circle-form" onSubmit={onSubmit}>
        <div className="circle-form-grid">
          <div className="field-group">
            <label htmlFor="circle-name">CIRCLE NAME</label>
            <input id="circle-name" name="name" placeholder="Monday Momentum" required autoFocus />
          </div>
          <div className="field-group">
            <label htmlFor="circle-duration">SPRINT LENGTH</label>
            <select id="circle-duration" name="durationWeeks" defaultValue="4">
              <option value="2">2 weeks</option>
              <option value="4">4 weeks</option>
              <option value="6">6 weeks</option>
              <option value="8">8 weeks</option>
            </select>
          </div>
        </div>
        <div className="field-group">
          <label htmlFor="circle-purpose">PURPOSE</label>
          <textarea
            id="circle-purpose"
            name="purpose"
            rows="3"
            placeholder="What will this group help each other follow through on?"
            required
          />
        </div>
        <div className="circle-form-grid">
          <div className="field-group">
            <label htmlFor="challenge-title">FIRST CHALLENGE</label>
            <input id="challenge-title" name="challengeTitle" placeholder="Deep Work Sprint" required />
          </div>
          <div className="field-group">
            <label htmlFor="challenge-target">WEEKLY TARGET</label>
            <select id="challenge-target" name="target" defaultValue="4">
              {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                <option key={value} value={value}>{value} check-ins / week</option>
              ))}
            </select>
          </div>
        </div>
        <div className="dialog-note">
          <span aria-hidden="true">⌁</span>
          Only invited members can see this circle. Personal habits stay private until explicitly linked.
        </div>
        <div className="dialog-actions">
          <button type="button" className="ghost-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-button">Create circle <span aria-hidden="true">→</span></button>
        </div>
      </form>
    </Dialog>
  );
}

function CheckInDialog({ circle, onClose, onSubmit }) {
  const currentMember = circle.members.find((member) => member.id === currentUserId);
  const [status, setStatus] = useState(currentMember?.status === 'due' ? 'complete' : currentMember?.status || 'complete');

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit({
      status,
      note: formData.get('note').trim(),
      supportRequested: formData.get('supportRequested') === 'on',
    });
  };

  return (
    <Dialog title="Share your check-in" label={circle.challenge.title} onClose={onClose}>
      <form className="circle-form" onSubmit={handleSubmit}>
        <fieldset className="status-picker">
          <legend>HOW DID IT GO?</legend>
          <div>
            {['complete', 'partial', 'blocked', 'skipped'].map((option) => (
              <button
                key={option}
                type="button"
                className={status === option ? 'is-selected' : ''}
                onClick={() => setStatus(option)}
                aria-pressed={status === option}
              >
                <span aria-hidden="true">{statusMeta[option].symbol}</span>
                {statusMeta[option].label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="field-group">
          <label htmlFor="checkin-note">NOTE / OPTIONAL</label>
          <textarea
            id="checkin-note"
            name="note"
            rows="4"
            maxLength="280"
            placeholder="What worked, or what got in the way?"
          />
        </div>
        <label className="support-toggle">
          <input type="checkbox" name="supportRequested" />
          <span className="support-box" aria-hidden="true">✓</span>
          <span>
            <strong>I want support</strong>
            <small>Let the circle know you would appreciate a response.</small>
          </span>
        </label>
        <p className="audience-note">Visible to {circle.members.length} circle members.</p>
        <div className="dialog-actions">
          <button type="button" className="ghost-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-button">Share check-in <span aria-hidden="true">→</span></button>
        </div>
      </form>
    </Dialog>
  );
}

function InviteDialog({ circle, onClose, onSubmit }) {
  return (
    <Dialog title="Invite a member" label={circle.name} onClose={onClose}>
      <form className="circle-form" onSubmit={onSubmit}>
        <div className="field-group">
          <label htmlFor="invite-email">WORK EMAIL</label>
          <input id="invite-email" name="email" type="email" placeholder="colleague@company.com" required autoFocus />
        </div>
        <div className="dialog-note">
          <span aria-hidden="true">↗</span>
          This frontend MVP saves the invitation locally. Email delivery will be connected with the backend.
        </div>
        <div className="dialog-actions">
          <button type="button" className="ghost-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-button">Create invitation</button>
        </div>
      </form>
    </Dialog>
  );
}

function NudgeDialog({ member, onClose, onSubmit }) {
  const [selectedTemplate, setSelectedTemplate] = useState(nudgeTemplates[0]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit({
      message: selectedTemplate,
      note: formData.get('note').trim(),
    });
  };

  return (
    <Dialog title={`Nudge ${member.name}`} label="SUPPORTIVE, NOT PUSHY" onClose={onClose}>
      <form className="circle-form" onSubmit={handleSubmit}>
        <div className="nudge-recipient">
          <Avatar member={member} />
          <div>
            <strong>{member.name}</strong>
            <span>{member.timeZone}</span>
          </div>
        </div>
        <fieldset className="nudge-templates">
          <legend>CHOOSE A MESSAGE</legend>
          {nudgeTemplates.map((template) => (
            <label key={template} className={selectedTemplate === template ? 'is-selected' : ''}>
              <input
                type="radio"
                name="template"
                value={template}
                checked={selectedTemplate === template}
                onChange={() => setSelectedTemplate(template)}
              />
              <span>{template}</span>
            </label>
          ))}
        </fieldset>
        <div className="field-group">
          <label htmlFor="nudge-note">PERSONAL NOTE / OPTIONAL</label>
          <input id="nudge-note" name="note" maxLength="100" placeholder="Add context in your own words" />
        </div>
        <div className="dialog-actions">
          <button type="button" className="ghost-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-button">Send nudge</button>
        </div>
      </form>
    </Dialog>
  );
}

function CommentDialog({ checkIn, member, onClose, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const body = new FormData(event.currentTarget).get('comment').trim();
    if (body) onSubmit(body);
  };

  const title = member.id === currentUserId
    ? 'Comment on your check-in'
    : `Comment on ${member.name}'s check-in`;

  return (
    <Dialog title={title} label="PRIVATE CIRCLE" onClose={onClose}>
      <form className="circle-form" onSubmit={handleSubmit}>
        {checkIn.note && (
          <blockquote className="comment-context">
            “{checkIn.note}”
          </blockquote>
        )}
        <div className="field-group">
          <label htmlFor="checkin-comment">YOUR COMMENT</label>
          <textarea
            id="checkin-comment"
            name="comment"
            rows="4"
            maxLength="400"
            placeholder="Offer encouragement, ask a useful question, or help unblock the next step."
            required
            autoFocus
          />
        </div>
        <p className="audience-note">Visible to every member of this circle.</p>
        <div className="dialog-actions">
          <button type="button" className="ghost-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-button">Post comment</button>
        </div>
      </form>
    </Dialog>
  );
}

function ChallengeDialog({ circle, onClose, onSubmit }) {
  return (
    <Dialog title="Edit challenge" label={circle.name} onClose={onClose} wide>
      <form className="circle-form" onSubmit={onSubmit}>
        <div className="circle-form-grid">
          <div className="field-group">
            <label htmlFor="edit-challenge-title">CHALLENGE NAME</label>
            <input id="edit-challenge-title" name="title" defaultValue={circle.challenge.title} required autoFocus />
          </div>
          <div className="field-group">
            <label htmlFor="edit-challenge-target">WEEKLY TARGET</label>
            <select id="edit-challenge-target" name="target" defaultValue={circle.challenge.target}>
              {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                <option key={value} value={value}>{value} check-ins / week</option>
              ))}
            </select>
          </div>
        </div>
        <div className="field-group">
          <label htmlFor="edit-challenge-description">SUCCESS DEFINITION</label>
          <textarea
            id="edit-challenge-description"
            name="description"
            rows="3"
            defaultValue={circle.challenge.description}
            required
          />
        </div>
        <div className="dialog-actions">
          <button type="button" className="ghost-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-button">Save challenge</button>
        </div>
      </form>
    </Dialog>
  );
}

function CoachRequestDialog({ coach, circle, onClose, onSubmit }) {
  return (
    <Dialog title="Request this coach" label="CURATED PILOT" onClose={onClose}>
      <div className="coach-request-summary">
        <div className="coach-card-person">
          <span className="coach-avatar" aria-hidden="true">{coach.initials}</span>
          <div>
            <strong>{coach.name}</strong>
            <span>{coach.title}</span>
          </div>
        </div>
        <dl>
          <div><dt>Circle</dt><dd>{circle.name}</dd></div>
          <div><dt>Package</dt><dd>${coach.price}/month</dd></div>
          <div><dt>Includes</dt><dd>Weekly review · Async support · Monthly call</dd></div>
        </dl>
        <p>No payment is collected in this frontend MVP. Your request will be saved as pending.</p>
      </div>
      <div className="dialog-actions">
        <button type="button" className="ghost-button" onClick={onClose}>Cancel</button>
        <button type="button" className="primary-button" onClick={() => onSubmit(coach)}>Request {coach.name.split(' ')[0]}</button>
      </div>
    </Dialog>
  );
}

function CircleOverview({ circle, onCheckIn, onInvite, onNudge, onSectionChange, onReact, onComment }) {
  const [showAllCheckIns, setShowAllCheckIns] = useState(false);
  const completedTotal = circle.members.reduce((sum, member) => sum + member.completed, 0);
  const targetTotal = circle.members.reduce((sum, member) => sum + member.target, 0);
  const progress = targetTotal ? Math.round((completedTotal / targetTotal) * 100) : 0;
  const checkedIn = circle.members.filter((member) => member.status !== 'due').length;
  const currentMember = circle.members.find((member) => member.id === currentUserId);
  const visibleCheckIns = showAllCheckIns ? circle.checkIns : circle.checkIns.slice(0, 2);

  return (
    <>
      <div className="circle-overview-grid">
        <article className="circle-challenge-hero">
          <div className="circle-hero-copy">
            <div className="circle-hero-meta">
              <span>ACTIVE CHALLENGE</span>
              <span>Week {circle.challenge.currentWeek} of {circle.challenge.durationWeeks}</span>
            </div>
            <h2>{circle.challenge.title}</h2>
            <p>{circle.challenge.description}</p>
            <div className="circle-hero-actions">
              <button type="button" className="primary-button" onClick={onCheckIn}>
                {currentMember?.status === 'due' ? 'Check in' : 'Update check-in'}
                <span aria-hidden="true">→</span>
              </button>
              <button type="button" className="dark-ghost-button" onClick={() => onSectionChange('challenge')}>View challenge</button>
            </div>
          </div>
          <div className="circle-progress-orbit" style={{ '--circle-progress': `${progress * 3.6}deg` }}>
            <div>
              <strong>{progress}%</strong>
              <span>group progress</span>
            </div>
          </div>
          <footer>
            <span>{circle.challenge.cadence}</span>
            <span>{circle.challenge.endsLabel}</span>
          </footer>
        </article>

        <aside className="panel member-pulse-panel">
          <header className="circle-panel-header">
            <div>
              <h3>Member pulse</h3>
              <span>{checkedIn} of {circle.members.length} checked in</span>
            </div>
            <button type="button" className="small-text-button" onClick={() => onSectionChange('people')}>View all</button>
          </header>
          <div className="member-pulse-list">
            {circle.members.map((member) => (
              <div className="member-pulse-row" key={member.id}>
                <Avatar member={member} size="small" />
                <div>
                  <strong>{member.name}</strong>
                  <StatusPill status={member.status} />
                </div>
                {member.id !== currentUserId && ['blocked', 'due'].includes(member.status) ? (
                  <button type="button" onClick={() => onNudge(member)}>Nudge</button>
                ) : (
                  <span className="member-count">{member.completed}/{member.target}</span>
                )}
              </div>
            ))}
          </div>
          <button type="button" className="circle-invite-row" onClick={onInvite}>
            <span aria-hidden="true">+</span>
            Invite someone you trust
          </button>
        </aside>
      </div>

      <div className="circle-lower-grid">
        <section className="panel circle-feed-panel">
          <header className="circle-panel-header">
            <div>
              <h3>Recent check-ins</h3>
              <span>Shared with this circle</span>
            </div>
            {circle.checkIns.length > 2 && (
              <button
                type="button"
                className="small-text-button"
                onClick={() => setShowAllCheckIns((current) => !current)}
              >
                {showAllCheckIns ? 'Show recent' : 'View all activity'}
              </button>
            )}
          </header>
          <div className="circle-feed">
            {circle.checkIns.length > 0 ? visibleCheckIns.map((checkIn) => {
              const member = circle.members.find((item) => item.id === checkIn.memberId);
              if (!member) return null;
              return (
                <article key={checkIn.id} className="circle-feed-item">
                  <Avatar member={member} />
                  <div className="circle-feed-copy">
                    <div className="circle-feed-byline">
                      <strong>{member.name}</strong>
                      <time dateTime={checkIn.createdAt}>{formatRelativeTime(checkIn.createdAt)}</time>
                    </div>
                    {checkIn.note && <p>{checkIn.note}</p>}
                    <div className="circle-feed-actions">
                      <button type="button" onClick={() => onReact(checkIn.id)}>Encourage <span>{checkIn.reactions}</span></button>
                      <button type="button" onClick={() => onComment(checkIn)}>Comment <span>{checkIn.comments}</span></button>
                    </div>
                    {checkIn.commentItems?.length > 0 && (
                      <p className="circle-latest-comment">
                        <strong>You</strong> {checkIn.commentItems.at(-1).body}
                      </p>
                    )}
                  </div>
                </article>
              );
            }) : (
              <div className="circle-empty-inline">No check-ins yet. Be the first to set the tone.</div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

function ChallengeView({ circle, onCheckIn, onEdit }) {
  const totalCompleted = circle.members.reduce((sum, member) => sum + member.completed, 0);
  const totalTarget = circle.members.reduce((sum, member) => sum + member.target, 0);
  const progress = totalTarget ? Math.round((totalCompleted / totalTarget) * 100) : 0;

  return (
    <section className="challenge-view">
      <div className="challenge-detail-card">
        <header>
          <div>
            <span>WEEK {circle.challenge.currentWeek} OF {circle.challenge.durationWeeks}</span>
            <h2>{circle.challenge.title}</h2>
            <p>{circle.challenge.description}</p>
          </div>
          <button type="button" className="ghost-button compact" onClick={onEdit}>Edit challenge</button>
        </header>
        <div className="challenge-stat-row">
          <div><span>Group progress</span><strong>{progress}%</strong></div>
          <div><span>Weekly target</span><strong>{circle.challenge.target}×</strong></div>
          <div><span>Members</span><strong>{String(circle.members.length).padStart(2, '0')}</strong></div>
          <div><span>Timeline</span><strong>{circle.challenge.durationWeeks}W</strong></div>
        </div>
        <div className="challenge-main-progress">
          <div style={{ width: `${progress}%` }} />
        </div>
        <div className="challenge-detail-footer">
          <span>{totalCompleted} of {totalTarget} group sessions completed</span>
          <button type="button" className="primary-button" onClick={onCheckIn}>Check in <span aria-hidden="true">→</span></button>
        </div>
      </div>

      <div className="panel participant-progress-panel">
        <header className="circle-panel-header">
          <div>
            <h3>This week</h3>
            <span>Progress is visible only to circle members</span>
          </div>
        </header>
        <div className="participant-progress-list">
          {circle.members.map((member) => {
            const memberProgress = Math.round((member.completed / member.target) * 100);
            return (
              <div className="participant-progress-row" key={member.id}>
                <Avatar member={member} />
                <div className="participant-progress-copy">
                  <div><strong>{member.name}</strong><StatusPill status={member.status} /></div>
                  <div className="member-progress-track"><span style={{ width: `${Math.min(memberProgress, 100)}%` }} /></div>
                </div>
                <output>{member.completed}/{member.target}</output>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PeopleView({ circle, onInvite, onNudge }) {
  return (
    <section className="people-view">
      <header className="people-view-header">
        <div>
          <h2>{circle.members.length} members</h2>
          <span>Private, invite-only circle</span>
        </div>
        <button type="button" className="primary-button" onClick={onInvite}><span aria-hidden="true">+</span> Invite member</button>
      </header>

      <div className="people-list">
        {circle.members.map((member) => (
          <article className="person-card" key={member.id}>
            <Avatar member={member} size="large" />
            <div className="person-main">
              <div><h3>{member.name}</h3><span>{member.role}</span></div>
              <p>{member.timeZone}</p>
            </div>
            <div className="person-progress">
              <span>THIS WEEK</span>
              <strong>{member.completed}/{member.target}</strong>
            </div>
            <StatusPill status={member.status} />
            {member.id !== currentUserId && (
              <button type="button" className="ghost-button compact" onClick={() => onNudge(member)}>Nudge</button>
            )}
          </article>
        ))}
      </div>

      {circle.pendingInvites.length > 0 && (
        <div className="pending-invites">
          <span>PENDING INVITATIONS</span>
          {circle.pendingInvites.map((email) => (
            <div key={email}>
              <span className="pending-icon" aria-hidden="true">↗</span>
              <strong>{email}</strong>
              <small>Invite created</small>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function CoachView({ circle, onRequest, onCancel }) {
  const requestedCoach = pilotCoaches.find((coach) => coach.id === circle.coachRequest?.coachId);

  return (
    <section className="coach-view">
      {requestedCoach && (
        <div className="coach-request-banner">
          <div className="coach-card-person">
            <span className="coach-avatar" aria-hidden="true">{requestedCoach.initials}</span>
            <div>
              <span>REQUEST PENDING</span>
              <strong>{requestedCoach.name}</strong>
              <small>{requestedCoach.title}</small>
            </div>
          </div>
          <p>Your pilot request is saved. Matching and payment will be connected when the backend is added.</p>
          <button type="button" className="ghost-button compact" onClick={onCancel}>Cancel request</button>
        </div>
      )}

      <header className="coach-view-header">
        <div>
          <h2>Curated coaches</h2>
          <span>Prototype profiles for the concierge coaching pilot</span>
        </div>
      </header>

      <div className="coach-grid">
        {pilotCoaches.map((coach) => {
          const isRequested = circle.coachRequest?.coachId === coach.id;
          return (
            <article className={`coach-card ${isRequested ? 'is-requested' : ''}`} key={coach.id}>
              <div className="coach-card-person">
                <span className="coach-avatar" aria-hidden="true">{coach.initials}</span>
                <div>
                  <strong>{coach.name}</strong>
                  <span>{coach.title}</span>
                </div>
              </div>
              <span className="coach-pilot-label">{coach.rating}</span>
              <div className="coach-specialties">
                {coach.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}
              </div>
              <dl>
                <div><dt>Response</dt><dd>{coach.response}</dd></div>
                <div><dt>Package</dt><dd>${coach.price}<span>/mo</span></dd></div>
              </dl>
              <button
                type="button"
                className={isRequested ? 'ghost-button' : 'primary-button'}
                onClick={() => !isRequested && onRequest(coach)}
                disabled={Boolean(circle.coachRequest) && !isRequested}
              >
                {isRequested ? 'Request pending' : 'Request coach'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function EmptyCircles({ onCreate }) {
  return (
    <section className="empty-circles">
      <span className="empty-circles-mark" aria-hidden="true">◎</span>
      <h2>Build consistency together</h2>
      <p>Create a private circle, invite people you trust, and start one shared challenge.</p>
      <button id="create-circle-trigger" type="button" className="primary-button" onClick={onCreate}>
        <span aria-hidden="true">+</span> Create your first circle
      </button>
    </section>
  );
}

function CirclesView({ circles, setCircles }) {
  const [activeCircleId, setActiveCircleId] = useState(circles[0]?.id || null);
  const [activeSection, setActiveSection] = useState('overview');
  const [dialog, setDialog] = useState(null);
  const [nudgeTarget, setNudgeTarget] = useState(null);
  const [commentTarget, setCommentTarget] = useState(null);
  const [coachTarget, setCoachTarget] = useState(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const activeCircle = circles.find((circle) => circle.id === activeCircleId) || circles[0];

  const showToast = (message) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(''), 3200);
  };

  const updateCircle = (circleId, updater) => {
    setCircles((currentCircles) => currentCircles.map((circle) => (
      circle.id === circleId ? updater(circle) : circle
    )));
  };

  const handleCreateCircle = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const target = Number(formData.get('target'));
    const durationWeeks = Number(formData.get('durationWeeks'));
    const newCircle = {
      id: createId('circle'),
      name: formData.get('name').trim(),
      purpose: formData.get('purpose').trim(),
      privacy: 'Private',
      planLabel: 'Circle trial',
      createdAt: new Date().toISOString(),
      challenge: {
        id: createId('challenge'),
        title: formData.get('challengeTitle').trim(),
        description: `Complete ${target} meaningful check-ins each week.`,
        cadence: `${target} check-ins / week`,
        target,
        currentWeek: 1,
        durationWeeks,
        endsLabel: `${durationWeeks}-week sprint`,
      },
      members: [{
        id: currentUserId,
        name: 'You',
        initials: 'YJ',
        role: 'Owner',
        timeZone: 'New York',
        status: 'due',
        completed: 0,
        target,
        streak: 0,
        accent: '#e4f222',
      }],
      checkIns: [],
      pendingInvites: [],
      coachRequest: null,
    };

    setCircles((currentCircles) => [...currentCircles, newCircle]);
    setActiveCircleId(newCircle.id);
    setActiveSection('overview');
    setDialog(null);
    showToast(`${newCircle.name} is ready for invitations.`);
  };

  const handleInvite = (event) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get('email').trim().toLowerCase();
    if (!email || !activeCircle) return;
    updateCircle(activeCircle.id, (circle) => ({
      ...circle,
      pendingInvites: circle.pendingInvites.includes(email)
        ? circle.pendingInvites
        : [...circle.pendingInvites, email],
    }));
    setDialog(null);
    showToast(`Invitation created for ${email}.`);
  };

  const handleCheckIn = ({ status, note, supportRequested }) => {
    if (!activeCircle) return;
    updateCircle(activeCircle.id, (circle) => {
      const existingMember = circle.members.find((member) => member.id === currentUserId);
      const shouldIncrement = status === 'complete' && existingMember?.status !== 'complete';
      const updatedMembers = circle.members.map((member) => (
        member.id === currentUserId
          ? {
              ...member,
              status,
              completed: shouldIncrement ? Math.min(member.completed + 1, member.target) : member.completed,
              streak: status === 'complete' ? member.streak + 1 : member.streak,
            }
          : member
      ));
      const newCheckIn = {
        id: createId('checkin'),
        memberId: currentUserId,
        status,
        note,
        supportRequested,
        createdAt: new Date().toISOString(),
        reactions: 0,
        comments: 0,
      };
      return { ...circle, members: updatedMembers, checkIns: [newCheckIn, ...circle.checkIns] };
    });
    setDialog(null);
    showToast('Your check-in is visible to the circle.');
  };

  const handleNudge = ({ message, note }) => {
    if (!activeCircle || !nudgeTarget) return;
    updateCircle(activeCircle.id, (circle) => ({
      ...circle,
      members: circle.members.map((member) => (
        member.id === nudgeTarget.id
          ? {
              ...member,
              lastNudgedAt: new Date().toISOString(),
              lastNudgeMessage: message,
              lastNudgeNote: note,
            }
          : member
      )),
    }));
    setNudgeTarget(null);
    setDialog(null);
    showToast(`Supportive nudge sent to ${nudgeTarget.name}.`);
  };

  const handleChallengeUpdate = (event) => {
    event.preventDefault();
    if (!activeCircle) return;
    const formData = new FormData(event.currentTarget);
    const target = Number(formData.get('target'));
    updateCircle(activeCircle.id, (circle) => ({
      ...circle,
      challenge: {
        ...circle.challenge,
        title: formData.get('title').trim(),
        description: formData.get('description').trim(),
        target,
        cadence: `${target} check-ins / week`,
      },
      members: circle.members.map((member) => ({ ...member, target })),
    }));
    setDialog(null);
    showToast('Challenge updated for every member.');
  };

  const handleReact = (checkInId) => {
    if (!activeCircle) return;
    updateCircle(activeCircle.id, (circle) => ({
      ...circle,
      checkIns: circle.checkIns.map((checkIn) => (
        checkIn.id === checkInId ? { ...checkIn, reactions: checkIn.reactions + 1 } : checkIn
      )),
    }));
  };

  const handleComment = (body) => {
    if (!activeCircle || !commentTarget) return;
    const comment = {
      id: createId('comment'),
      authorId: currentUserId,
      body,
      createdAt: new Date().toISOString(),
    };
    updateCircle(activeCircle.id, (circle) => ({
      ...circle,
      checkIns: circle.checkIns.map((checkIn) => (
        checkIn.id === commentTarget.id
          ? {
              ...checkIn,
              comments: (checkIn.comments || 0) + 1,
              commentItems: [...(checkIn.commentItems || []), comment],
            }
          : checkIn
      )),
    }));
    setCommentTarget(null);
    setDialog(null);
    showToast('Comment shared with the circle.');
  };

  const handleCoachRequest = (coach) => {
    if (!activeCircle) return;
    updateCircle(activeCircle.id, (circle) => ({
      ...circle,
      coachRequest: { coachId: coach.id, status: 'pending', requestedAt: new Date().toISOString() },
    }));
    setCoachTarget(null);
    setDialog(null);
    showToast(`Coach request saved for ${coach.name}.`);
  };

  const handleCoachCancel = () => {
    if (!activeCircle) return;
    updateCircle(activeCircle.id, (circle) => ({ ...circle, coachRequest: null }));
    showToast('Coach request cancelled.');
  };

  if (!activeCircle) {
    return (
      <>
        <EmptyCircles onCreate={() => setDialog('create')} />
        {dialog === 'create' && <CreateCircleDialog onClose={() => setDialog(null)} onSubmit={handleCreateCircle} />}
        {toast && <div className="app-toast" role="status">{toast}</div>}
      </>
    );
  }

  return (
    <section className="circles-view" aria-label="Accountability community">
      <button id="create-circle-trigger" type="button" hidden onClick={() => setDialog('create')} />
      <div className="circle-context-bar">
        <div className="circle-switcher">
          <label htmlFor="circle-select">CURRENT COMMUNITY</label>
          <select
            id="circle-select"
            value={activeCircle.id}
            onChange={(event) => {
              setActiveCircleId(event.target.value);
              setActiveSection('overview');
            }}
          >
            {circles.map((circle) => <option key={circle.id} value={circle.id}>{circle.name}</option>)}
          </select>
        </div>
        <div className="circle-context-meta">
          <span>{activeCircle.members.length} members</span>
          <span className="private-pill"><i aria-hidden="true" /> {activeCircle.privacy}</span>
          <button type="button" className="ghost-button compact" onClick={() => setDialog('invite')}>Invite</button>
        </div>
      </div>

      <div className="circle-title-row">
        <div>
          <h2>{activeCircle.name}</h2>
          <p>{activeCircle.purpose}</p>
        </div>
        <div className="circle-avatar-stack" aria-label={`${activeCircle.members.length} circle members`}>
          {activeCircle.members.slice(0, 5).map((member) => <Avatar key={member.id} member={member} />)}
        </div>
      </div>

      <nav className="circle-section-tabs" aria-label="Circle sections">
        {sectionTabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={activeSection === tab.id ? 'is-active' : ''}
            onClick={() => setActiveSection(tab.id)}
            aria-current={activeSection === tab.id ? 'page' : undefined}
          >
            {tab.label}
            {tab.id === 'people' && <span>{activeCircle.members.length}</span>}
            {tab.id === 'coach' && activeCircle.coachRequest && <i aria-hidden="true" />}
          </button>
        ))}
      </nav>

      {activeSection === 'overview' && (
        <CircleOverview
          circle={activeCircle}
          onCheckIn={() => setDialog('checkin')}
          onInvite={() => setDialog('invite')}
          onNudge={(member) => { setNudgeTarget(member); setDialog('nudge'); }}
          onSectionChange={setActiveSection}
          onReact={handleReact}
          onComment={(checkIn) => { setCommentTarget(checkIn); setDialog('comment'); }}
        />
      )}

      {activeSection === 'challenge' && (
        <ChallengeView
          circle={activeCircle}
          onCheckIn={() => setDialog('checkin')}
          onEdit={() => setDialog('challenge')}
        />
      )}

      {activeSection === 'people' && (
        <PeopleView
          circle={activeCircle}
          onInvite={() => setDialog('invite')}
          onNudge={(member) => { setNudgeTarget(member); setDialog('nudge'); }}
        />
      )}

      {activeSection === 'coach' && (
        <CoachView
          circle={activeCircle}
          onRequest={(coach) => { setCoachTarget(coach); setDialog('coach'); }}
          onCancel={handleCoachCancel}
        />
      )}

      {dialog === 'create' && <CreateCircleDialog onClose={() => setDialog(null)} onSubmit={handleCreateCircle} />}
      {dialog === 'checkin' && <CheckInDialog circle={activeCircle} onClose={() => setDialog(null)} onSubmit={handleCheckIn} />}
      {dialog === 'invite' && <InviteDialog circle={activeCircle} onClose={() => setDialog(null)} onSubmit={handleInvite} />}
      {dialog === 'nudge' && nudgeTarget && <NudgeDialog member={nudgeTarget} onClose={() => setDialog(null)} onSubmit={handleNudge} />}
      {dialog === 'comment' && commentTarget && (
        <CommentDialog
          checkIn={commentTarget}
          member={activeCircle.members.find((member) => member.id === commentTarget.memberId)}
          onClose={() => setDialog(null)}
          onSubmit={handleComment}
        />
      )}
      {dialog === 'challenge' && <ChallengeDialog circle={activeCircle} onClose={() => setDialog(null)} onSubmit={handleChallengeUpdate} />}
      {dialog === 'coach' && coachTarget && (
        <CoachRequestDialog
          coach={coachTarget}
          circle={activeCircle}
          onClose={() => setDialog(null)}
          onSubmit={handleCoachRequest}
        />
      )}
      {toast && <div className="app-toast" role="status">{toast}</div>}
    </section>
  );
}

export default CirclesView;
