import {ActivatedRoute} from '@angular/router';
import {Component, ElementRef} from '@angular/core';

/**
 * Screen component should be used as a base for all components that have a route associated.
 *
 * It provides additional control over the screen lifecycle.
 */
@Component({
    template: '',
    selector: 'screen'
})
export class ScreenComponent {
    constructor(public route: ActivatedRoute, public elementRef: ElementRef) {
        this.route.params.subscribe(() => {
            this.onEnter();
        });
    }

    /**
     * On enter method is executed when the route is opened.
     */
    public onEnter() {}
}
