/**
 * Possible map display modes available in the app.
 */
export const MapStyles: any = {
	VECTOR: 'mapbox://styles/mapbox/streets-v11',
	LIGHT: 'mapbox://styles/mapbox/light-v9',
	DARK: 'mapbox://styles/mapbox/dark-v9',
	SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
	MIXED: 'mapbox://styles/mapbox/satellite-streets-v10'
};

export const MapStylesLabel: Map<string, string> = new Map([
	[MapStyles.VECTOR, 'vector'],
	[MapStyles.SATELLITE, 'satellite'],
	[MapStyles.MIXED, 'mixed'],
	[MapStyles.LIGHT, 'light'],
	[MapStyles.DARK, 'dark']
]);
