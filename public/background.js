const STORAGE_KEY = 'link_saver_links';


async function rebuildContextMenus() {
  await chrome.contextMenus.removeAll();

  const result = await chrome.storage.local.get(STORAGE_KEY);
  const links = result[STORAGE_KEY] ?? [];

  if (links.length === 0) {
    chrome.contextMenus.create({
      id: 'no-links',
      title: 'LinkVault – No links saved yet',
      contexts: ['editable'],
    });
    return;
  }

  chrome.contextMenus.create({
    id: 'linkvault-root',
    title: 'Insert Link via LinkVault',
    contexts: ['editable'],
  });

  const byCategory = {};
  for (const link of links) {
    if (!byCategory[link.category]) byCategory[link.category] = [];
    byCategory[link.category].push(link);
  }

  for (const [category, catLinks] of Object.entries(byCategory)) {
    const catId = `cat-${category}`;
    chrome.contextMenus.create({
      id: catId,
      parentId: 'linkvault-root',
      title: category,
      contexts: ['editable'],
    });

    for (const link of catLinks) {
      chrome.contextMenus.create({
        id: `link-${link.id}`,
        parentId: catId,
        title: `${link.label}  (${link.url.slice(0, 40)}${link.url.length > 40 ? '…' : ''})`,
        contexts: ['editable'],
      });
    }
  }
}

chrome.runtime.onInstalled.addListener(rebuildContextMenus);
chrome.storage.onChanged.addListener((changes) => {
  if (changes[STORAGE_KEY]) rebuildContextMenus();
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!info.menuItemId.toString().startsWith('link-')) return;
  const linkId = info.menuItemId.toString().replace('link-', '');

  const result = await chrome.storage.local.get(STORAGE_KEY);
  const links = result[STORAGE_KEY] ?? [];
  const link = links.find((l) => l.id === linkId);
  if (!link || !tab?.id) return;

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (url) => {
      const el = document.activeElement;
      if (!el) return;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        const start = el.selectionStart ?? el.value.length;
        const end = el.selectionEnd ?? el.value.length;
        el.setRangeText(url, start, end, 'end');
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (el.isContentEditable) {
        document.execCommand('insertText', false, url);
      }
    },
    args: [link.url],
  });
});
