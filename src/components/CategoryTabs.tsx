import type { Category } from '../types';
import { CATEGORIES } from '../types';

interface CategoryTabsProps {
  active: Category | 'All';
  onChange: (cat: Category | 'All') => void;
  counts: Record<string, number>;
}

export function CategoryTabs({ active, onChange, counts }: CategoryTabsProps) {
  const all = ['All', ...CATEGORIES] as const;

  return (
    <nav className="cat-tabs" role="tablist" aria-label="Filter by category">
      {all.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          className={`cat-tab ${active === cat ? 'cat-tab--active' : ''}`}
          onClick={() => onChange(cat as Category | 'All')}
        >
          {cat}
          <span className="cat-tab__count">
            {cat === 'All' ? Object.values(counts).reduce((a, b) => a + b, 0) : (counts[cat] ?? 0)}
          </span>
        </button>
      ))}
    </nav>
  );
}
