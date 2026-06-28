import { useState, useRef } from 'react';
import type { Link } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  'Job Hunting': 'tag--job',
  Socials: 'tag--social',
  'Project Repos': 'tag--repo',
  Other: 'tag--other',
};

interface LinkCardProps {
  link: Link;
  onDelete: (id: string) => void;
}

export function LinkCard({ link, onDelete }: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = link.url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => onDelete(link.id), 280);
  };

  return (
    <div className={`link-card ${deleting ? 'link-card--exit' : ''}`}>
      {link.shortcutIndex > 0 && (
        <span className="shortcut-badge" title={`Alt+${link.shortcutIndex}`}>
          Alt+{link.shortcutIndex}
        </span>
      )}

      <span className={`tag ${CATEGORY_COLORS[link.category] ?? 'tag--other'}`}>
        {link.category}
      </span>

      <div className="link-card__body">
        <p className="link-card__label">{link.label}</p>
        <a
          className="link-card__url"
          href={link.url}
          target="_blank"
          rel="noreferrer noopener"
          title={link.url}
        >
          {link.url}
        </a>
      </div>

      <div className="link-card__actions">
        <button
          className={`btn-copy ${copied ? 'btn-copy--success' : ''}`}
          onClick={handleCopy}
          aria-label={`Copy ${link.label} URL`}
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <svg className="icon-check" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10l4.5 4.5L16 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="icon-copy" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="7" y="7" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M13 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Copy
            </>
          )}
        </button>

        <button
          className="btn-delete"
          onClick={handleDelete}
          aria-label={`Delete ${link.label}`}
          title="Delete link"
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
