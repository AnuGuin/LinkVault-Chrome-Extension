import { useEffect, useMemo, useState } from 'react';
import { useLinks } from './store';
import { useTheme } from './useTheme';
import { AddLinkForm } from './components/AddLinkForm';
import { LinkCard } from './components/LinkCard';
import { CategoryTabs } from './components/CategoryTabs';
import type { Category } from './types';
import './App.css';

function App() {
  const { links, addLink, removeLink } = useLinks();
  const { theme, toggleTheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [kbToast, setKbToast] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      const digit = parseInt(e.key, 10);
      if (isNaN(digit) || digit < 1 || digit > 9) return;

      const target = links.find((l) => l.shortcutIndex === digit);
      if (!target) return;

      e.preventDefault();
      navigator.clipboard.writeText(target.url).catch(() => { });
      setKbToast(`Alt+${digit} → Copied "${target.label}"!`);
      setTimeout(() => setKbToast(null), 2500);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [links]);

  const filtered = useMemo(
    () =>
      activeCategory === 'All' ? links : links.filter((l) => l.category === activeCategory),
    [links, activeCategory]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const l of links) {
      c[l.category] = (c[l.category] ?? 0) + 1;
    }
    return c;
  }, [links]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__logo">
          <img src="/logo.png" alt="LinkVault Logo" />
        </div>
        <div className="app-header__text">
          <h1 className="app-header__title">LinkVault</h1>
          <p className="app-header__subtitle">Your job-hunt link arsenal</p>
        </div>
        <div className="app-header__right">
          <div className="app-header__hint">
            <kbd>Alt</kbd>+<kbd>1–9</kbd>
          </div>
          <button
            className="btn-theme"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              /* Sun icon */
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <AddLinkForm onAdd={addLink} />

      {links.length > 0 && (
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} counts={counts} />
      )}

      {links.length > 0 && <div className="section-divider" />}

      <main className="link-grid" aria-label="Saved links">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 24h16M24 16v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p>{activeCategory === 'All' ? 'No links yet. Add your first one above!' : `No links in "${activeCategory}".`}</p>
          </div>
        ) : (
          filtered.map((link) => (
            <LinkCard key={link.id} link={link} onDelete={removeLink} />
          ))
        )}
      </main>

      {kbToast && (
        <div className="kb-toast" role="status" aria-live="polite">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 10l4.5 4.5L16 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {kbToast}
        </div>
      )}
    </div>
  );
}

export default App;
