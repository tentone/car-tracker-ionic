import {Component, ElementRef, ViewChild} from '@angular/core';
import {GPSPosition} from '../../../data/gps-position';
import * as mapboxgl from 'mapbox-gl';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {App} from '../../../app';
import {ActivatedRoute} from '@angular/router';
import {ScreenComponent} from '../../screen';
import {Locale} from '../../../locale/locale';
import {Modal} from '../../modal';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html'
})
export class MapPage extends ScreenComponent {
  @ViewChild('mapContainer', {static: true}) mapContainer: ElementRef;

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
   * Position of the GPS tracker registered in the app.
   */
  public trackers: mapboxgl.Marker[] = [];

  constructor(public androidPermissions: AndroidPermissions, public geolocation: Geolocation, public route: ActivatedRoute, public elementRef: ElementRef) {
    super(route, elementRef);
  }

  public onDisplay() {
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

      this.enable3DBuildings();
    }

    this.map.setStyle(App.settings.mapStyle);
    this.getCurrentPosition();

    setTimeout(() => {
      this.map.resize();
    }, 100);
  }

  /**
   * Update main marker position and center the map on it.
   */
  public setMarker(longitude: number, latitude: number, flyTo: boolean = true) {
    this.marker.setLngLat([longitude, latitude]);

    if (flyTo) {
      setTimeout(() => {
        this.map.flyTo({center: [longitude, latitude]});
      }, 100);
    }
  }

  /**
   * Get position from GPS or browser location API.
   */
  public getCurrentPosition() {
    if (window.cordova) {
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(() => {
        // Get the current position
        this.geolocation.getCurrentPosition().then((data) => {
          this.setMarker(data.coords.longitude, data.coords.latitude);
        }).catch((error) => {
          Modal.alert(Locale.get('error'), Locale.get('errorLocation') + ' (' + error + ')');
          console.warn('CarTracker: Error getting location.', error);
        });

        // Watch for changes in the GPS position
        let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
          this.setMarker(data.coords.longitude, data.coords.latitude, false);
        });
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        this.setMarker(position.coords.longitude, position.coords.latitude);
      });
    }
  }

  /**
   * Use to enable a 3D extruded building layer.
   */
  public enable3DBuildings() {
    this.map.on('load', () => {
      let layers = this.map.getStyle().layers;

      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      this.map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate', ['linear'], ['zoom'],
            15, 0,
            15.05, ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate', ['linear'], ['zoom'],
            15, 0,
            15.05, ['get', 'min_height']
          ],
          'fill-extrusion-opacity': .6
        }
      }, labelLayerId);
    });
  }
}
