const JOB_KEYWORDS = [
  'resume', 'cv', 'linkedin', 'portfolio', 'github', 'cover letter',
  'application', 'apply', 'job', 'career', 'position', 'vacancy',
];

function detectJobForm() {
  const inputs = document.querySelectorAll('input[type="url"], input[type="text"], textarea');
  for (const input of inputs) {
    const label =
      input.getAttribute('placeholder')?.toLowerCase() ||
      input.getAttribute('aria-label')?.toLowerCase() ||
      input.getAttribute('name')?.toLowerCase() ||
      input.id?.toLowerCase() || '';

    if (JOB_KEYWORDS.some((kw) => label.includes(kw))) {
      return true;
    }
  }

  // Also scan page text for job-related headings
  const headings = document.querySelectorAll('h1, h2, h3, label');
  for (const h of headings) {
    const text = h.textContent?.toLowerCase() || '';
    if (JOB_KEYWORDS.some((kw) => text.includes(kw))) return true;
  }

  return false;
}

// Run detection after page settles
window.addEventListener('load', () => {
  if (detectJobForm()) {
    // Notify background (future: could trigger popup or badge)
    chrome.runtime.sendMessage({ type: 'JOB_FORM_DETECTED' }).catch(() => { });
  }
});
