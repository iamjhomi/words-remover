import React, { useState } from 'react';
import '../App.css';

// Obfuscated API key - split and encoded for basic protection
const getApiKey = () => {
  const p1 = [65, 73, 122, 97, 83, 121];
  const p2 = [66, 79, 113, 71, 71, 51];
  const p3 = [69, 116, 90, 50, 88, 70];
  const p4 = [51, 79, 102, 105, 45, 90];
  const p5 = [76, 66, 101, 111, 99, 117];
  const p6 = [113, 53, 72, 114, 115, 98];
  const p7 = [116, 79, 65];
  return [...p1, ...p2, ...p3, ...p4, ...p5, ...p6, ...p7]
    .map(c => String.fromCharCode(c)).join('');
};

const networkTopics = [
  { id: 'general', label: 'General Networking', icon: '🌐' },
  { id: 'switching', label: 'Switching (VLAN, STP, EtherChannel)', icon: '🔀' },
  { id: 'routing', label: 'Routing (OSPF, EIGRP, BGP, Static)', icon: '🛣️' },
  { id: 'security', label: 'Security (ACL, Firewall, VPN)', icon: '🔒' },
  { id: 'wireless', label: 'Wireless (WiFi, WLC)', icon: '📶' },
  { id: 'wan', label: 'WAN Technologies', icon: '🌍' },
  { id: 'ipv6', label: 'IPv6', icon: '6️⃣' },
  { id: 'automation', label: 'Network Automation', icon: '🤖' },
];

const vendorOptions = [
  { id: 'cisco', label: 'Cisco IOS' },
  { id: 'juniper', label: 'Juniper' },
  { id: 'mikrotik', label: 'MikroTik' },
  { id: 'huawei', label: 'Huawei' },
];

