import {Component, ElementRef, ViewChild} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {App} from '../../app';
import {GpsIo} from '../../io/gps-io';

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html'
})
export class MapPage {
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
      this.enable3DBuildings();
    }

    this.map.setStyle(App.settings.mapStyle);

    GpsIo.getPosition((longitude, latitude) => {
      this.setMarker(longitude, latitude);
    });

    setTimeout(() => {
      this.map.resize();
    }, 100);
  }

  /**
   * Update main marker position and center the map on it.
   */
  public setMarker(longitude: number, latitude: number, flyTo: boolean = true) {
    if(this.marker === null) {
      this.marker = new mapboxgl.Marker();
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
