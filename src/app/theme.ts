class Theme {
    public id: string;
    public label: string;
    public class: string;
}

/**
 * Static containing information about the themes available in the application.
 */
export class Themes {
    /**
     * List of available themes
     */
    static themes: Theme[] = [
        {
            id: 'base',
            label: 'base',
            class: ''
        },
        {
            id: 'dark',
            label: 'dark',
            class: 'dark'
        }
    ];

    /**
     * Currently applied theme.
     */
    public static theme: Theme = null;

    /**
     * Set the theme to be used in the application, iterates over the list of themes, disable all class lists and enables the one being set.
     *
     * @param theme Id of the theme being activated
     */
    public static setTheme(theme: string) {
        for (let i = 0; i < this.themes.length; i++) {
            if (this.themes[i].class.length > 0) {
                document.body.classList.toggle(this.themes[i].class, theme === this.themes[i].id);
            }

            if (theme === this.themes[i].id) {
                this.theme = this.themes[i];
            }
        }
    }
}
