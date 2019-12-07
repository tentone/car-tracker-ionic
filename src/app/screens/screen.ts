import {ActivatedRoute} from '@angular/router';
import {AfterContentChecked, Component, ElementRef} from '@angular/core';

/**
 * Screen component should be used as a base for all components that have a route associated.
 *
 * It provides additional control over the screen lifecycle.
 */
@Component({
    template: '',
    selector: 'screen'
})
export class ScreenComponent implements AfterContentChecked {
    /**
     * Indicates if the component is visible or not.
     *
     * Used to keep track of the component state.
     */
    public visible: boolean = false;

    constructor(public route: ActivatedRoute, public elementRef: ElementRef) {
        this.route.params.subscribe(() => {
            this.display();
        });
    }

    public ngAfterContentChecked() {
        if (!this.visible && this.elementRef.nativeElement.offsetParent !== null) {
            this.visible = true;
            this.display();

        } else if (this.visible && this.elementRef.nativeElement.offsetParent === null) {
            this.visible = false;

        }
    }

    /**
     * On display method is executed when the route is entered.
     */
    public display() {}
}
