import { useEffect, useState } from 'react';

function ProgressBar({ completed, total }) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  useEffect(() => {
    const timer = window.setTimeout(() => setAnimatedPercentage(percentage), 100);
    return () => window.clearTimeout(timer);
  }, [percentage]);

  return (
    <section className="panel progress-panel" aria-labelledby="progress-title">
      <div className="panel-heading">
        <h2 id="progress-title">Today&apos;s progress</h2>
      </div>

      <div className="progress-readout">
        <output>{String(percentage).padStart(2, '0')}%</output>
        <p>
          <strong>{completed}</strong> complete<br />
          <span>{total} scheduled</span>
        </p>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-label="Daily habit completion"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={percentage}
      >
        <div className="progress-fill" style={{ width: `${animatedPercentage}%` }} />
      </div>

      <div className="progress-scale" aria-hidden="true">
        <span>00</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </section>
  );
}

export default ProgressBar;
