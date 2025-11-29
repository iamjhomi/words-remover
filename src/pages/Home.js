import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const tools = [
  {
    id: 'word-remover',
    name: 'Word Remover',
    description: 'Remove unwanted words from text quickly.',
    icon: '✂️'
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text to UPPER, lower, Title, Sentence case and more.',
    icon: '🔤'
  },
  {
    id: 'vlsm-calculator',
    name: 'VLSM Calculator',
    description: 'Variable Length Subnet Mask calculator to plan IP subnets efficiently.',
    icon: '🌐',
    externalUrl: 'https://iamjhomi.github.io/new/'
  },
  {
    id: 'number-converter',
    name: 'Number System Converter',
    description: 'Convert between decimal, binary, octal, and hexadecimal.',
    icon: '🔢'
  },
  {
    id: 'network-assistant',
    name: 'Network Assistant',
    description: 'AI-powered networking help with explanations and CLI configuration code.',
    icon: '🎓'
  }
];

export default function Home() {
  const [search, setSearch] = useState('');

  const filteredTools = tools.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="site-container">
      <header className="site-header">
        <h1 className="site-title">Multi-Tool Hub</h1>
        <p className="site-subtitle">Handy web tools in one place — click a tool to open it.</p>
      </header>

      <main className="content">
        {/* Search box */}
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <section className="tool-grid" aria-label="Tools">
          {filteredTools.length === 0 && (
            <p className="no-results">No tools found matching "{search}"</p>
          )}
          {filteredTools.map((t) => {
            // For external URLs, use the external link
            // For internal tools, use hash-based routing
            const href = t.externalUrl ? t.externalUrl : `#/tools/${t.id}`;

            return (
              <article key={t.id} className="tool-card">
                <div className="tool-card-icon">{t.icon}</div>
                <div className="tool-card-body">
                  <h3>{t.name}</h3>
                  <p>{t.description}</p>
                </div>
                <div className="tool-card-actions">
                  <a className="tool-button" href={href} target="_blank" rel="noopener noreferrer">Open →</a>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <footer className="site-footer">&copy; {new Date().getFullYear()} Multi-Tool Hub</footer>
    </div>
  );
}
