/* entry.js — Auth module: tab switching, password toggle, login/register */
'use strict';

(function () {
  // Derive base URL from current page location (works regardless of context path)
  const BASE = window.location.pathname.replace(/\/[^/]*$/, '');
  // e.g. /HabitGarden → fetch paths will be /HabitGarden/LoginServlet

  /* ---- Tab Switching ---- */
  const tabs = {
    login:    { btn: document.getElementById('tab-login'),    form: document.getElementById('form-login') },
    register: { btn: document.getElementById('tab-register'), form: document.getElementById('form-register') }
  };

  function activateTab(name) {
    Object.entries(tabs).forEach(([key, t]) => {
      const active = key === name;
      t.btn.classList.toggle('active', active);
      t.btn.setAttribute('aria-selected', String(active));
      t.form.classList.toggle('hidden', !active);
    });
  }

  tabs.login.btn.addEventListener('click',    () => activateTab('login'));
  tabs.register.btn.addEventListener('click', () => activateTab('register'));

  /* ---- Password Toggles ---- */
  function setupToggle(btnId, inputId) {
    const btn   = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.classList.toggle('showing', show);
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  }

  setupToggle('toggle-login-pwd', 'login-password');
  setupToggle('toggle-reg-pwd',   'reg-password');

  /* ---- Error helper ---- */
  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('visible'); }
  }

  function clearError(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.remove('visible'); }
  }

  /* ---- Safe redirect with optional bloom ---- */
  function navigateTo(url) {
    if (window.StarTransition && typeof StarTransition.triggerBloom === 'function') {
      StarTransition.triggerBloom(() => { window.location.href = url; });
    } else {
      window.location.href = url;
    }
  }

  /* ---- Login ---- */
  document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError('login-error');
    const btn   = document.getElementById('login-btn');
    const email = document.getElementById('login-email').value.trim();
    const pass  = document.getElementById('login-password').value;

    if (!email || !pass) {
      showError('login-error', 'Please fill in all fields.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Entering…';

    try {
      const body = new URLSearchParams({ email, password: pass });
      const res  = await fetch(BASE + '/LoginServlet', {
        method: 'POST',
        body,
        headers: { 'Accept': 'application/json' }
      });

      let data;
      try { data = await res.json(); } catch (_) { data = {}; }

      if (res.ok && data.ok) {
        navigateTo(BASE + '/DashboardServlet');
      } else {
        showError('login-error', data.error || 'Invalid credentials. Try again.');
        btn.disabled = false;
        btn.textContent = 'Enter the Garden';
      }
    } catch (err) {
      showError('login-error', 'Cannot reach the server. Is Tomcat running?');
      btn.disabled = false;
      btn.textContent = 'Enter the Garden';
    }
  });

  /* ---- Register ---- */
  document.getElementById('form-register').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError('reg-error');
    const btn  = document.getElementById('reg-btn');
    const name = document.getElementById('reg-name').value.trim();
    const email= document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-password').value;

    if (!name || !email || !pass) {
      showError('reg-error', 'Please fill in all fields.');
      return;
    }
    if (pass.length < 6) {
      showError('reg-error', 'Password must be at least 6 characters.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Planting…';

    try {
      const body = new URLSearchParams({ name, email, password: pass });
      const res  = await fetch(BASE + '/RegisterServlet', {
        method: 'POST',
        body,
        headers: { 'Accept': 'application/json' }
      });

      let data;
      try { data = await res.json(); } catch (_) { data = {}; }

      if ((res.status === 200 || res.status === 201) && data.ok) {
        navigateTo(BASE + '/DashboardServlet');
      } else {
        showError('reg-error', data.error || 'Registration failed. Try again.');
        btn.disabled = false;
        btn.textContent = 'Plant My Seed';
      }
    } catch (err) {
      showError('reg-error', 'Cannot reach the server. Is Tomcat running?');
      btn.disabled = false;
      btn.textContent = 'Plant My Seed';
    }
  });
}());
