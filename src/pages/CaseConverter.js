import React, { useState, useRef, useEffect } from 'react';
import '../App.css';

const caseOptions = [
  { id: 'sentence', label: 'Sentence case', icon: 'Aa' },
  { id: 'lower', label: 'lower case', icon: 'aa' },
  { id: 'upper', label: 'UPPER CASE', icon: 'AA' },
  { id: 'capitalized', label: 'Capitalized Case', icon: 'Aa' },
  { id: 'title', label: 'Title Case', icon: 'Tt' },
  { id: 'toggle', label: 'tOGGLE cASE', icon: 'aA' },
  { id: 'alternating', label: 'aLtErNaTiNg', icon: 'aA' },
  { id: 'inverse', label: 'InVeRsE', icon: '⇅' },
];

function convertCase(text, caseType) {
  switch (caseType) {
    case 'sentence':
      // Capitalize first letter of each sentence
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

    case 'lower':
      return text.toLowerCase();

    case 'upper':
      return text.toUpperCase();

    case 'capitalized':
      // Capitalize first letter of each word
      return text
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());

    case 'title':
      // Title case: capitalize words except small words (a, an, the, etc.) unless first
      const smallWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'of', 'in', 'is'];
      return text
        .toLowerCase()
        .split(' ')
        .map((word, i) => {
          if (i === 0 || !smallWords.includes(word)) {
            return word.charAt(0).toUpperCase() + word.slice(1);
          }
          return word;
        })
        .join(' ');

    case 'toggle':
      // Swap case of each character (only letters)
      return text
        .split('')
        .map((c) => {
          if (/[a-z]/.test(c)) return c.toUpperCase();
          if (/[A-Z]/.test(c)) return c.toLowerCase();
          return c;
        })
        .join('');

    case 'alternating':
      // aLtErNaTiNg case
      let idx = 0;
      return text
        .split('')
        .map((c) => {
          if (/[a-zA-Z]/.test(c)) {
            const result = idx % 2 === 0 ? c.toLowerCase() : c.toUpperCase();
            idx++;
            return result;
          }
          return c;
        })
        .join('');

    case 'inverse':
      // Inverse of alternating
      let idx2 = 0;
      return text
        .split('')
        .map((c) => {
          if (/[a-zA-Z]/.test(c)) {
            const result = idx2 % 2 === 0 ? c.toUpperCase() : c.toLowerCase();
            idx2++;
            return result;
          }
          return c;
        })
        .join('');

    default:
      return text;
  }
}

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedCase, setSelectedCase] = useState('sentence');
  const fileInputRef = useRef(null);

  // Live update
  useEffect(() => {
    const t = setTimeout(() => {
      setOutput(convertCase(input, selectedCase));
    }, 150);
    return () => clearTimeout(t);
  }, [input, selectedCase]);

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
    } catch (err) {
      console.error('copy failed', err);
    }
  }

  function downloadOutput() {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'case-converter-output.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="word-remover-root">
      {/* Input section */}
      <div className="wr-editor-split">
        <div className="wr-editor-col" style={{ gridColumn: '1 / -1' }}>
          <div className="wr-editor-header">
            <span className="wr-editor-title">📝 Enter your text</span>
          </div>
          <textarea
            className="wr-textarea"
            placeholder="Type or paste your text here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ minHeight: '180px' }}
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
      </div>

      {/* Case options */}
      <div className="wr-options-panel">
        <h3 className="wr-panel-title">🔤 Select Case</h3>
        <div className="case-options-grid">
          {caseOptions.map((opt) => (
            <button
              key={opt.id}
              className={`case-option-btn ${selectedCase === opt.id ? 'active' : ''}`}
              onClick={() => setSelectedCase(opt.id)}
            >
              <span className="case-option-icon">{opt.icon}</span>
              <span className="case-option-label">{opt.label}</span>
            </button>
          ))}
        </div>
        <p className="wr-live-hint">🔴 Live — output updates automatically</p>
      </div>

      {/* Output section */}
      <div className="wr-editor-split">
        <div className="wr-editor-col" style={{ gridColumn: '1 / -1' }}>
          <div className="wr-editor-header">
            <span className="wr-editor-title">✅ Converted Output</span>
          </div>
          <textarea
            className="wr-textarea"
            placeholder="Converted text appears here..."
            value={output}
            readOnly
            style={{ minHeight: '180px' }}
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
        <h2>Free Online Case Converter Tool</h2>
        <p>
          The <strong>Case Converter</strong> is a free online text transformation tool that lets you instantly convert text between different letter cases. 
          Perfect for writers, programmers, students, and anyone who needs to format text quickly without manual editing.
        </p>
        
        <h3>Available Case Conversions</h3>
        <ul>
          <li><strong>Sentence case:</strong> Capitalizes the first letter of each sentence. "hello world. how are you?" → "Hello world. How are you?"</li>
          <li><strong>lower case:</strong> Converts all letters to lowercase. "HELLO" → "hello"</li>
          <li><strong>UPPER CASE:</strong> Converts all letters to uppercase. "hello" → "HELLO"</li>
          <li><strong>Capitalized Case:</strong> Capitalizes the first letter of every word. "hello world" → "Hello World"</li>
          <li><strong>Title Case:</strong> Like capitalized, but keeps small words (a, the, of, etc.) lowercase. "the lord of the rings" → "The Lord of the Rings"</li>
          <li><strong>tOGGLE cASE:</strong> Swaps uppercase to lowercase and vice versa. "Hello" → "hELLO"</li>
          <li><strong>aLtErNaTiNg:</strong> Alternates between lowercase and uppercase letters.</li>
          <li><strong>InVeRsE:</strong> Opposite of alternating case pattern.</li>
        </ul>

        <h3>How to Use</h3>
        <ol>
          <li>Paste or type your text in the input box.</li>
          <li>Click on any case option button below.</li>
          <li>Your converted text appears instantly in the output box.</li>
          <li>Copy the result or download as a text file.</li>
        </ol>

        <h3>Key Features</h3>
        <ul>
          <li>✅ <strong>8 case options</strong> — All popular text case formats</li>
          <li>✅ <strong>Live conversion</strong> — Results update as you type</li>
          <li>✅ <strong>Import from file</strong> — Upload .txt files directly</li>
          <li>✅ <strong>Copy & Download</strong> — Export with one click</li>
          <li>✅ <strong>100% Free</strong> — No registration required, works offline</li>
        </ul>

        <h3>Why Use a Case Converter?</h3>
        <p>
          Case converters save time when formatting titles, headings, code variables, social media posts, emails, and documents. 
          Instead of manually retyping text, simply paste it here and convert instantly. 
          Great for fixing accidental caps lock, standardizing data, and creative text styling.
        </p>
      </section>
    </div>
  );
}
