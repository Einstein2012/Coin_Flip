// State
const state = {
    isFlipping: false,
    history: [],
    lastResult: null
};

// Elements
const coin = document.getElementById('coin');
const flipBtn = document.getElementById('flip-btn');
const speakBtn = document.getElementById('speak-btn');

const lastFiveContainer = document.getElementById('last-five');
const headsPct = document.getElementById('heads-pct');
const tailsPct = document.getElementById('tails-pct');

// --- Update Stats ---
function updateStats() {
    // Last 5 results
    lastFiveContainer.innerHTML = '';
    const lastFive = state.history.slice(-5);

    lastFive.forEach(r => {
        const pill = document.createElement('div');
        pill.className = `pill pill-${r}`;
        pill.textContent = r;
        lastFiveContainer.appendChild(pill);
    });

    // Percentages
    const total = state.history.length;
    const headsCount = state.history.filter(r => r === 'H').length;
    const tailsCount = total - headsCount;

    headsPct.textContent = total ? Math.round((headsCount / total) * 100) + '%' : '0%';
    tailsPct.textContent = total ? Math.round((tailsCount / total) * 100) + '%' : '0%';
}

// --- Speak Result ---
function speakResult() {
    if (!state.lastResult) return;
    const msg = new SpeechSynthesisUtterance(state.lastResult);
    msg.rate = 1;
    msg.pitch = 1;
    speechSynthesis.speak(msg);
}

// --- Flip ---
function flip() {
    if (state.isFlipping) return;
    state.isFlipping = true;
    flipBtn.disabled = true;

    // Random result
    const result = Math.random() < 0.5 ? 'H' : 'T';
    const fullResult = result === 'H' ? 'Heads' : 'Tails';

    // Reset animation classes
    coin.classList.remove('flipping-heads', 'flipping-tails', 'result-heads', 'result-tails');
    coin.style.transform = '';
    void coin.offsetWidth; // restart animation

    // Play correct animation
    coin.classList.add(result === 'H' ? 'flipping-heads' : 'flipping-tails');

    // After animation finishes
    setTimeout(() => {
        // Remove animation classes
        coin.classList.remove('flipping-heads', 'flipping-tails');

        // Add correct resting class
        if (result === 'H') {
            coin.classList.add('result-heads');
        } else {
            coin.classList.add('result-tails');
        }

        // Update stats
        state.history.push(result);
        state.lastResult = fullResult;
        updateStats();

        // Unlock
        state.isFlipping = false;
        flipBtn.disabled = false;
    }, 700); // matches CSS --flip-duration
}

// --- Event Listeners ---
flipBtn.addEventListener('click', flip);
speakBtn.addEventListener('click', speakResult);

// Space / Enter to flip
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        flip();
    }
});
