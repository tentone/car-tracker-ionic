import {AfterContentChecked, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {App} from '../../app';
import * as mapboxgl from 'mapbox-gl';
import {GPSPosition} from '../../data/gps-position';

@Component({
	selector: 'gps-map',
	templateUrl: './gps-map.component.html'
})
export class GpsMapComponent implements OnInit, AfterContentChecked {
	@ViewChild('mapContainer', {static: true}) mapContainer: ElementRef;

	@Input() position: GPSPosition = new GPSPosition();

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

	/**
	 * Indicates if the component is visible or not.
	 *
	 * Used to keep track of the component state and refresh the size of the map
	 */
	public visible: boolean = false;

	public ngAfterContentChecked() {
		if (!this.visible && this.mapContainer.nativeElement.offsetParent !== null) {
			this.visible = true;
			this.map.resize();
		} else if (this.visible && this.mapContainer.nativeElement.offsetParent === null) {
			this.visible = false;
		}
	}

	public ngOnInit(): void {
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

		this.map.setStyle(App.settings.mapStyle);
		setTimeout(() => {
			this.map.resize();
		}, 100);
	}

	/**
	 * Update map position.
	 */
	public updatePosition() {
		this.map.flyTo({center: [this.position.longitude, this.position.latitude]});
		this.marker.setLngLat([this.position.longitude, this.position.latitude]);
	}
}
