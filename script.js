// Get DOM elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const mainContainer = document.getElementById('mainContainer');
const celebration = document.getElementById('celebration');
const bgHearts = document.getElementById('bgHearts');
const floatingHearts = document.getElementById('floatingHearts');
const jumpingGif = document.getElementById('jumpingGif');

// State variables
let yesButtonScale = 1;
let noBtnMoveCount = 0;
let gifJumpInterval = null;

// Configuration for GIF
const GIF_CONFIG = {
    url: 'https://media.giphy.com/media/UO5elnTqo4vSg/giphy.gif', // Default celebration GIF - user can change this
    size: 150, // Size in pixels
    jumpIntervalMs: 800 // How often it jumps (in milliseconds) - faster now!
};

// Initialize background hearts
function createBackgroundHearts() {
    const heartCount = 15;
    const hearts = ['💕', '💖', '💗', '💝', '💘'];
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'bg-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        heart.style.fontSize = `${1 + Math.random() * 2}rem`;
        bgHearts.appendChild(heart);
    }
}

// Calculate if a position would overlap with the celebration text
function isPositionSafe(x, y, gifSize) {
    const celebrationContent = document.querySelector('.celebration-content');
    if (!celebrationContent) return true;
    
    const textRect = celebrationContent.getBoundingClientRect();
    
    // Add padding around the text area (smaller padding for more movement freedom)
    const padding = 30;
    const textLeft = textRect.left - padding;
    const textRight = textRect.right + padding;
    const textTop = textRect.top - padding;
    const textBottom = textRect.bottom + padding;
    
    // Check if GIF would overlap with text area
    const gifRight = x + gifSize;
    const gifBottom = y + gifSize;
    
    // Return false if there's overlap
    if (x < textRight && gifRight > textLeft && y < textBottom && gifBottom > textTop) {
        return false;
    }
    
    return true;
}

// Move GIF to random position avoiding the text
function moveGifToRandomPosition() {
    const maxX = window.innerWidth - GIF_CONFIG.size - 40;
    const maxY = window.innerHeight - GIF_CONFIG.size - 40;
    
    let randomX, randomY;
    let attempts = 0;
    const maxAttempts = 30;
    
    // Keep trying until we find a safe position
    do {
        randomX = 20 + Math.random() * maxX;
        randomY = 20 + Math.random() * maxY;
        attempts++;
    } while (!isPositionSafe(randomX, randomY, GIF_CONFIG.size) && attempts < maxAttempts);
    
    // If we couldn't find a safe spot after max attempts, just place it far from center
    if (attempts >= maxAttempts) {
        // Place in corners or edges randomly
        const corner = Math.floor(Math.random() * 4);
        switch(corner) {
            case 0: // top left
                randomX = 20;
                randomY = 20;
                break;
            case 1: // top right
                randomX = window.innerWidth - GIF_CONFIG.size - 40;
                randomY = 20;
                break;
            case 2: // bottom left
                randomX = 20;
                randomY = window.innerHeight - GIF_CONFIG.size - 40;
                break;
            case 3: // bottom right
                randomX = window.innerWidth - GIF_CONFIG.size - 40;
                randomY = window.innerHeight - GIF_CONFIG.size - 40;
                break;
        }
    }
    
    // Add bounce animation class
    jumpingGif.classList.add('jumping');
    setTimeout(() => jumpingGif.classList.remove('jumping'), 500);
    
    // Apply position with transform for smoother animation
    jumpingGif.style.left = `${randomX}px`;
    jumpingGif.style.top = `${randomY}px`;
    jumpingGif.style.width = `${GIF_CONFIG.size}px`;
    jumpingGif.style.height = `${GIF_CONFIG.size}px`;
    
    console.log(`GIF moved to: ${randomX}, ${randomY}`); // Debug log
}

// Start GIF jumping animation
function startGifJumping() {
    // Set GIF source
    jumpingGif.src = GIF_CONFIG.url;
    
    // Make visible and position initially
    jumpingGif.classList.add('visible');
    moveGifToRandomPosition();
    
    // Set up interval to keep jumping
    gifJumpInterval = setInterval(() => {
        moveGifToRandomPosition();
    }, GIF_CONFIG.jumpIntervalMs);
}

