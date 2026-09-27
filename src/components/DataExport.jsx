function DataExport({ habits, completions, circles }) {
  const exportData = () => {
    const data = {
      habits,
      completions,
      circles,
      exportDate: new Date().toISOString(),
      version: '2.0',
    };

    const dataBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const importedData = JSON.parse(loadEvent.target.result);

        if (importedData.habits && importedData.completions) {
          window.localStorage.setItem('habits', JSON.stringify(importedData.habits));
          window.localStorage.setItem('completions', JSON.stringify(importedData.completions));
          if (Array.isArray(importedData.circles)) {
            window.localStorage.setItem('accountability-circles-v1', JSON.stringify(importedData.circles));
          }
          window.alert('Backup restored. The page will now reload.');
          window.location.reload();
        } else {
          window.alert('This file is not a valid Habit backup.');
        }
      } catch (error) {
        console.error('Import error:', error);
        window.alert('The selected file could not be read.');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    const shouldClear = window.confirm('Clear every habit, completion, and circle? This cannot be undone.');
    if (!shouldClear) return;

    window.localStorage.removeItem('habits');
    window.localStorage.removeItem('completions');
    window.localStorage.removeItem('accountability-circles-v1');
    window.location.reload();
  };

  return (
    <section className="data-section" aria-label="Data management">
      <div className="data-grid">
        <article className="data-card">
          <h3>Export backup</h3>
          <p>Download habits, completions, and accountability circles as a readable JSON file.</p>
          <button type="button" onClick={exportData} className="primary-button">Download data</button>
        </article>

        <article className="data-card">
          <h3>Restore backup</h3>
          <p>Replace local data with a previously exported Habit backup.</p>
          <label className="ghost-button file-button">
            Choose file
            <input type="file" accept=".json,application/json" onChange={importData} />
          </label>
        </article>

        <article className="data-card danger-card">
          <h3>Clear local data</h3>
          <p>Permanently remove all habits, completions, and circle data from this browser.</p>
          <button type="button" onClick={clearAllData} className="ghost-button">Clear everything</button>
        </article>
      </div>

    </section>
  );
}

export default DataExport;
