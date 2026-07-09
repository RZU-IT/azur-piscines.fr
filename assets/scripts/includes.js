(async function () {
  const slots = document.querySelectorAll("[data-include]");

  await Promise.all([...slots].map(async (slot) => {
    const path = slot.dataset.include;
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      slot.outerHTML = await response.text();
    } catch {
      slot.remove();
    }
  }));

  document.dispatchEvent(new Event("includes:ready"));
})();

// Rzu-Informatique
