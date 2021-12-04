/**
 * Handle integration with theming from the operative system.
 */
export class ThemeOS {
	/**
	 * Light operative system theme.
	 */
	public static LIGHT: string = 'light';

	/**
	 * Dark operative system theme.
	 */
	public static DARK: string = 'dark';

	/**
	 * Get preferred theme based on the Operative System configurations.
	 */
	public static preferredTheme(): string {
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? ThemeOS.DARK : ThemeOS.LIGHT;
	}

	/**
	 * Create a handler to detect changes in the Operative System theme and match the application accordingly.
	 */
	public static watchChanges(handler: (theme: string)=> void): void {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			const theme: string = e.matches ? ThemeOS.DARK : ThemeOS.LIGHT;
			handler(theme);
		});
	}
}
