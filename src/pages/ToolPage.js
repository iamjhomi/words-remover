import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../App.css';
import WordRemover from './WordRemover';
import CaseConverter from './CaseConverter';

export default function ToolPage() {
  const { toolId } = useParams();

  const toolInfo = {
    'word-remover': {
      title: 'Word Remover',
      subtitle: 'Remove unwanted words from text quickly.',
      body: 'Paste or type text and choose words to remove. Options like case-sensitivity and whole-word matching can be added.'
    },
    'case-converter': {
      title: 'Case Converter',
      subtitle: 'Convert text to different cases instantly.',
      body: 'Convert your text to UPPER CASE, lower case, Title Case, Sentence case, and more.'
    },
    'vlsm-calculator': {
      title: 'VLSM Calculator',
      subtitle: 'Plan subnets with Variable Length Subnet Masking.',
      body: 'Enter a network (CIDR) and a list of required host counts; the calculator will assign subnets and masks. Tell me how you want the input/output formatted and I will implement it.'
    }
  };

  const info = toolInfo[toolId] || {
    title: toolId.replace(/-/g, ' '),
    subtitle: 'Tool page — implementation coming soon.',
    body: 'This is a placeholder for the selected tool.'
  };

  // If this tool is an external tool, redirect the browser immediately.
  useEffect(() => {
    if (toolId === 'vlsm-calculator') {
      window.location.href = 'https://iamjhomi.github.io/new/';
    }
  }, [toolId]);

  // If the word-remover tool is selected, render the full UI
  if (toolId === 'word-remover') {
    return (
      <div className="site-container">
        <header className="site-header small">
          <h1 className="site-title">{info.title}</h1>
          <p className="site-subtitle">{info.subtitle}</p>
        </header>

        <main className="content tool-page">
          <WordRemover />
        </main>

        <footer className="site-footer">&copy; {new Date().getFullYear()} Multi-Tool Hub</footer>
      </div>
    );
  }

  // Case Converter tool
  if (toolId === 'case-converter') {
    return (
      <div className="site-container">
        <header className="site-header small">
          <h1 className="site-title">{info.title}</h1>
          <p className="site-subtitle">{info.subtitle}</p>
        </header>

        <main className="content tool-page">
          <CaseConverter />
        </main>

        <footer className="site-footer">&copy; {new Date().getFullYear()} Multi-Tool Hub</footer>
      </div>
    );
  }

  return (
    <div className="site-container">
      <header className="site-header small">
        <h1 className="site-title">{info.title}</h1>
        <p className="site-subtitle">{info.subtitle}</p>
      </header>

      <main className="content tool-page">
        <section className="tool-intro">
          <p>{info.body}</p>
          <div style={{ marginTop: 18 }}>
            <Link className="tool-button" to="/">Back to Home</Link>
          </div>
        </section>
      </main>

      <footer className="site-footer">&copy; {new Date().getFullYear()} Multi-Tool Hub</footer>
    </div>
  );
}
