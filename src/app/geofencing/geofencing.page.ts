import { Component } from '@angular/core';
import { Platform } from "@ionic/angular";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng, MarkerOptions, Marker } from "@ionic-native/google-maps";

declare var google;

function formatTime(time: Date) {
	var new_time = time.toLocaleTimeString()
	var AMPM = new_time.slice(-2)
	if(AMPM == "PM" && parseInt(new_time.slice(0,2)) != 12){
		let new_hrs = parseInt(new_time.slice(0,2)) + 12;
		var replace = new_hrs.toString()
		new_time = replace + new_time.slice(1)
	}
	return(new_time.slice(0,-3))
}

function timeDifference(enter,exit){
	var enter_split = enter.split(':');
	var exit_split = exit.split(':');
	var secs = Math.abs((enter_split[0]*3600 + enter_split[1]*60 + (+enter_split[2] || 0)) - (exit_split[0]*3600 + exit_split[1]*60 + (+exit_split[2] || 0)));

	var sign = secs < 0? '-':'';
	secs = Math.abs(secs);

	function addZeroes(num){return (num<10?'0':'') + num;}

	return(sign + addZeroes(secs/3600 |0) + ':' + addZeroes((secs%3600) / 60 |0) + ':' + addZeroes(secs%60));
}

@Component({
    selector: 'app-geofencing',
    templateUrl: 'geofencing.page.html',
    styleUrls: ['geofencing.page.scss'],
})
export class GeofencingPage {
	constructor(public platform: Platform) {}
		
	mapOptions = {
		center: new google.maps.LatLng(40.23339451516098,-75.13820867530005),
		zoom: 18,
	}

	ionViewDidEnter() {
		this.platform.ready().then(() => {
			var map = new google.maps.Map(document.getElementById('map'), this.mapOptions);
			setPolygons(map)
		});
	}
}

function setPolygons(map){

	var destinations = new google.maps.MVCArray();

	// 606.1262510177436
	// destinations.push(new google.maps.LatLng(40.234162492911004,-75.13829389612829));
	// destinations.push(new google.maps.LatLng(40.23399009676356,-75.13848153497611));
	// destinations.push(new google.maps.LatLng(40.23385272542046,-75.13827959986747));
	// destinations.push(new google.maps.LatLng(40.23403467420079,-75.1380699209526));
	
	// 501.4814942764606
	// destinations.push(new google.maps.LatLng(40.23441708775616,-75.13860257285948));
	// destinations.push(new google.maps.LatLng(40.23422467794579,-75.13881344313624));
	// destinations.push(new google.maps.LatLng(40.23412291023384,-75.13864893298994));
	// destinations.push(new google.maps.LatLng(40.2343172439795,-75.13843846333991));	

	// 400.5322356126811
	// destinations.push(new google.maps.LatLng(40.23441204452734,-75.1386068239639));
	// destinations.push(new google.maps.LatLng(40.234246780742296,-75.13879481470431));
	// destinations.push(new google.maps.LatLng(40.234152128459776,-75.13863540297953));
	// destinations.push(new google.maps.LatLng(40.23431795849665,-75.13846120100189));

	// 301.1178588265415
	// destinations.push(new google.maps.LatLng(40.23438728838238,-75.1386298226921))
	// destinations.push(new google.maps.LatLng(40.23424501066459,-75.1387823208406))
	// destinations.push(new google.maps.LatLng(40.23416188067781,-75.13864842474639))
	// destinations.push(new google.maps.LatLng(40.23430705399124,-75.13849477922257))

	// 9.232018648320556
	// destinations.push(new google.maps.LatLng(40.23429945134961,-75.13862573275547))
	// destinations.push(new google.maps.LatLng(40.23424668642872,-75.13854192205247))

	var polygonOptions = {path: destinations};
	var polygon = new google.maps.Polygon(polygonOptions);
	polygon.setMap(map)
	

	var options = {
		maximumAge: 1000,
		timeout: 5000,
		enableHighAccuracy : true,
	};
	var myMarkerOptions = {
		position: new google.maps.LatLng(40.32716283604211,-75.06813919209483),
		map: map
	}
	var marker = new google.maps.Marker(myMarkerOptions);
	
	var entered = false
	var enterTime = ""
	var exitTime = ""

	let watch = navigator.geolocation.watchPosition(onSuccess, onError, options);
	function onSuccess(position) {
		var userPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude)
		var contain: boolean = google.maps.geometry.poly.containsLocation(userPosition, polygon);
		marker.setPosition(userPosition);
		console.log(formatTime(new Date(new Date().getTime())) + ` ${position.coords.accuracy}m`)
		if(contain == true && enterTime == ""){
			enterTime = formatTime(new Date(new Date().getTime()));
			entered = true
			console.log("entered")
		}
		if(contain == false && entered == true){
			exitTime = formatTime(new Date(new Date().getTime()));
			console.log("exited")
			console.log(enterTime,exitTime)
			console.log(timeDifference(enterTime,exitTime))
			navigator.geolocation.clearWatch(watch);
		}
	}
	function onError(error: any){
		console.log(error)
	}
}