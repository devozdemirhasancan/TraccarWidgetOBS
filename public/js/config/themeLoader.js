class ThemeLoader {
    constructor() {
        this.currentTheme = 'default';
        this.themes = ['default', 'dark', 'light'];
    }

    async loadTheme(themeName) {
        if (!this.themes.includes(themeName)) {
            console.error(`Theme ${themeName} not found, falling back to default`);
            themeName = 'default';
        }

        // Remove any existing theme
        const existingTheme = document.getElementById('theme-style');
        if (existingTheme) {
            existingTheme.remove();
        }

        // Create and append new theme
        const link = document.createElement('link');
        link.id = 'theme-style';
        link.rel = 'stylesheet';
        link.href = `/css/themes/${themeName}.css`;
        document.head.appendChild(link);
        
        this.currentTheme = themeName;
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

export default new ThemeLoader(); 