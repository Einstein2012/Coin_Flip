/**
 * Coin Flip — script.js
 * Handles flipping logic, animation, stats, and TTS.
 */

// ── State ──────────────────────────────────────────────────────
const state = {
  history: [],       // full history of results ('H' | 'T')
  isFlipping: false,
  lastResult: null,  // 'Heads' | 'Tails'
};

// ── DOM References ─────────────────────────────────────────────
const coin        = document.getElementById('coin');
const flipBtn     = document.getElementById('flip-btn');
const speakBtn    = document.getElementById('speak-btn');
const lastFiveEl  = document.getElementById('last-five-results');
const headsPctEl  = document.getElementById('heads-pct');
const tailsPctEl  = document.getElementById('tails-pct');

// ── Flip ───────────────────────────────────────────────────────
function flip() {
    if (state.isFlipping) return;
    state.isFlipping = true;
    flipBtn.disabled = true;

    const result = Math.random() < 0.5 ? 'H' : 'T';
    const fullResult = result === 'H' ? 'Heads' : 'Tails';

    // Reset animation
    coin.classList.remove('flipping-heads', 'flipping-tails');
    coin.style.transform = '';
    void coin.offsetWidth;

    // Play the correct animation
    coin.classList.add(result === 'H' ? 'flipping-heads' : 'flipping-tails');

    setTimeout(() => {
        // End on the correct face
        coin.style.transform = result === 'H' ? 'rotateY(0deg)' : 'rotateY(180deg)';

        state.history.push(result);
        state.lastResult = fullResult;
        updateStats();

        state.isFlipping = false;
        flipBtn.disabled = false;
    }, 700);
}


// ── Stats ──────────────────────────────────────────────────────
function updateStats() {
  const { history } = state;

  // Last 5 pills
  const last5 = history.slice(-5);
  if (last5.length === 0) {
    lastFiveEl.textContent = '—';
  } else {
    lastFiveEl.innerHTML = last5
      .map(r => `<span class="pill pill-${r}">${r}</span>`)
      .join('');
  }

  // Percentages
  if (history.length === 0) {
    headsPctEl.textContent = '—';
    tailsPctEl.textContent = '—';
  } else {
    const heads = history.filter(r => r === 'H').length;
    const tails = history.length - heads;
    const hp = ((heads / history.length) * 100).toFixed(1);
    const tp = ((tails / history.length) * 100).toFixed(1);
    headsPctEl.textContent = `${hp}%`;
    tailsPctEl.textContent = `${tp}%`;
  }
}

// ── Text-to-Speech ─────────────────────────────────────────────
function speakResult() {
  if (!state.lastResult) {
    speak('No result yet. Press Flip to get started.');
    return;
  }
  speak(`${state.lastResult}!`);
}

function speak(text) {
  if (!('speechSynthesis' in window)) {
    alert('Sorry, your browser does not support text-to-speech.');
    return;
  }
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

// ── Event Listeners ────────────────────────────────────────────
flipBtn.addEventListener('click', flip);
speakBtn.addEventListener('click', speakResult);

// Allow spacebar / Enter on the flip button (default for <button>, but
// also catch keyboard events on the coin wrapper for accessibility)
document.addEventListener('keydown', (e) => {
  if ((e.code === 'Space' || e.code === 'Enter') && e.target === document.body) {
    e.preventDefault();
    flip();
  }
});

// ── Init ───────────────────────────────────────────────────────
updateStats();
