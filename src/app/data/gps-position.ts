/**
 * Represents a GPS position in the world map.
 */
export class GPSPosition {
    public latitude: number;
    public longitude: number;

    constructor(latitude?, longitude?) {
        this.latitude = latitude !== undefined ? latitude : 0;
        this.longitude = longitude !== undefined ? longitude : 0;
    }
}