// Stop GIF jumping animation
function stopGifJumping() {
    if (gifJumpInterval) {
        clearInterval(gifJumpInterval);
        gifJumpInterval = null;
    }
    jumpingGif.classList.remove('visible');
}

// Move No button to random position
function moveNoButton() {
    const container = document.body;
    const btnRect = noBtn.getBoundingClientRect();
    
    // Calculate safe boundaries (keeping button fully visible)
    const maxX = window.innerWidth - btnRect.width - 20;
    const maxY = window.innerHeight - btnRect.height - 20;
    
    // Generate random position
    const randomX = Math.max(20, Math.random() * maxX);
    const randomY = Math.max(20, Math.random() * maxY);
    
    // Apply smooth transition
    noBtn.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    
    // Increment counter
    noBtnMoveCount++;
    
    // Grow Yes button
    yesButtonScale += 0.15;
    yesBtn.style.transform = `scale(${yesButtonScale})`;
    
    // Add extra emphasis after several attempts
    if (noBtnMoveCount > 5) {
        yesBtn.style.animation = 'pulse 0.5s ease-in-out, btnEntrance 0.6s ease-out';
    }
}

// Handle No button hover
noBtn.addEventListener('mouseenter', () => {
    moveNoButton();
});

// Handle No button click (in case they're quick!)
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Handle mobile touch
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

// Handle Yes button click - trigger celebration
yesBtn.addEventListener('click', () => {
    triggerCelebration();
});

// Celebration function
function triggerCelebration() {
    // Hide main container
    mainContainer.style.transition = 'opacity 0.5s ease-out';
    mainContainer.style.opacity = '0';
    
    // Show celebration screen
    setTimeout(() => {
        celebration.classList.remove('hidden');
        createFloatingHearts();
        
        // Start GIF jumping immediately
        setTimeout(() => {
            startGifJumping();
        }, 300);
        
        // Add confetti-like effect
        setTimeout(() => {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => createFloatingHearts(), i * 300);
            }
        }, 500);
    }, 500);
}

// Create floating hearts for celebration
function createFloatingHearts() {
    const heartSymbols = ['❤️', '💕', '💖', '💗', '💝', '💘', '💓', '💞'];
    const heartCount = 20;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        
        // Random horizontal position
        heart.style.left = `${Math.random() * 100}%`;
        
        // Start from bottom
        heart.style.bottom = '-50px';
        
        // Random animation delay
        heart.style.animationDelay = `${Math.random() * 2}s`;
        
        // Random size variation
        const size = 1.5 + Math.random() * 1.5;
        heart.style.fontSize = `${size}rem`;
        
        floatingHearts.appendChild(heart);
        
        // Remove heart after animation completes
        setTimeout(() => {
            heart.remove();
        }, 6000);
    }
}

// Initialize the page
window.addEventListener('DOMContentLoaded', () => {
    createBackgroundHearts();
    
    // Position No button initially in the button container
    noBtn.style.position = 'relative';
});

// Ensure No button stays visible on window resize
window.addEventListener('resize', () => {
    if (noBtn.style.position === 'fixed') {
        const btnRect = noBtn.getBoundingClientRect();
        const maxX = window.innerWidth - btnRect.width - 20;
        const maxY = window.innerHeight - btnRect.height - 20;
        
        let currentX = parseFloat(noBtn.style.left);
        let currentY = parseFloat(noBtn.style.top);
        
        // Adjust if out of bounds
        if (currentX > maxX) noBtn.style.left = `${maxX}px`;
        if (currentY > maxY) noBtn.style.top = `${maxY}px`;
    }
    
    // Reposition GIF if it's visible
    if (jumpingGif.classList.contains('visible')) {
        moveGifToRandomPosition();
    }
});

// Add keyboard support for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement === yesBtn) {
        triggerCelebration();
    }
});
