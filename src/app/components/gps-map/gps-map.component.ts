import {AfterContentChecked, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {App} from '../../app';
import * as mapboxgl from 'mapbox-gl';
import {Geolocation} from '../../data/geolocation';

@Component({
	selector: 'gps-map',
	templateUrl: './gps-map.component.html'
})
export class GpsMapComponent implements OnInit, AfterContentChecked, OnChanges {
	@ViewChild('mapContainer', {static: true}) mapContainer: ElementRef;

	@Input() position: Geolocation = null;

	/**
	 * Mapbox gl instance to display and control the map view.
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

		this.map.setStyle(App.settings.mapStyle);

		setTimeout(() => {
			this.map.resize();
		}, 100);

		if(this.position !== null) {
			this.updatePosition();
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.updatePosition();
	}

	/**
	 * Update map position from the position attribute.
	 */
	public updatePosition() {
		if (this.map === null || this.position === null) {
			return;
		}

		if(this.marker === null) {
			this.marker = new mapboxgl.Marker();
			this.marker.setLngLat([this.position.longitude, this.position.latitude]);
			this.marker.addTo(this.map);
		}

		this.map.flyTo({center: [this.position.longitude, this.position.latitude]});
		this.marker.setLngLat([this.position.longitude, this.position.latitude]);
	}
}