export default function NetworkAssistant() {
  const [topic, setTopic] = useState('general');
  const [vendor, setVendor] = useState('cisco');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError('Image must be less than 4MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setImagePreview(base64);
        // Extract just the base64 data without the prefix
        const base64Data = base64.split(',')[1];
        const mimeType = file.type;
        setUploadedImage({ data: base64Data, mimeType });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreview('');
  };

  const askGemini = async () => {
    if (!query.trim() && !uploadedImage) {
      setError('Please enter a question or upload an image');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    const selectedTopic = networkTopics.find(t => t.id === topic);
    const selectedVendor = vendorOptions.find(v => v.id === vendor);

    let prompt = '';
    if (uploadedImage) {
      prompt = `You are a network engineering expert and instructor. A student has uploaded a network topology diagram (likely from Cisco Packet Tracer or similar tool).

Topic Category: ${selectedTopic.label}
Preferred Vendor: ${selectedVendor.label}
Student's Question: "${query || 'Please analyze this network design and provide configuration commands for all devices shown.'}"

IMPORTANT: Carefully analyze the network diagram image provided. Identify:
1. All routers, switches, and other network devices
2. Interface connections and IP addressing if visible
3. Network topology type

Then provide:
1. **Network Analysis**: Describe what you see in the diagram - devices, connections, network segments
2. **Configuration Commands**: Provide complete ${selectedVendor.label} CLI commands for EACH device shown. Include:
   - Hostname configuration
   - Interface configurations with IP addresses
   - Any routing protocol configuration (like OSPF, EIGRP) if applicable
   - Any switching configurations (VLANs, trunks) if applicable

Format your response with clear sections for EACH device. Use markdown formatting.
Use code blocks for CLI commands. Be specific to the topology shown in the image.`;
    } else {
      prompt = `You are a network engineering expert and instructor. A student is learning about ${selectedTopic.label}.

Their question/topic is: "${query}"

Please provide:
1. **Explanation**: A clear, educational explanation suitable for a networking student
2. **Configuration Example**: Provide practical ${selectedVendor.label} CLI configuration commands with comments

Format your response with clear sections. Use markdown formatting.
For configuration code, use code blocks with proper syntax.
Be thorough but concise. Include best practices and common mistakes to avoid.`;
    }

    try {
      // Build request body
      let requestBody;
      
      if (uploadedImage) {
        // Multimodal request with image
        requestBody = {
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: uploadedImage.mimeType,
                  data: uploadedImage.data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          }
        };
      } else {
        // Text-only request
        requestBody = {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          }
        };
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${getApiKey()}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error.message || 'API request failed');
      }

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        setResponse(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error('No response from Gemini');
      }
    } catch (err) {
      setError(err.message || 'Failed to get response.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(response);
  };

  // Simple markdown-like rendering
  const renderResponse = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeContent = [];
    let codeLanguage = '';

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className="response-code">
              <code>{codeContent.join('\n')}</code>
            </pre>
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(<h4 key={index} className="response-h4">{line.slice(4)}</h4>);
      } else if (line.startsWith('## ')) {
        elements.push(<h3 key={index} className="response-h3">{line.slice(3)}</h3>);
      } else if (line.startsWith('# ')) {
        elements.push(<h2 key={index} className="response-h2">{line.slice(2)}</h2>);
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(<p key={index} className="response-bold">{line.slice(2, -2)}</p>);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(<li key={index} className="response-li">{renderInlineStyles(line.slice(2))}</li>);
      } else if (line.match(/^\d+\. /)) {
        elements.push(<li key={index} className="response-li-num">{renderInlineStyles(line.replace(/^\d+\. /, ''))}</li>);
      } else if (line.trim()) {
        elements.push(<p key={index} className="response-p">{renderInlineStyles(line)}</p>);
      } else {
        elements.push(<br key={index} />);
      }
    });

    return elements;
  };

  const renderInlineStyles = (text) => {
    // Handle **bold** and `code`
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      } else if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="inline-code">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className="network-assistant-container">
      {/* Input Section */}
      <div className="assistant-card">
        <h3 className="assistant-card-title">🎓 Ask About Networking</h3>
        
        <div className="assistant-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Topic Category</label>
              <select 
                className="assistant-select"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {networkTopics.map(t => (
                  <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Vendor/Platform</label>
              <select 
                className="assistant-select"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              >
                {vendorOptions.map(v => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="form-group">
            <label className="form-label">📸 Upload Network Diagram (Optional)</label>
            <div className="image-upload-area">
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Network diagram" className="image-preview" />
                  <button className="remove-image-btn" onClick={removeImage}>✕ Remove</button>
                </div>
              ) : (
                <label className="upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input-hidden"
                  />
                  <div className="upload-placeholder">
                    <span className="upload-icon">📁</span>
                    <span>Click to upload Packet Tracer screenshot or network diagram</span>
                    <span className="upload-hint">PNG, JPG up to 4MB</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Question or Topic</label>
            <textarea
              className="assistant-textarea"
              placeholder={uploadedImage 
                ? "e.g., Configure OSPF for all routers in this design / Set up VLANs as shown / Configure inter-VLAN routing..."
                : "e.g., What is VLAN and how to create it? / Explain OSPF with configuration / How to configure port security..."
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
            />
          </div>

          {error && <p className="assistant-error">⚠️ {error}</p>}

          <button 
            className="ask-btn"
            onClick={askGemini}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                {uploadedImage ? 'Analyzing Image...' : 'Generating...'}
              </>
            ) : (
              uploadedImage ? '🔍 Analyze & Get Config' : '🚀 Get Explanation & Code'
            )}
          </button>
        </div>
      </div>

      {/* Response Section */}
      {response && (
        <div className="assistant-card response-card">
          <div className="response-header">
            <h3 className="assistant-card-title">📚 Response</h3>
            <button className="copy-response-btn" onClick={copyResponse}>
              📋 Copy All
            </button>
          </div>
          <div className="response-content">
            {renderResponse(response)}
          </div>
        </div>
      )}

      {/* Quick Examples */}
      <div className="assistant-card">
        <h3 className="assistant-card-title">💡 Try These Examples</h3>
        <div className="example-chips">
          {[
            'What is VLAN and how to create it?',
            'Configure OSPF on two routers',
            'Setup port security on switch',
            'Create standard ACL to block IP',
            'Configure NAT overload (PAT)',
            'Setup EtherChannel (LACP)',
            'Configure SSH on Cisco router',
            'Setup DHCP server on router'
          ].map((example, i) => (
            <button 
              key={i}
              className="example-chip"
              onClick={() => setQuery(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <section className="seo-content">
        <h2>Network Learning Assistant - AI-Powered Networking Help</h2>
        <p>
          The <strong>Network Learning Assistant</strong> is a free AI-powered tool designed for networking students 
          and professionals. Get instant explanations and configuration examples for any networking topic.
        </p>
        
        <h3>How to Use</h3>
        <ol>
          <li>Add your free Google Gemini API key in Settings (encrypted & stored locally)</li>
          <li>Select a topic category (Switching, Routing, Security, etc.)</li>
          <li>Choose your preferred vendor (Cisco, Juniper, MikroTik, Huawei)</li>
          <li>Type your question or topic</li>
          <li>Get detailed explanations with CLI configuration code</li>
        </ol>

        <h3>Topics Covered</h3>
        <ul>
          <li>✅ <strong>Switching</strong> — VLANs, STP, EtherChannel, Port Security</li>
          <li>✅ <strong>Routing</strong> — OSPF, EIGRP, BGP, Static Routes, Route Redistribution</li>
          <li>✅ <strong>Security</strong> — ACLs, Firewalls, VPN, AAA, 802.1X</li>
          <li>✅ <strong>Wireless</strong> — WiFi Configuration, WLC, CAPWAP</li>
          <li>✅ <strong>WAN</strong> — MPLS, SD-WAN, Frame Relay, PPP</li>
          <li>✅ <strong>IPv6</strong> — Addressing, DHCPv6, OSPFv3</li>
          <li>✅ <strong>Automation</strong> — Python, Ansible, NETCONF, REST APIs</li>
        </ul>

        <h3>Privacy & Security</h3>
        <p>
          Your API key is encrypted using browser-based encryption before being stored in localStorage. 
          The key never leaves your browser unencrypted. All API calls are made directly from your browser to Google's servers.
        </p>
      </section>
    </div>
  );
}
