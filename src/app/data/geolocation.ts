/**
 * Represents a GPS position in the world map.
 */
export class Geolocation {
    /**
     * Latitude value of the position.
     */
    public latitude: number;

    /**
     * Longitude value of the position.
     */
    public longitude: number;

    public constructor(latitude?: number, longitude?: number) {
        this.latitude = latitude !== undefined ? latitude : 0;
        this.longitude = longitude !== undefined ? longitude : 0;
    }
}
