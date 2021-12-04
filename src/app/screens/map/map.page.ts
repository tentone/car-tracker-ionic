import {AfterContentChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {App} from '../../app';
import {GeolocationIo} from '../../io/geolocation-io';
import { Tracker } from 'src/app/data/tracker/tracker';
import {Environment} from '../../../environments/environment';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import {Control, Map, Marker, NavigationControl} from 'mapbox-gl';
import {MapboxStyleDefinition, MapboxStyleSwitcherControl} from 'mapbox-gl-style-switcher';
import {Locale} from '../../locale/locale';
import {MapStylesLabel} from '../../theme/map-styles';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html'
})
export class MapPage implements OnInit, AfterContentChecked, AfterViewInit {
  @ViewChild('mapContainer', {static: true}) mapContainer: ElementRef;

  /**
   * Mapboxgl instance to display and control the map view.
   */
  public map: Map = null;

  /**
   * Used to navigate the map using the mouse or touch controls.
   */
  public controls: Control = null;

  /**
   * Marker with the user GPS position.
   */
  public marker: Marker = null;

  /**
   * Position of the GPS tracker registered in the app.
   */
  public markers: Marker[] = [];

  /**
   * List of trackers to display.
   */
  public trackers: Tracker[] = [];

  /**
   * Indicates if the component is visible.
   */
  public visible = false;

  public ngOnInit(): void {
    this.trackers = App.trackers;

    if (this.map === null) {
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: App.settings.mapStyle,
        zoom: 13,
        center: [0, 0]
      });

      this.controls = new NavigationControl();
      this.map.addControl(this.controls);
    }

    this.map.setStyle(App.settings.mapStyle);

    // Map search box
    this.map.addControl(new MapboxGeocoder({
      accessToken: Environment.mapbox,
      mapboxgl: this.map
    }), 'bottom-left');

    const styles: MapboxStyleDefinition[] = [];
    MapStylesLabel.forEach(function(value, key) {
      styles.push({
        title: Locale.get(MapStylesLabel.get(key)),
        uri: key
      });
    });
    this.map.addControl(new MapboxStyleSwitcherControl(styles), 'top-right');
    this.map.addControl(new NavigationControl(), 'top-right');

    GeolocationIo.getPosition().then((position: any) => {
      this.setMarker(position.coords.longitude, position.coords.latitude);
    });
  }

  public ngAfterViewInit() {
    if (this.map !== null) {
      setTimeout(() => {this.map.resize()}, 300);
    }
  }

  /**
   * Update main marker position and center the map on it.
   */
  public setMarker(longitude: number, latitude: number, flyTo: boolean = true) {
    if(this.marker === null) {
      this.marker = new Marker();
      this.marker.setLngLat([longitude, latitude]);
      this.marker.addTo(this.map);
    }

    this.marker.setLngLat([longitude, latitude]);

    if (flyTo) {
      setTimeout(() => {
        this.map.flyTo({center: [longitude, latitude]});
      }, 100);
    }
  }

  public ngAfterContentChecked(): void {
    if (this.map && this.map.resize && !this.visible && this.mapContainer.nativeElement.offsetParent !== null) {
      this.visible = true;
      this.map.resize();
    } else if (this.visible && !this.mapContainer.nativeElement.offsetParent) {
      this.visible = false;
    }
  }
}
