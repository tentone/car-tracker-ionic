import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {App} from '../../app';
import * as mapboxgl from 'mapbox-gl';

@Component({
	selector: 'gps-map',
	templateUrl: './gps-map.component.html'
})
export class GpsMapComponent implements OnInit {
	@ViewChild('mapContainer', {static: true}) mapContainer: ElementRef;

	@Input() position: any;

	/**
	 * Mapboxgl instance to display and control the map view.
	 */
	public map: mapboxgl.Map = null;

	/**
	 * Used to navigate the map using the mouse or touch controls.
	 */
	public controls: mapboxgl.Control = null;

	/**
	 * Marker with the user GPS position.
	 */
	public marker: mapboxgl.Marker = null;

	public ngOnInit(): void {
		if (this.map === null) {
			this.map = new mapboxgl.Map({
				container: this.mapContainer.nativeElement,
				style: App.settings.mapStyle,
				zoom: 13,
				center: [0, 0]
			});

			this.controls = new mapboxgl.NavigationControl();
			this.map.addControl(this.controls);

			this.marker = new mapboxgl.Marker();
			this.marker.setLngLat([0, 0]);
			this.marker.addTo(this.map);
		}

		this.map.setStyle(App.settings.mapStyle);
		setTimeout(() => {
			this.map.resize();
		}, 100);
	}
}
