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

/**
 * Possible map display modes available in the app.
 */
export const MapStyles = {
    VECTOR: 'mapbox://styles/mapbox/streets-v11',
    LIGHT: 'mapbox://styles/mapbox/light-v9',
    DARK: 'mapbox://styles/mapbox/dark-v9',
    SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
    MIXED: 'mapbox://styles/mapbox/satellite-streets-v10'
};
