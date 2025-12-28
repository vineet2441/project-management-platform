import React, { useState, useEffect } from 'react';
import { getProjectCode, saveProjectCode } from '../services/projectService';
import './CodeEditor.css';

interface CodeEditorProps {
  projectId: number;
  canEdit: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ projectId, canEdit }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadCode = async () => {
      try {
        setLoading(true);
        const loadedCode = await getProjectCode(projectId);
        setCode(loadedCode);
      } catch (err) {
        setError('Failed to load code');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCode();
  }, [projectId]);

  const handleSave = async () => {
    if (!canEdit) {
      setError('You do not have permission to edit this code');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      await saveProjectCode(projectId, code);
      setMessage('Code saved successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError('Failed to save code');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="code-editor-container"><div className="loading">Loading code editor...</div></div>;
  }

  return (
    <div className="code-editor-container">
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      
      <div className="editor-header">
        <h3>Code Workspace</h3>
        {canEdit && (
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Code'}
          </button>
        )}
      </div>
      
      <textarea
        className="code-textarea"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        disabled={!canEdit}
        placeholder="Write or paste your code here..."
      />
    </div>
  );
};

export default CodeEditor;
