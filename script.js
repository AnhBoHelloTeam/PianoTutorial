// Common JavaScript for all pages

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const applyTheme = (theme) => {
        document.documentElement.classList.toggle('theme-dark', theme === 'dark');
        if (themeToggle) themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };
    const savedTheme = localStorage.getItem('pv-theme') || 'light';
    applyTheme(savedTheme);
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = (localStorage.getItem('pv-theme') || 'light') === 'light' ? 'dark' : 'light';
            localStorage.setItem('pv-theme', next);
            applyTheme(next);
        });
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
function showLoading(element) {
    if (element) {
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';
        element.disabled = true;
    }
}

function hideLoading(element, originalText) {
    if (element) {
        element.innerHTML = originalText;
        element.disabled = false;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 90px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 300px;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                border-left: 4px solid #4caf50;
            }
            .notification-error {
                border-left: 4px solid #f44336;
            }
            .notification-info {
                border-left: 4px solid #2196f3;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #333;
                font-weight: 500;
            }
            .notification-content i {
                font-size: 1.2rem;
            }
            .notification-success .notification-content i {
                color: #4caf50;
            }
            .notification-error .notification-content i {
                color: #f44336;
            }
            .notification-info .notification-content i {
                color: #2196f3;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility function to play note
function playNote(note) {
    const audio = document.querySelector(`audio[data-note="${note}"]`);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => {
            console.log('Audio play failed:', e);
        });
    }
}

// Utility function to highlight key
function highlightKey(note) {
    const key = document.querySelector(`.key[data-note="${note}"]`);
    if (key) {
        key.classList.add('active');
        setTimeout(() => {
            key.classList.remove('active');
        }, 200);
    }
}

// Utility function to play note with visual feedback
function playNoteWithVisual(note) {
    playNote(note);
    highlightKey(note);
    try {
        const ev = new CustomEvent('user-played-note', { detail: { note } });
        window.dispatchEvent(ev);
    } catch (e) { /* no-op */ }
}

// Format time in MM:SS format
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if device is mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Add keyboard event listeners for piano keys
function addKeyboardListeners() {
    const keyMap = {
        'a': 'C4', 's': 'D4', 'd': 'E4', 'f': 'F4', 'g': 'G4', 'h': 'A4', 'j': 'B4', 'k': 'C5', 'l': 'D5',
        'w': 'C#4', 'e': 'D#4', 't': 'F#4', 'y': 'G#4', 'u': 'A#4', 'o': 'C#5', 'p': 'D#5'
    };

    document.addEventListener('keydown', function(e) {
        const note = keyMap[e.key.toLowerCase()];
        if (note) {
            e.preventDefault();
            playNoteWithVisual(note);
        }
    });
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard listeners if on piano page
    if (document.querySelector('.piano-page') || document.querySelector('.songs-page') || document.querySelector('.analyzer-page')) {
        addKeyboardListeners();
    }
    
    // Add click listeners to piano keys
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', function() {
            const note = this.getAttribute('data-note');
            if (note) {
                playNoteWithVisual(note);
            }
        });
    });
});

// Export functions for use in other scripts
window.PianoUtils = {
    playNote,
    highlightKey,
    playNoteWithVisual,
    formatTime,
    showNotification,
    showLoading,
    hideLoading,
    debounce,
    throttle,
    isMobile
};