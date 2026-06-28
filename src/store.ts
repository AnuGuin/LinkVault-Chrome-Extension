import { useState, useEffect, useCallback } from 'react';
import type { Link, Category } from './types';

const STORAGE_KEY = 'link_saver_links';

const isChromeExt = typeof chrome !== 'undefined' && !!chrome?.storage?.local;

async function readLinks(): Promise<Link[]> {
  if (isChromeExt) {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEY, (result) => {
        resolve((result[STORAGE_KEY] as Link[]) ?? []);
      });
    });
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Link[]) : [];
  } catch {
    return [];
  }
}

async function writeLinks(links: Link[]): Promise<void> {
  if (isChromeExt) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: links }, resolve);
    });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    readLinks().then((loaded) => {
      setLinks(loaded);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeLinks(links);
  }, [links, ready]);

  const addLink = useCallback(
    (label: string, url: string, category: Category) => {
      setLinks((prev) => {
        const existing = prev.filter((l) => l.shortcutIndex > 0);
        const nextShortcut = existing.length < 9 ? existing.length + 1 : 0;
        const newLink: Link = {
          id: crypto.randomUUID(),
          label: label.trim(),
          url: url.trim(),
          category,
          shortcutIndex: nextShortcut,
          createdAt: Date.now(),
        };
        return [...prev, newLink];
      });
    },
    []
  );

  const removeLink = useCallback((id: string) => {
    setLinks((prev) => {
      const filtered = prev.filter((l) => l.id !== id);
      let idx = 1;
      return filtered.map((l) => ({
        ...l,
        shortcutIndex: l.shortcutIndex > 0 ? idx++ : 0,
      }));
    });
  }, []);

  const updateLink = useCallback((id: string, patch: Partial<Omit<Link, 'id' | 'createdAt'>>) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  return { links, addLink, removeLink, updateLink, ready };
}
