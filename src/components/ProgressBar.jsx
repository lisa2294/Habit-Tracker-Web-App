import { useEffect, useState } from 'react';

function ProgressBar({ completed, total }) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercentage(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <section className="progress-card" aria-label="Today’s habit progress">
      <div className="compact-panel-header">
        <div>
          <p className="eyebrow">TODAY’S STATUS</p>
          <p className="compact-panel-title">{completed} of {total} habits completed</p>
        </div>
        <output className="progress-number" aria-label={`${percentage} percent complete`}>
          {percentage}%
        </output>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={percentage}
        aria-label="Today’s habit completion progress"
      >
        <div className="progress-fill" style={{ width: `${animatedPercentage}%` }} />
      </div>

      <div className="progress-card__footer">
        <p>{total === 0 ? 'Add a habit to start today’s list.' : `${total - completed} remaining today.`}</p>
        <p>{percentage === 100 && total > 0 ? 'All set for today.' : 'Update each habit as you go.'}</p>
      </div>
    </section>
  );
}

export default ProgressBar;
