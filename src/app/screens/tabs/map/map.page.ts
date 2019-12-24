import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GPSPosition} from '../../../data/gps-position';
import * as mapboxgl from 'mapbox-gl';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {App} from '../../../app';
import {ActivatedRoute} from '@angular/router';
import {ScreenComponent} from '../../screen';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html'
})
export class MapPage extends ScreenComponent implements OnInit {
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

  public display() {
    if (this.map !== null) {
      this.map.setStyle(App.settings.mapStyle);
      this.map.resize();
    }
  }

  public ngOnInit() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: App.settings.mapStyle,
      zoom: 13,
      center: [0, 0]
    });

    this.controls = new mapboxgl.NavigationControl();
    this.map.addControl(this.controls);

    this.marker = null;

    this.getGPSPosition();
    this.enable3DBuildings();
  }

  /**
   * Update main marker position and center the map on it.
   */
  public setMarker(longitude: number, latitude: number, flyTo: boolean = true) {
    if (this.marker === null) {
      this.marker = new mapboxgl.Marker();
      this.marker.addTo(this.map);
    }

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
  public getGPSPosition() {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(() => {
      // Get the current position
      this.geolocation.getCurrentPosition().then((data) => {
        console.log('Position received', data);
        this.setMarker(data.coords.latitude, data.coords.longitude);
      }).catch((error) => {
        // TODO <CHANGE THIS>
        alert('Error getting location.' + error);
      });

      // Watch for changes in the GPS position
      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        console.log('Position updated', data);
        this.setMarker(data.coords.latitude, data.coords.longitude, false);
      });
    });
  }

  /**
   * Create and draw trackers to represent all the assets retrieved from the API.
   */
  public drawMarkers() {
    for (let i = 0; i < this.trackers.length; i++) {
      this.trackers[i].remove();
    }

    this.trackers = [];

    // TODO <TEST CODE>
    this.trackers.push(this.createMarker(new GPSPosition(0, 0), ''));
  }

  /**
   * Create an marker representing an asset in the world map.
   *
   * @param position GPS position of the map.
   * @param text Text to be shown.
   */
  public createMarker(position: GPSPosition, text: string): mapboxgl.Marker {
    // create a DOM element for the marker
    const element = document.createElement('div');
    element.className = 'marker';
    element.style.width = '40px';
    element.style.height = '40px';

    const icon = document.createElement('img');
    element.appendChild(icon);

    // create the popup
    const popup = new mapboxgl.Popup({
      offset: 20,
      closeButton: false,
      closeOnClick: false
    });
    popup.setText(text);

    // @ts-ignore
    element.asset = asset;
    element.addEventListener('click', function() {
      // @ts-ignore
      // TODO <ON CLICK>
    });

    // @ts-ignore
    element.popup = popup;
    // @ts-ignore
    element.map = this.map;
    element.addEventListener('mouseenter', function() {
      // @ts-ignore
      this.popup.addTo(this.map);
    });
    element.addEventListener('mouseleave', function() {
      // @ts-ignore
      this.popup.remove();
    });

    let marker = new mapboxgl.Marker(element);
    marker.setLngLat([position.longitude, position.latitude]);
    marker.setPopup(popup);
    marker.addTo(this.map);

    return marker;
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
