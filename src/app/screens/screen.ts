import {ActivatedRoute} from '@angular/router';
import {AfterContentChecked, Component, ElementRef, Pipe, PipeTransform} from '@angular/core';
import {StringUtils} from '../utils/string-utils';
import {Locale} from '../locale/locale';

/**
 * Structure used to filter data on a search pipe.
 */
export class SearchFilter {
    public search: string = '';
    public attributes: string[] = [];
}

/**
 * Pipe to filter data from its attributes.
 */
@Pipe({name: 'searchFilter'})
export class SearchFilterPipe implements PipeTransform {
    public transform(array: any[], options: SearchFilter): any[] {
        if (options.attributes.length === 0) {
            options.attributes = ['name', 'tag'];
        }

        if (options.search.length === 0) {
            return array;
        }

        return array.filter(function(value) {
            return StringUtils.searchObject(options.search, value, options.attributes);
        });
    }
}

/**
 * Pipe to format date and show it as a locale representation based on the system configuration.
 */
@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {
    public transform(d: string | Date): string {
        if (d === null || d === undefined) {
            return Locale.get('invalidDate');
        }
        if (typeof d === 'string') {
            d = new Date(d);
        }

        return d.toLocaleString();
    }
}

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
            this.onDisplay();
        });
    }

    public ngAfterContentChecked() {
        if (!this.visible && this.elementRef.nativeElement.offsetParent !== null) {
            this.visible = true;
            this.onDisplay();

        } else if (this.visible && this.elementRef.nativeElement.offsetParent === null) {
            this.visible = false;

        }
    }

    /**
     * On display method is executed when the route is entered.
     */
    public onDisplay() {}
}
