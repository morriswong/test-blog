// Theme toggle functionality for button-based toggle
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const html = document.documentElement;
            const currentTheme = html.classList.contains('dark-mode-on') ? 'dark' :
                               html.classList.contains('dark-mode-off') ? 'light' :
                               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

            if (currentTheme === 'dark') {
                html.classList.remove('dark-mode-on');
                html.classList.add('dark-mode-off');
                localStorage.setItem('theme', 'light');
            } else {
                html.classList.remove('dark-mode-off');
                html.classList.add('dark-mode-on');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});
