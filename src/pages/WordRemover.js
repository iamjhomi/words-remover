import React, { useState, useRef, useEffect } from 'react';
import '../App.css';

export default function WordRemover() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('word'); // 'word' or 'letter'
  const [count, setCount] = useState(1);
  const [side, setSide] = useState('left'); // 'left' or 'right'
  const fileInputRef = useRef(null);

  function processText() {
    // Process each line separately (bulk)
    const lines = input.split(/\r?\n/);
    const results = lines.map((line) => {
      if (!line) return ''; // preserve blank lines

      if (mode === 'word') {
        const words = line.split(/\s+/).filter(Boolean);
        if (count <= 0) return line;
        if (side === 'left') {
          // remove first N words
          return words.slice(count).join(' ');
        }
        // remove last N words
        return words.slice(0, Math.max(0, words.length - count)).join(' ');
      }

      // letter mode
      if (count <= 0) return line;
      if (side === 'left') {
        return line.substring(Math.min(count, line.length));
      }
      // right
      return line.substring(0, Math.max(0, line.length - count));
    });

    setOutput(results.join('\n'));
  }

  // Live update: when input or options change, process automatically with a small debounce
  useEffect(() => {
    const t = setTimeout(() => {
      processText();
    }, 250);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, mode, count, side]);

  function handleImportFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setInput(String(ev.target.result));
    reader.readAsText(file);
  }

  function clearInput() {
    setInput('');
  }

  function clearOutput() {
    setOutput('');
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      // briefly show a small confirmation? we keep minimal for now
    } catch (err) {
      console.error('copy failed', err);
    }
  }

  function downloadOutput() {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'word-remover-output.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="word-remover-root">
      {/* Options panel */}
      <div className="wr-options-panel">
        <h3 className="wr-panel-title">⚙️ Options</h3>

        <div className="wr-options-grid">
          {/* Mode selector */}
          <div className="wr-option-card">
            <span className="wr-option-label">Remove by</span>
            <div className="wr-toggle-group">
              <button
                className={`wr-toggle-btn ${mode === 'word' ? 'active' : ''}`}
                onClick={() => setMode('word')}
              >
                Word
              </button>
              <button
                className={`wr-toggle-btn ${mode === 'letter' ? 'active' : ''}`}
                onClick={() => setMode('letter')}
              >
                Letter
              </button>
            </div>
          </div>

          {/* Count */}
          <div className="wr-option-card">
            <span className="wr-option-label">How many?</span>
            <input
              type="number"
              min="0"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="wr-input-number"
            />
          </div>

          {/* Side selector */}
          <div className="wr-option-card">
            <span className="wr-option-label">From which side?</span>
            <div className="wr-toggle-group">
              <button
                className={`wr-toggle-btn ${side === 'left' ? 'active' : ''}`}
                onClick={() => setSide('left')}
              >
                ⬅️ Left
              </button>
              <button
                className={`wr-toggle-btn ${side === 'right' ? 'active' : ''}`}
                onClick={() => setSide('right')}
              >
                Right ➡️
              </button>
            </div>
          </div>
        </div>

        <p className="wr-live-hint">🔴 Live — output updates automatically</p>
      </div>

      {/* Text areas */}
      <div className="wr-editor-split">
        {/* Input */}
        <div className="wr-editor-col">
          <div className="wr-editor-header">
            <span className="wr-editor-title">📝 Input</span>
          </div>
          <textarea
            className="wr-textarea"
            placeholder="Paste or type text here (one item per line for bulk processing)."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="wr-editor-actions">
            <label className="wr-btn wr-btn-secondary">
              📂 Import File
              <input
                type="file"
                accept="text/*"
                onChange={handleImportFile}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </label>
            <button className="wr-btn wr-btn-ghost" onClick={clearInput}>🗑️ Clear</button>
          </div>
        </div>

        {/* Output */}
        <div className="wr-editor-col">
          <div className="wr-editor-header">
            <span className="wr-editor-title">✅ Output</span>
          </div>
          <textarea
            className="wr-textarea"
            placeholder="Results appear here automatically."
            value={output}
            readOnly
          />
          <div className="wr-editor-actions">
            <button className="wr-btn wr-btn-primary" onClick={copyOutput}>📋 Copy</button>
            <button className="wr-btn wr-btn-ghost" onClick={clearOutput}>🗑️ Clear</button>
            <button className="wr-btn wr-btn-secondary" onClick={downloadOutput}>⬇️ Download</button>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <section className="seo-content">
        <h2>Free Online Word Remover Tool</h2>
        <p>
          The <strong>Word Remover</strong> is a free online text tool that helps you quickly remove unwanted words or letters from your text. 
          Whether you need to clean up data, remove prefixes, suffixes, or specific words from multiple lines at once, this bulk text processor has you covered.
        </p>
        
        <h3>How to Use Word Remover</h3>
        <ul>
          <li><strong>Select type:</strong> Choose whether to remove words or individual letters/characters.</li>
          <li><strong>Set count:</strong> Enter the number of words or letters you want to remove.</li>
          <li><strong>Choose side:</strong> Select Left to remove from the beginning, or Right to remove from the end of each line.</li>
          <li><strong>Paste your text:</strong> Enter your text in the input box — each line is processed separately for bulk operations.</li>
          <li><strong>Get results instantly:</strong> The output updates automatically as you type or change options.</li>
        </ul>

        <h3>Key Features</h3>
        <ul>
          <li>✅ <strong>Bulk processing</strong> — Process multiple lines at once</li>
          <li>✅ <strong>Live preview</strong> — See results instantly without clicking any button</li>
          <li>✅ <strong>Import from file</strong> — Upload text files directly</li>
          <li>✅ <strong>Copy & Download</strong> — Export your results easily</li>
          <li>✅ <strong>100% Free</strong> — No sign-up, no limits, works in your browser</li>
        </ul>

        <h3>Use Cases</h3>
        <p>
          This tool is perfect for data cleaning, removing line numbers, stripping prefixes from lists, 
          trimming file extensions, cleaning up copied text, and preparing data for spreadsheets or databases.
        </p>
      </section>
    </div>
  );
}
