/* greeting.js — dynamic greeting, niche quirky facts, animated number ticker */
'use strict';

(function () {
  /* ===================================================
     NICHE QUIRKY FACTS — sea creatures, space, history, 
     political, earth science, animals, art, music, etc.
     =================================================== */
  const FACTS = [
    // Sea creatures
    'The mantis shrimp can punch at 50 mph — fast enough to boil water.',
    'Octopuses have three hearts and blue blood.',
    'A group of flamingos is called a "flamboyance."',
    'Sea otters hold hands while sleeping so they don\u2019t drift apart.',
    'The immortal jellyfish can revert to its polyp stage and live forever.',
    'Dolphins have names for each other and respond to their specific whistle.',
    'A blue whale\u2019s heart is the size of a Volkswagen Beetle.',
    'Seahorses are the only animals where the male gives birth.',

    // Space & cosmos
    'A day on Venus is longer than a year on Venus.',
    'There are more stars in the universe than grains of sand on Earth.',
    'Neutron stars are so dense a teaspoon would weigh 6 billion tons.',
    'Saturn would float if you could find a bathtub big enough.',
    'The footprints on the Moon will last 100 million years.',
    'Space smells like seared steak and hot metal, according to astronauts.',
    'There\u2019s a planet made entirely of diamonds called 55 Cancri e.',
    'The Voyager 1 spacecraft is 14.6 billion miles from Earth and still transmitting.',

    // Historical
    'Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.',
    'Oxford University is older than the Aztec Empire.',
    'The shortest war in history lasted 38 to 45 minutes (Britain vs Zanzibar, 1896).',
    'Ancient Egyptians used slabs of stone as pillows.',
    'Vikings used to give kittens as wedding gifts.',
    'In 1932, Australia lost a war against emus. The emus won.',
    'Genghis Khan planted trees along his empire\u2019s roads so travelers could rest in shade.',

    // Political / social
    'Finland has more saunas than cars.',
    'In Switzerland, it\u2019s illegal to own just one guinea pig because they get lonely.',
    'Bhutan measures success by Gross National Happiness, not GDP.',
    'Iceland has no army and has been at peace for over 700 years.',

    // Earth science
    'The Earth\u2019s core is as hot as the surface of the Sun.',
    'There are more trees on Earth than stars in the Milky Way.',
    'Lightning strikes Earth about 100 times every second.',
    'The Amazon rainforest produces 20% of the world\u2019s oxygen.',
    'Honey never spoils. Archaeologists found 3,000-year-old honey in Egyptian tombs.',

    // Animals
    'Crows can recognise human faces and hold grudges.',
    'A snail can sleep for three years.',
    'Wombats produce cube-shaped droppings.',
    'Elephants are the only animals that can\u2019t jump.',
    'A group of owls is called a "parliament."',
    'Axolotls can regenerate their brain, heart, and limbs.',

    // Art, music, miscellaneous
    'Beethoven continued composing masterpieces after going completely deaf.',
    'The Mona Lisa has no eyebrows — it was fashionable to shave them in Renaissance Florence.',
    'Bananas are berries, but strawberries aren\u2019t.',
    'The inventor of the Pringles can is buried in one.',
    'There are more possible games of chess than atoms in the observable universe.',
    'A cloud can weigh more than a million pounds.',
    'The average person walks the equivalent of five times around the Earth in a lifetime.'
  ];

  /* Time-based greeting */
  function getGreeting(name) {
    const h = new Date().getHours();
    let prefix;
    if      (h < 5)  prefix = 'Stars still out';
    else if (h < 12) prefix = 'Good morning';
    else if (h < 17) prefix = 'Good afternoon';
    else if (h < 21) prefix = 'Good evening';
    else              prefix = 'Night owl mode';
    return `${prefix}, ${name || 'friend'}.`;
  }

  /* Random fact */
  function randomFact() {
    return FACTS[Math.floor(Math.random() * FACTS.length)];
  }

  /* Animated number ticker */
  function animateTicker(el, target, dur) {
    if (!el) return;
    const start = performance.now();
    const from  = 0;
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (target - from) * e);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---- Init ---- */
  const greetEl = document.getElementById('greet-text');
  const factEl  = document.getElementById('fact-text');
  const tickEl  = document.getElementById('ticker-num');

  if (greetEl) {
    const name = window.HG_USERNAME || '';
    greetEl.textContent = getGreeting(name);
    // Fade-in animation
    greetEl.style.opacity = '0';
    greetEl.style.transform = 'translateY(8px)';
    requestAnimationFrame(() => {
      greetEl.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      greetEl.style.opacity = '1';
      greetEl.style.transform = 'translateY(0)';
    });
  }

  if (factEl) {
    factEl.textContent = randomFact();
    // Staggered fade-in
    factEl.style.opacity = '0';
    factEl.style.transform = 'translateY(6px)';
    setTimeout(() => {
      factEl.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      factEl.style.opacity = '1';
      factEl.style.transform = 'translateY(0)';
    }, 250);
  }

  if (tickEl) {
    const done = parseInt(window.HG_DONE, 10) || 0;
    setTimeout(() => animateTicker(tickEl, done, 900), 500);
  }

  /* ---- Modal trigger ---- */
  const newBtn = document.getElementById('new-habit-btn');
  const modal  = document.getElementById('new-habit-modal');
  if (newBtn && modal) {
    newBtn.addEventListener('click', () => modal.classList.add('open'));
  }
}());
