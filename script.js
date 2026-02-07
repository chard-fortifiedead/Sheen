function nextScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
        // Wait for animation
        setTimeout(() => {
            if (!screen.classList.contains('active')) {
                screen.style.display = 'none';
            }
        }, 600); // match css transition
    });

    // Show target screen
    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'flex';
        // Small delay to allow display flex to apply before adding class for transition
        setTimeout(() => {
            target.classList.add('active');
        }, 50);

        // Special handling for letter screen
        if (screenId === 'letter') {
            playMusic();
            setTimeout(revealLetter, 1000); // Wait for transition
        }
    }
}

let isMusicPlaying = false;
function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const btn = document.getElementById('musicBtn');

    if (isMusicPlaying) {
        music.pause();
        btn.innerHTML = '🎵 Play Music';
    } else {
        music.play();
        btn.innerHTML = '⏸ Pause Music';
    }
    isMusicPlaying = !isMusicPlaying;
}

function playMusic() {
    if (!isMusicPlaying) {
        const music = document.getElementById('bgMusic');
        music.volume = 0.5;
        music.play().then(() => {
            isMusicPlaying = true;
            document.getElementById('musicBtn').innerHTML = '⏸ Pause Music';
        }).catch(e => console.log("Audio play failed (user interaction needed first)"));
    }
}

function moveButton() {
    const noBtn = document.getElementById('noButton');
    const yesBtn = document.querySelector('.btn-yes');

    // Get viewport dimensions
    const maxX = window.innerWidth - noBtn.offsetWidth - 20;
    const maxY = window.innerHeight - noBtn.offsetHeight - 20;

    let x, y;
    let overlap = true;
    let attempts = 0;

    // Try to find a spot that doesn't overlap with the Yes button
    while (overlap && attempts < 10) {
        x = Math.random() * maxX;
        y = Math.random() * maxY;

        const noRect = { left: x, top: y, right: x + noBtn.offsetWidth, bottom: y + noBtn.offsetHeight };
        const yesRect = yesBtn.getBoundingClientRect();

        // Simple AABB collision check with some padding
        if (noRect.right < yesRect.left - 20 ||
            noRect.left > yesRect.right + 20 ||
            noRect.bottom < yesRect.top - 20 ||
            noRect.top > yesRect.bottom + 20) {
            overlap = false;
        }
        attempts++;
    }

    noBtn.style.position = 'fixed';
    noBtn.style.left = `${Math.max(20, x)}px`;
    noBtn.style.top = `${Math.max(20, y)}px`;
}

function celebrate() {
    nextScreen('success');
    launchConfetti();
}

function launchConfetti() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);

    // One big burst for the grand finale
    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff8fa3', '#c9184a', '#ff4d6d']
        });
    }, 500);
}

function revealLetter() {
    const paragraphs = document.querySelectorAll('.letter-body p');
    paragraphs.forEach((p, index) => {
        setTimeout(() => {
            p.classList.add('visible');
        }, index * 1500); // 1.5s delay between paragraphs
    });
}

