import React, { useState, useEffect } from 'react';
import '../App.css';

const numberSystems = [
  { id: 'decimal', label: 'Decimal (Base 10)', base: 10, placeholder: 'e.g. 255' },
  { id: 'binary', label: 'Binary (Base 2)', base: 2, placeholder: 'e.g. 11111111' },
  { id: 'octal', label: 'Octal (Base 8)', base: 8, placeholder: 'e.g. 377' },
  { id: 'hexadecimal', label: 'Hexadecimal (Base 16)', base: 16, placeholder: 'e.g. FF' },
];

function isValidInput(value, base) {
  if (!value || value.trim() === '') return true;
  const patterns = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9A-Fa-f]+$/,
  };
  return patterns[base]?.test(value.trim());
}

function convertNumber(value, fromBase) {
  if (!value || value.trim() === '') {
    return null;
  }

  try {
    const decimalValue = parseInt(value.trim(), fromBase);
    
    if (isNaN(decimalValue) || decimalValue < 0) {
      return null;
    }

    return {
      decimal: decimalValue.toString(10),
      binary: decimalValue.toString(2),
      octal: decimalValue.toString(8),
      hexadecimal: decimalValue.toString(16).toUpperCase(),
    };
  } catch {
    return null;
  }
}

export default function NumberConverter() {
  const [inputValue, setInputValue] = useState('');
  const [inputBase, setInputBase] = useState('decimal');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState('');

  const selectedSystem = numberSystems.find(s => s.id === inputBase);

  useEffect(() => {
    if (!inputValue.trim()) {
      setResults(null);
      setError('');
      return;
    }

    if (!isValidInput(inputValue, selectedSystem.base)) {
      setError(`Invalid ${selectedSystem.label.split(' ')[0]} number`);
      setResults(null);
      return;
    }

    setError('');
    const converted = convertNumber(inputValue, selectedSystem.base);
    setResults(converted);
  }, [inputValue, inputBase, selectedSystem]);

  const handleBaseChange = (e) => {
    setInputBase(e.target.value);
    setInputValue('');
    setResults(null);
    setError('');
  };

  const copyToClipboard = (value, id) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 1500);
  };

  // Get output formats (exclude the selected input)
  const outputFormats = numberSystems.filter(s => s.id !== inputBase);

  return (
    <div className="number-converter-container">
      {/* Input Section */}
      <div className="converter-card">
        <h3 className="converter-card-title">🔢 Convert From</h3>
        
        <div className="converter-form">
          <select 
            className="converter-select"
            value={inputBase}
            onChange={handleBaseChange}
          >
            {numberSystems.map((sys) => (
              <option key={sys.id} value={sys.id}>{sys.label}</option>
            ))}
          </select>

          <input
            type="text"
            className={`converter-text-input ${error ? 'has-error' : ''}`}
            placeholder={selectedSystem.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
          />
          
          {error && <p className="converter-error">⚠️ {error}</p>}
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="converter-card">
          <h3 className="converter-card-title">📊 Converted Results</h3>
          
          <div className="converter-results">
            {outputFormats.map((sys) => (
              <div key={sys.id} className="converter-result-item">
                <div className="result-info">
                  <span className="result-type">{sys.label.split(' ')[0]}</span>
                  <span className="result-base">{sys.label.match(/\(.*\)/)?.[0]}</span>
                </div>
                <div className="result-output">
                  <span className="result-number">{results[sys.id]}</span>
                  <button 
                    className={`copy-button ${copiedId === sys.id ? 'copied' : ''}`}
                    onClick={() => copyToClipboard(results[sys.id], sys.id)}
                  >
                    {copiedId === sys.id ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Reference */}
      <div className="converter-card">
        <h3 className="converter-card-title">📖 Quick Reference (0-15)</h3>
        <div className="converter-table-wrapper">
          <table className="converter-table">
            <thead>
              <tr>
                <th>Decimal</th>
                <th>Binary</th>
                <th>Octal</th>
                <th>Hex</th>
              </tr>
            </thead>
            <tbody>
              {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => (
                <tr key={n}>
                  <td>{n}</td>
                  <td>{n.toString(2)}</td>
                  <td>{n.toString(8)}</td>
                  <td>{n.toString(16).toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO Content */}
      <section className="seo-content">
        <h2>Free Online Number System Converter</h2>
        <p>
          The <strong>Number System Converter</strong> is a free online tool that instantly converts numbers between 
          Decimal, Binary, Octal, and Hexadecimal formats. Perfect for programmers, students, and anyone working with 
          different number bases.
        </p>
        
        <h3>How to Use</h3>
        <ol>
          <li>Select the number format you want to convert <strong>from</strong> using the dropdown.</li>
          <li>Enter your number in the input field.</li>
          <li>See instant conversions to all other number systems automatically.</li>
          <li>Click "Copy" to copy any result to your clipboard.</li>
        </ol>

        <h3>Supported Number Systems</h3>
        <ul>
          <li><strong>Decimal (Base 10):</strong> The standard number system. Uses digits 0-9.</li>
          <li><strong>Binary (Base 2):</strong> Used by computers. Uses only 0 and 1.</li>
          <li><strong>Octal (Base 8):</strong> Uses digits 0-7. Common in Unix file permissions.</li>
          <li><strong>Hexadecimal (Base 16):</strong> Uses 0-9 and A-F. Common for colors and memory addresses.</li>
        </ul>

        <h3>Key Features</h3>
        <ul>
          <li>✅ <strong>Live conversion</strong> — Results update as you type</li>
          <li>✅ <strong>Simple dropdown</strong> — Easy to select input format</li>
          <li>✅ <strong>Input validation</strong> — Warns you about invalid characters</li>
          <li>✅ <strong>One-click copy</strong> — Copy any result instantly</li>
          <li>✅ <strong>100% Free</strong> — No registration required</li>
        </ul>
      </section>
    </div>
  );
}
