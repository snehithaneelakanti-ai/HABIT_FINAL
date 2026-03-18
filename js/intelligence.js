/* intelligence.js — behavior-based reminder suggestions */
'use strict';

(function () {
  const BASE = window.location.pathname.replace(/\/[^/]*(\.jsp|Servlet)?$/, '');

  async function checkSuggestions() {
    try {
      const res = await fetch(BASE + '/SuggestionServlet');
      if (!res.ok) return;
      const suggestions = await res.json();
      
      if (suggestions && suggestions.length > 0) {
        showSuggestion(suggestions[0]); // Show one at a time
      }
    } catch (err) {
      console.warn('Intelligence check failed', err);
    }
  }

  function showSuggestion(s) {
    const container = document.getElementById('intelligence-box');
    if (!container) return;

    const card = document.createElement('div');
    card.className = 'intelligence-card';
    card.innerHTML = `
      <div class="intel-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <div class="intel-content">
        <div class="intel-header">Smart Habit Insight</div>
        <div class="intel-text">You usually complete <strong>${esc(s.habit_name)}</strong> around <strong>${s.suggested_time}</strong>. Want a reminder then?</div>
        <div class="intel-actions">
          <button class="intel-btn accept" data-id="${s.habit_id}" data-time="${s.suggested_time}">Accept</button>
          <button class="intel-btn ignore">Not now</button>
        </div>
      </div>
    `;

    container.appendChild(card);

    // Bindings
    card.querySelector('.accept').addEventListener('click', async (e) => {
      const btn = e.target;
      const hid = btn.dataset.id;
      const time = btn.dataset.time;
      
      btn.disabled = true;
      btn.textContent = 'Saving…';
      
      try {
        const res = await fetch(BASE + '/SuggestionServlet', {
          method: 'POST',
          body: new URLSearchParams({ habit_id: hid, time: time })
        });
        if (res.ok) {
          card.classList.add('dismissed');
          setTimeout(() => card.remove(), 400);
        }
      } catch (_) {
        btn.disabled = false;
        btn.textContent = 'Accept';
      }
    });

    card.querySelector('.ignore').addEventListener('click', () => {
      card.classList.add('dismissed');
      setTimeout(() => card.remove(), 400);
    });
  }

  function esc(s) {
    return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // Poll once on load
  window.addEventListener('load', () => {
    // Wait a bit for other animations to settle
    setTimeout(checkSuggestions, 2500);
  });
})();
