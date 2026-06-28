import { useState } from 'react';
import type { Category } from '../types';
import { CATEGORIES } from '../types';

interface AddLinkFormProps {
  onAdd: (label: string, url: string, category: Category) => void;
}

export function AddLinkForm({ onAdd }: AddLinkFormProps) {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<Category>('Job Hunting');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setError('Please enter a label.');
      return;
    }
    let normalized = url.trim();
    if (!normalized) {
      setError('Please enter a URL.');
      return;
    }
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = 'https://' + normalized;
    }
    try {
      new URL(normalized);
    } catch {
      setError('Please enter a valid URL.');
      return;
    }
    setError('');
    onAdd(label, normalized, category);
    setLabel('');
    setUrl('');
  };

  return (
    <form className="add-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">Add New Link</h2>

      <div className="form-row">
        <div className="field">
          <label htmlFor="link-label">Label</label>
          <input
            id="link-label"
            type="text"
            placeholder="e.g. GitHub, Portfolio"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="field field--url">
          <label htmlFor="link-url">URL</label>
          <input
            id="link-url"
            type="url"
            placeholder="https://github.com/you"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="form-row form-row--bottom">
        <div className="field field--cat">
          <label htmlFor="link-category">Category</label>
          <select
            id="link-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-add">
          <span className="btn-add__icon">+</span>
          Save Link
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
