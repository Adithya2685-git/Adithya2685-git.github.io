/**
 * Theme switching functionality for dark/light mode
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create and append the theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark/light mode');
    themeToggle.innerHTML = '☀️'; // Default icon for light mode
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply saved theme or detect system preference
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Check if user prefers dark mode
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDarkMode ? 'dark' : 'light');
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    /**
     * Apply theme to the document
     * @param {string} theme - 'light' or 'dark'
     */
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '🌙'; // Moon icon for dark mode
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.innerHTML = '☀️'; // Sun icon for light mode
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        // Only apply if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // Add this event to the tracker if tracking is enabled
    if (typeof logEvent === 'function') {
        themeToggle.addEventListener('click', function() {
            const newTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            logEvent('click', 'theme toggle', `Switched to ${newTheme} mode`);
        });
    }
});
