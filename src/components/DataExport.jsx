import { useState } from 'react';

function DataExport({ habits, completions, sprint, sprintCheckIns, sprintReviews, sprintRole, circles, onImportData, onClearAllData }) {
  const [notice, setNotice] = useState('');

  const exportData = () => {
    const data = {
      habits,
      completions,
      sprint,
      sprintCheckIns,
      sprintReviews,
      sprintRole,
      circles,
      exportDate: new Date().toISOString(),
      version: '1.2',
    };
    const dataBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `habit-ledger-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setNotice('Backup exported to your downloads.');
  };

  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const importedData = JSON.parse(loadEvent.target.result);
        const hasValidHabits = Array.isArray(importedData.habits);
        const hasValidCompletions = importedData.completions
          && typeof importedData.completions === 'object'
          && !Array.isArray(importedData.completions);

        if (!hasValidHabits || !hasValidCompletions) {
          setNotice('That file does not contain a valid Habit Ledger backup.');
          return;
        }

        onImportData(importedData);
        const sprintLabel = importedData.sprint ? ' and one sprint' : '';
        const circleLabel = Array.isArray(importedData.circles) && importedData.circles.length > 0
          ? ` and ${importedData.circles.length} circle${importedData.circles.length === 1 ? '' : 's'}`
          : '';
        setNotice(`${importedData.habits.length} habit${importedData.habits.length === 1 ? '' : 's'}${sprintLabel}${circleLabel} imported successfully.`);
        event.target.value = '';
      } catch {
        setNotice('The backup could not be read. Choose a valid JSON export.');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    const shouldClear = window.confirm('Clear every habit, completion record, sprint, and circle? This cannot be undone.');
    if (!shouldClear) return;

    onClearAllData();
    setNotice('All local habit, sprint, and circle data has been cleared.');
  };

  return (
    <section className="data-panel" aria-label="Data and backups">
      <div className="panel-meta data-panel__meta">
        <p className="eyebrow">DATA CONTROLS</p>
        <p className="panel-meta__note">Your records stay in this browser until you export or clear them.</p>
      </div>

      <div className="data-actions">
        <article className="content-card data-action">
          <p className="eyebrow">01 · BACK UP</p>
          <p className="data-action__title">Export your record</p>
          <p>Download habits, completion history, sprint records, and circles as a JSON backup file.</p>
          <button type="button" onClick={exportData} className="button button-primary">Export data</button>
        </article>

        <article className="content-card data-action">
          <p className="eyebrow">02 · RESTORE</p>
          <p className="data-action__title">Import a backup</p>
          <p>Bring a previously exported Habit Ledger file, sprint record, and circles back to this device.</p>
          <label htmlFor="backup-file" className="button button-outline data-action__file-label">
            Import data
          </label>
          <input
            id="backup-file"
            type="file"
            accept="application/json,.json"
            onChange={importData}
            className="visually-hidden"
          />
        </article>

        <article className="content-card data-action">
          <p className="eyebrow">03 · RESET</p>
          <p className="data-action__title">Clear this device</p>
          <p>Remove all locally stored habits and completion history permanently.</p>
          <button type="button" onClick={clearAllData} className="button button-quiet">Clear all data</button>
        </article>
      </div>

      {notice && <p className="data-status" role="status">{notice}</p>}

      <aside className="data-note" aria-label="Data management note">
        <p className="eyebrow">LOCAL STORAGE</p>
        <p>Export a backup before clearing browser data or moving to a new device.</p>
      </aside>
    </section>
  );
}

export default DataExport;
