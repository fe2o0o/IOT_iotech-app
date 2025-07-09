import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { SharedService } from '../../../shared/services/shared.service';
import { MapService } from '../../../core/services/map.service';
import { MapInfoWindow, MapAdvancedMarker } from '@angular/google-maps';
@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  constructor(private _SharedService:SharedService , private _MapService:MapService) {
    this._SharedService.breadCrumbTitle.next('SIDEBAR.MAP');
  }
  center: google.maps.LatLngLiteral = { lat: 23.885942, lng: 45.079162 };
  zoom = 1;
  map!: google.maps.Map;
  options: google.maps.MapOptions = {
    mapId: "115e41338d1465ab",
    center: this.center,
    maxZoom: 100,
    minZoom: 1,
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


  ngOnInit(): void {
      this.getAllDevicesLoc()
  }

  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  onMapInitialized(map: google.maps.Map) {
    this.map = map;
    this.map.setOptions(this.options)
  }


  selectedLocation:any
    openInfoWindow(marker: MapAdvancedMarker, location: any) {
    this.selectedLocation = location;
    this.infoWindow.open(marker);
  }

  locations = signal<any[]>([])
  getAllDevicesLoc() {
    this._MapService.getAllLocations().subscribe((res: any) => {
      this.locations.set(res?.data?.map((loc:any) => {
        const markerElement = document.createElement('img');
        markerElement.src = loc.icon;
        markerElement.style.width = '40px';
        markerElement.style.height = '40px';
        return {
          ...loc,
          content:markerElement
        }
      }))


    })
  }

}
