import { Component } from '@angular/core';
import { Platform } from "@ionic/angular";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng, MarkerOptions, Marker } from "@ionic-native/google-maps";

declare var google: any;

@Component({
  selector: 'app-polygon-drawer',
  templateUrl: './polygon-drawer.page.html',
  styleUrls: ['./polygon-drawer.page.scss'],
})
export class PolygonDrawerPage {

  constructor(public platform: Platform) { }

  mapOptions = {
		center: new google.maps.LatLng(40.23339451516098,-75.13820867530005),
		zoom: 18,
	}

	ionViewDidEnter() {
		this.platform.ready().then(() => {
			var map = new google.maps.Map(document.getElementById('map'), this.mapOptions);
			var map;
			var all_overlays = [];
			var selectedShape;
			var finalData = []
			var result_array = [];
			
			var drawingManager = new google.maps.drawing.DrawingManager({
				drawingMode: google.maps.drawing.OverlayType.POLYGON,
				drawingControl: true,
				drawingControlOptions: {
				  position: google.maps.ControlPosition.LEFT,
				  drawingModes: ['polygon', 'rectangle']
				},
				polygonOptions: {
				  strokeWeight: 5,
				  clickable: true,
				  zIndex: 1
				}
			});
			drawingManager.setMap(map);
			
			var  reset  =  document.getElementById("resetPolygon")
			reset.addEventListener('click',()=>{
				if (selectedShape) {
				  selectedShape.setMap(null);
				  all_overlays.splice(all_overlays.indexOf(selectedShape),1);
				  finalData.splice(finalData.indexOf(selectedShape),1);
				}
				reset.style.display = "none";
				if(all_overlays = []){
					clearAll.style.display = "null";
				}
			});

			var  done  =  document.getElementById("done")
			done.addEventListener('click',()=>{
				for (var i = 0; i<all_overlays.length; i++) {
					finalData.push(all_overlays[i].overlay.getPath().getArray().concat([all_overlays[i].type]));
				}
				var len = finalData.length;
				var assoc = {};

				while(len--) {
					var item = finalData[len];

					if(!assoc[item]) 
					{ 
						result_array.unshift(item);
						assoc[item] = true;
					}
				}
				
				for(var i=0; i<result_array.length; i++){
					for(var j=0; j<result_array[i].length; j++){
						if(typeof result_array[i][j] === 'string' || result_array[i][j] instanceof String){
							console.log(result_array[i][j])
						}
						else{
							console.log("destinations.push(new google.maps.LatLng(" + result_array[i][j].lat() + "," + result_array[i][j].lng() + "))")
						}
						
					}
				}
				result_array = []
			})

			var  clearAll  =  document.getElementById("clearAll")
			clearAll.addEventListener('click',()=>{
				for (var i = 0; i<all_overlays.length; i++) {
					all_overlays[i].overlay.setMap(null)
				}
				for (var i = 0; i<result_array.length; i++) {
					result_array[i].overlay.setMap(null)
				}
				
				all_overlays = []
				finalData = []
				result_array = [];
				reset.style.display = "null";
				done.style.display = "null";
				clearAll.style.display = "null";
			})
			
			function clearSelection() {
				if (selectedShape) {
					selectedShape.setEditable(false);
					selectedShape = null;
				}
			}
			
			function setSelection(shape) {
				clearSelection();
				selectedShape = shape;
				shape.setEditable(true);
				reset.style.display = "block";
			}
			
			google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
				done.style.display = "block";
				reset.style.display = "block";
				clearAll.style.display = "block";
				all_overlays.push(e);
				console.log(google.maps.geometry.spherical.computeArea(e.overlay.getPath()));
				console.log(google.maps.geometry.spherical.computeLength(e.overlay.getPath()));

				var newShape = e.overlay;
				newShape.type = e.type;
				google.maps.event.addListener(newShape, 'click', function() {
					setSelection(newShape);
				});
				google.maps.event.addListener(newShape.getPath(), 'set_at', function() {
					console.log(google.maps.geometry.spherical.computeArea(e.overlay.getPath()));
				});
			
				google.maps.event.addListener(newShape.getPath(), 'insert_at', function() {
					console.log(google.maps.geometry.spherical.computeArea(e.overlay.getPath()));
				});
				setSelection(newShape);
			})
		})
	}
}