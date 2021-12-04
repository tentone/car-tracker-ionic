import {MapStyles} from './theme/map-styles';

/**
 * Stores the application global settings for booth appearance and functionality.
 */
export class Settings {
    /**
     * Locale language to be used in the application.
     */
    public locale: string = 'en';

    /**
     * Map Style to be used when displaying maps.
     */
    public mapStyle: string = MapStyles.VECTOR;

    /**
     * Admin number to be set for GPS tracker to report data to.
     */
    public adminNumber: string = '';

    /**
     * ID of the app theme to be used in the GUI.
     */
    public theme: string = 'base';
}
