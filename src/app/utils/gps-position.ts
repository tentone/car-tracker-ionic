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

    /**
     * Check if a value if valid and can be used as a position.
     *
     * @param value Value to check
     */
    public static validValue(value) {
        return value !== undefined && value !== null && value.longitude !== undefined && value.latitude !== undefined;
    }

}
