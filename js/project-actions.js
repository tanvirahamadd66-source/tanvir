/*
  Shared "Appreciate / Save / Get in Touch" icon row behavior, used at the
  bottom of every project page (Behance, Featured, and UI/UX case studies).
  Each project's <div class="action-row" data-slug="..."> gets its own
  localStorage keys derived from that slug, so state never collides between
  projects. There's no backend, so this is a per-visitor toggle only — never
  a shared/global count, which would be dishonest to present as real.
*/
document.addEventListener("DOMContentLoaded", () => {
  const row = document.querySelector(".action-row[data-slug]");
  if (!row) return;
  const slug = row.dataset.slug;

  const clapBtn = row.querySelector("#clapBtn");
  if (clapBtn) {
    const CLAP_KEY = `appreciated:${slug}`;
    let liked = false;
    try { liked = localStorage.getItem(CLAP_KEY) === "1"; } catch (e) {}
    const renderClap = () => {
      clapBtn.classList.toggle("clapped", liked);
      clapBtn.setAttribute("aria-pressed", String(liked));
    };
    renderClap();
    clapBtn.addEventListener("click", () => {
      liked = !liked;
      renderClap();
      clapBtn.classList.add("pop");
      setTimeout(() => clapBtn.classList.remove("pop"), 260);
      try { localStorage.setItem(CLAP_KEY, liked ? "1" : "0"); } catch (e) {}
    });
  }

  const saveBtn = row.querySelector("#saveBtn");
  if (saveBtn) {
    const SAVE_KEY = `saved:${slug}`;
    let saved = false;
    try { saved = localStorage.getItem(SAVE_KEY) === "1"; } catch (e) {}
    const renderSave = () => {
      saveBtn.classList.toggle("saved", saved);
      saveBtn.setAttribute("aria-pressed", String(saved));
    };
    renderSave();
    saveBtn.addEventListener("click", () => {
      saved = !saved;
      renderSave();
      try { localStorage.setItem(SAVE_KEY, saved ? "1" : "0"); } catch (e) {}
    });
  }
});
