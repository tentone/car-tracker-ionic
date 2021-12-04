/**
 * Represents a position in the world map.
 */
export class Geolocation {
    /**
     * Latitude in degrees relative to the meridian.
     */
    public latitude: number;

    /**
     * Longitude in degrees relative to the meridian.
     */
    public longitude: number;

    /**
     * Altitude in meter relative to the sea level..
     */
    public altitude: number;

    public accuracy: number = null;

    public speed: number = null;

    public constructor(latitude?: number, longitude?: number, altitude?: number) {
        this.latitude = latitude !== undefined ? latitude : 0;
        this.longitude = longitude !== undefined ? longitude : 0;
        this.altitude = altitude !== undefined ? altitude : 0;
    }
}
