import {NavigationStart, Router} from '@angular/router';
import {Environment} from '../environments/environment';
import {UrlUtils} from './utils/url-utils';
import {AppRoutes} from './app.router.module';

/**
 * The navigator object is used to navigate the AppRoutes of the application.
 *
 * It encapsulates a single navigator object created from the main root of the app.
 *
 * Also allows navigation to be done in a stack fashion and send data between pages.
 */
export class Navigation {
	/**
	 * Angular navigator object.
	 */
	public router: Router;

	/**
	 * The current application route loaded.
	 */
	public route: NavigationNode[];

	constructor(router: Router) {
		this.router = router;
		this.route = [];

		this.router.events.subscribe((val) => {
			if (val instanceof NavigationStart) {
				if (val.navigationTrigger === 'popstate') {
					const url = val.url;
					// Back one step
					if (this.route.length > 1 && this.route[this.route.length - 2].route === url) {
						this.route.pop();
					// Reset stack
					} else {
						this.route = [new NavigationNode(url)];
					}
				}
			}
		});
	}

	public update() {
		if (this.route.length > 0) {
			this.router.navigate([this.route[this.route.length - 1].route]);
		}
	}

	/**
	 * Navigate to another screen.
	 *
	 * @param route Name of the route path.
	 * @param data Data to be sent to that path.
	 * @param title Title of the screen (can also be set on the screen code via the setTitle() method).
	 */
	public navigate(route: string, data?: any, title?: string) {
		if (!Environment.production) {
			// Search routes recursively, check if some have the route specified
			// @ts-ignore
			function searchRoute(routes: any, current: string): boolean {
				for (let k = 0; k < routes.length; k++) {
					let path = current.length === 0 ? routes[k].path : (current + '/' + routes[k].path);
					if (path === route) {
						return true;
					}

					if (routes[k].children !== undefined) {
						if (searchRoute(routes[k].children, path)) {
							return true;
						}
					}
				}

				return false;
			}

			// Check if the route exists in the router (only in dev).
			if (!searchRoute(AppRoutes, '')) {
				console.warn('Route is possibly unknown ' + route + '.');
			}
		}

		if (this.route.length === 0) {
			this.checkRoute();
		}

		if (this.route.length > 0) {
			let node = this.route[this.route.length - 1];
			if (route === node.route) {
				if (!Environment.production) {
					console.log('Already on the route ' + route + '.');
				}
				return;
			}
		}

		if (!Environment.production) {
			console.log('Navigated to ' + route + '.', data, title);
		}

		this.route.push(new NavigationNode(route, data, title));
		this.update();
	}

	/**
	 * Return back one screen, try to get the last route from the stack.
	 *
	 * If no route available on the stack, remove the last part of the URL (if possible).
	 */
	public pop() {
		if (this.route.length === 0) {
			this.checkRoute();
		}

		if (this.route.length > 1) {
			this.route.pop();
			this.update();
		} else if (this.route.length === 1) {
			const url = this.route[this.route.length - 1].route;
			const path = url.split('/');

			if (path.length > 1) {
				path.pop();
				this.route = [new NavigationNode(path.join('/'))];
				this.update();
			} else {
				if (!Environment.production) {
					console.log('Cannot navigate back.');
				}
			}
		} else {
			if (!Environment.production) {
				console.log('Cannot navigate back.');
			}
		}
	}

	/**
	 * Read the route from the URl of the browser and return it as array of subdirectories.
	 */
	public readRoute(): string[] {
		// Read URL from window
		const url = window.location.href;
		const pathname = new URL(url).pathname;
		const path: string[] = pathname.split('/');

		// Remove query URL data
		if (path.length !== 0) {
			const last = path[path.length - 1];
			const index = last.indexOf('?');
			if (index !== -1) {
				path[path.length - 1] = last.substring(0, index);
			}
		}

		return path;
	}

	/**
	 * Compare it against the current URL on the stack and override if necessary.
	 */
	public checkRoute() {
		let route = this.readRoute().join('/');

		// Check if route is correct
		if (this.route.length > 0) {
			let node = this.route[this.route.length - 1];
			if (route !== node.route) {
				this.route = [new NavigationNode(route)];
			}
		} else {
			this.route = [new NavigationNode(route)];
		}
	}

	/**
	 * Check if the navigator has a name in the middle of its route.
	 *
	 * @param name Name to look for.
	 * @return True if the name is in the route.
	 */
	public has(name: string): boolean {
		if (this.route.length > 0) {
			let route = this.route[this.route.length - 1].route;
			return route.indexOf(name) !== -1;
		}

		return false;
	}

	/**
	 * Get the data for the current screen, data is passed alongside the route.
	 *
	 * If no route data is available it checks for URL query data.
	 */
	public getData(): any {
		let data = null;

		if (this.route.length > 0) {
			data = this.route[this.route.length - 1].data;
		}

		if (data === undefined || data === null) {
			data = UrlUtils.getQueryParameters();
			if (Object.keys(data).length === 0) {
				data = null;
			}
		}

		return data;
	}

	/**
	 * Set the data for the current screen.
	 */
	public setData(data: any) {
		if (this.route.length === 0) {
			return;
		}

		this.route[this.route.length - 1].data = data;
	}

	/**
	 * Get the title of the current screen.
	 */
	public getTitle(): string {
		if (this.route.length === 0) {
			return null;
		}

		const title = this.route[this.route.length - 1].title;
		if (title === undefined) {
			return null;
		}

		return title;
	}

	/**
	 * Set the title of the current screen.
	 */
	public setTitle(title: string) {
		if (this.route.length === 0 || title === null) {
			return;
		}

		this.route[this.route.length - 1].title = title;
	}
}

/**
 * Navigation node stores a step in the navigation path alongside its data.
 */
class NavigationNode {
	/**
	 * Full route of the navigation step.
	 */
	public route: string;

	/**
	 * Data attached to the navigation node (optional).
	 */
	public data: any;

	/**
	 * Title of the screen set on navigation (optional).
	 */
	public title: string;

	constructor(route: string, data?: any, title?: string) {
		this.route = route;
		this.data = data !== undefined ? data : null;
		this.title = title !== undefined ? title : null;
	}
}
