import {Theme} from './theme';

/**
 * Handle integration with theming from the operative system.
 */
export class ThemeUtils {
	/**
	 * Get preferred theme based on the Operative System configurations.
	 */
	public static preferredTheme(): string {
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
	}

	/**
	 * Create a handler to detect changes in the Operative System theme and match the application accordingly.
	 */
	public static watchChanges(handler: (theme: string)=> void): void {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			const theme: string = e.matches ? Theme.DARK : Theme.LIGHT;
			handler(theme);
		});
	}
}
