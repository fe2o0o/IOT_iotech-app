import { Component } from '@angular/core';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  center: google.maps.LatLngLiteral = { lat: 23.885942, lng: 45.079162 };
  zoom = 1;
  map!: google.maps.Map;
  options: google.maps.MapOptions = {
    mapId: "115e41338d1465ab",
    center: this.center,
    maxZoom: 100,
    minZoom: 3,
    restriction: {
      latLngBounds: {
        north: 32.14,
        south: 16.38,
        east: 55.67,
        west: 34.57
      },
      strictBounds: true
    },
    zoom: this.zoom,
  };
}
