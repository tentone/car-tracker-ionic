
export class Settings {
    /**
     * Possible map display modes available in the app.
     */
    public static MAP_STYLES = {
        VECTOR: 'mapbox://styles/mapbox/streets-v11',
        LIGHT: 'mapbox://styles/mapbox/light-v9',
        DARK: 'mapbox://styles/mapbox/dark-v9',
        SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
        MIXED: 'mapbox://styles/mapbox/satellite-streets-v10'
    };

    /**
     * Map Style to be used when displaying maps.
     */
    public mapStyle: string = Settings.MAP_STYLES.VECTOR;

    /**
     * SMS hash generated using the SMS retriever, generated only once.
     */
    public smsHash: string = '';
}

