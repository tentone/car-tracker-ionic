import {Pipe, PipeTransform} from '@angular/core';
import {StringUtils} from '../utils/string-utils';
import {Locale} from '../locale/locale';

/**
 * Structure used to filter data on a search pipe.
 */
export class SearchFilter {
    /**
     * Search text inserted by the user.
     */
    public search: string = '';

    /**
     * Attributes to search in the object.
     */
    public attributes: string[] = [];
}

/**
 * Pipe to filter data from its attributes.
 */
@Pipe({name: 'searchFilter'})
export class SearchFilterPipe implements PipeTransform {
    public transform(array: any[], options: SearchFilter): any[] {
        if (options.search.length === 0 || options.attributes.length === 0) {
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

        const date = new Date(d);
        return date.toLocaleString();
    }
}
