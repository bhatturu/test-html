const invitation = document.getElementById('inviteApp');
const scenes = [...document.querySelectorAll('[data-scene]')];

const isMobile = window.matchMedia('(max-width:480px)').matches;
const petalCount = isMobile ? 8 : 28;
scenes.forEach((scene) => {
  const petals = document.createElement('div');
  petals.className = 'petal-layer';
  petals.setAttribute('aria-hidden', 'true');
  const petalColors = ['#f19aae', '#f5b5c1', '#d9637e', '#f6bdca', '#d75775', '#f7c4cc', '#db607b'];
  for (let index = 0; index < petalCount; index += 1) {
    const petal = document.createElement('i');
    petal.style.setProperty('--left', `${(index * 37 + 5) % 100}%`);
    petal.style.setProperty('--size', `${12 + ((index * 13) % 14)}px`);
    petal.style.setProperty('--duration', `${15 + ((index * 13) % 60) / 10}s`);
    petal.style.setProperty('--delay', `${-((index * 17) % 130) / 10}s`);
    petal.style.setProperty('--sway', `${((index * 19) % 52) - 26}vw`);
    petal.style.setProperty('--petal', petalColors[index % petalColors.length]);
    petals.append(petal);
  }
  scene.prepend(petals);
});

document.querySelectorAll('[data-scroll-to]').forEach((button) => {
  button.addEventListener('click', () => {
    const destination = document.getElementById(button.dataset.scrollTo);
    if (!destination) return;

    destination.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const eventScene = document.querySelector('.events-scene');
const eventTiles = [...document.querySelectorAll('.event-tile')];
let eventClearTimer;

const activateEventScene = (tile) => {
  if (!eventScene) return;
  window.clearTimeout(eventClearTimer);
  eventScene.dataset.activeEvent = tile.dataset.event;
  eventTiles.forEach((item) => item.classList.toggle('is-current', item === tile));
};

const scheduleEventSceneClear = () => {
  window.clearTimeout(eventClearTimer);
  eventClearTimer = window.setTimeout(() => {
    const hasHoveredTile = eventTiles.some((tile) => tile.matches(':hover'));
    const hasFocusedTile = eventTiles.includes(document.activeElement);
    if (hasHoveredTile || hasFocusedTile || !eventScene) return;
    delete eventScene.dataset.activeEvent;
    eventTiles.forEach((tile) => tile.classList.remove('is-current'));
  }, 110);
};

const isTouch = window.matchMedia('(hover:none)').matches;
eventTiles.forEach((tile) => {
  tile.addEventListener('pointerenter', () => activateEventScene(tile));
  tile.addEventListener('pointerleave', scheduleEventSceneClear);
  tile.addEventListener('focus', () => activateEventScene(tile));
  tile.addEventListener('blur', scheduleEventSceneClear);
  tile.addEventListener('click', () => activateEventScene(tile));
  tile.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    activateEventScene(tile);
  });
});

if (isTouch && eventScene) {
  const tileObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) activateEventScene(entry.target);
    });
  }, { root: invitation, threshold: 0.5 });
  eventTiles.forEach((tile) => tileObserver.observe(tile));
}

const sceneObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, {
  root: invitation,
  threshold: 0.18,
  rootMargin: '0px 0px -10% 0px',
});

scenes.forEach((scene) => sceneObserver.observe(scene));

const countdown = document.querySelector('[data-countdown]');
if (countdown) {
  const fields = {
    days: countdown.querySelector('[data-days]'),
    hours: countdown.querySelector('[data-hours]'),
    minutes: countdown.querySelector('[data-minutes]'),
    seconds: countdown.querySelector('[data-seconds]'),
  };
  // The event year was not provided; 2026 keeps the count meaningful until confirmed.
  const weddingMoment = new Date('2026-11-26T06:54:00');
  const updateCountdown = () => {
    let remaining = Math.max(0, weddingMoment.getTime() - Date.now());
    const days = Math.floor(remaining / 86400000);
    remaining -= days * 86400000;
    const hours = Math.floor(remaining / 3600000);
    remaining -= hours * 3600000;
    const minutes = Math.floor(remaining / 60000);
    remaining -= minutes * 60000;
    const seconds = Math.floor(remaining / 1000);
    fields.days.textContent = String(days).padStart(2, '0');
    fields.hours.textContent = String(hours).padStart(2, '0');
    fields.minutes.textContent = String(minutes).padStart(2, '0');
    fields.seconds.textContent = String(seconds).padStart(2, '0');
  };
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}
