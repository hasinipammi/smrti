// Anonymous usage ping: a random per-browser id, language code and nothing else.
const UID_KEY = "smrti-uid";
const SESSION_KEY = "smrti-session";

export function trackVisit(lang?: string) {
  try {
    let id = localStorage.getItem(UID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(UID_KEY, id);
    }
    const session = !sessionStorage.getItem(SESSION_KEY);
    sessionStorage.setItem(SESSION_KEY, "1");
    void fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, lang, session }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // analytics must never affect the game
  }
}
