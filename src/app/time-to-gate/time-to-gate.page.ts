import { Component } from '@angular/core';
import { Platform } from "@ionic/angular";
import { PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

//important information needed for completion:
//boarding gate latlng coordinates
//flight information(flight number, gate num, departure time, boarding time, airline used)
//name of user

declare var google: any;
declare var cordova: any;

//-------------------------------HELPER FUNCTIONS-------------------------------------

function formatTime(time: Date) {
	var new_time = time.toLocaleTimeString()
	var AMPM = new_time.slice(-2)
	if(AMPM == "PM"){
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

const add = (a: any, b: any) => a + b

function convertToMins(duration: number){
	duration = Math.round(duration / 60)
	return(duration)
}

//-------------------------------------------------------------------------------------




//------------------------------------Homepage-----------------------------------------

@Component({
  selector: 'app-time-to-gate',
  templateUrl: './time-to-gate.page.html',
  styleUrls: ['./time-to-gate.page.scss'],
})
export class TimeToGatePage {
	framework = 'At exact boarding time';

    constructor(private pickerCtrl:PickerController, 
    	public platform: Platform, private localNotifications: LocalNotifications) {}

	ionViewDidEnter() {
		this.platform.ready().then(() => {
			getAverageWalkingSpeed()
			checkGateEveryMinute()
			setTimer(true)
		});
	}
	
  	async showPicker() {
  		let opts: PickerOptions ={
  			buttons: [
	  			{
	  				text:'Done'
	  			}

  			],

  			columns: [
	  			{
	  				name: 'framework',
	  				options: [
	  					{text:'10 minutes before boarding time',value:-10},
	  					{text:'5 minutes before boarding time',value:-5},
	  					{text:'At exact boarding time',value:0},
	  					{text:'5 minutes after boarding time',value:5},
	  					{text:'10 minutes after boarding time',value:10}
	  				],
	  				selectedIndex: 2,
	  			}
  			]
  		}
  		let picker = await this.pickerCtrl.create(opts);
  		picker.present();
  		picker.onDidDismiss().then(async data=>{
  			let col = await picker.getColumn('framework');
			this.framework=col.options[col.selectedIndex].text;
			document.getElementById("alerter").innerHTML = col.options[col.selectedIndex].value;
  		})
	}
}

//-------------------------------------------------------------------------------------




//--------------Values to optimize getAverageWalkingSpeed algorithm--------------------

const lower_speed_bound = 0.7;
const upper_speed_bound = 2.5;
const speed_correction_factor = 2;

const valids_needed_in_a_row = 6;
const avg_speeds_to_be_stored = 4;
const margin_of_error = 0.20;

//-------------------------------------------------------------------------------------




//---------------------------------Finding avg_speed-----------------------------------

function getAverageWalkingSpeed():any {
	var options = {
		maximumAge: 1000,
		timeout: 5000,
		enableHighAccuracy : true,
	};
	let watch = navigator.geolocation.watchPosition(onSuccess, onError, options);
	let validity_counter = 0; //total tally of consecutive true values for validity
	let avg_speed = 0.0; //average speed, changes with each iteration(every second)
	let avg_speeds_stored = []; //compilation of users avg_speed that meet our criteria
	let speed_tracker_full = []; //compilation of the above data into one array, as well as number of consecutive valid avg_speed (validity_counter)
	let speed_tracker_optimized = []; //speed_tracker_full relevant values only (validity == true)

    function onSuccess(position: { timestamp: string | number | Date; coords: { speed: any; latitude: any; longitude: any; }; }) {
        let time = formatTime(new Date(new Date().getTime())); //time when speed was found
		let speed = position.coords.speed; //speed found, updates every second
		let validity = false; //whether speed meets our requirements or not

		speed = speed * speed_correction_factor; //geolocation speed values were on average half of what was expected

		//speed is valid if it falls within this interval
		if (speed >= lower_speed_bound && speed <= upper_speed_bound){
			validity = true;
			validity_counter += 1;
		}
		else{
			validity = false;
			validity_counter = 0;
		}

		console.log(time,speed,validity,validity_counter,avg_speeds_stored.length)

		//appending each iteration into a final array
		speed_tracker_full.push([time,speed,validity,validity_counter]);

		//occurs if correct number of valid avg_speed in a row, and num avg_speeds not yet stored
		if(validity_counter == valids_needed_in_a_row && avg_speeds_stored.length + 1 <= avg_speeds_to_be_stored){
			validity_counter = 0;
			speed_tracker_optimized = speed_tracker_full.slice(-valids_needed_in_a_row) //takes previous number rows(which are proven to be valid)

			//iterating through required number of valid avg_speed to accummulate them
			for (let i = 0; i < speed_tracker_optimized.length; i++) {
				avg_speed = avg_speed + speed_tracker_optimized[i][1];
			}

			avg_speed = avg_speed / valids_needed_in_a_row; //finding mean using above accumulation

			//iterating through again to confirm avg_speed is "kosher" (within margin_of_error far each avg_speed)
			for (let i = 0; i < speed_tracker_optimized.length; i++){
				if(Math.abs(speed_tracker_optimized[i][1]-avg_speed)/avg_speed <= margin_of_error){
					continue
				}
				else{
					avg_speed = 0; //for sake of identifying the prior conditional if false
					break
				}
			}

			//if we found a kosher avg_speed above, this stores that value in last row 
			//of speed_tracker_optimized in question
			if(avg_speed != 0){
				speed_tracker_optimized[speed_tracker_optimized.length-1].push(avg_speed)
				avg_speeds_stored.push(avg_speed);
			}
		}

		//if we have stored enough values in avg_speeds_stored
		if(avg_speeds_stored.length == avg_speeds_to_be_stored){
			avg_speed = avg_speeds_stored.reduce(add)/avg_speeds_to_be_stored;

            //check to make sure this final average speed is "kosher", storing it at the end of avg_speeds_stored if true.
			for (let i = 0; i < avg_speeds_to_be_stored; i++){
				if(Math.abs(avg_speeds_stored[i]-avg_speed)/avg_speed <= margin_of_error){
					avg_speeds_stored.push(avg_speeds_stored[i]);
					continue
				}
			}

            //slicing avg_speeds_stored, to find the elements that were appended to the end.
            avg_speeds_stored = avg_speeds_stored.slice(avg_speeds_to_be_stored)
            
            //if the above slice has a length of what we expect, then all values were kosher, average speed found.
			if(avg_speeds_stored.length == avg_speeds_to_be_stored){
				navigator.geolocation.clearWatch(watch); //no longer watching location of user.
				document.getElementById("avg_speed_updater").innerHTML = avg_speed.toFixed(3)
			}
		}
    }

    //incase an error arises with .watchposition().
    function onError(_error: any) {
		console.log(_error)
	}
}

//-------------------------------------------------------------------------------------




//-----------Sets a timer and continously checks time to gate every minute-------------

function setTimer(state: boolean){
	if(state){
		var timer = setInterval(checkGateEveryMinute, 60000);
	}
	else{
		clearInterval(timer)
	}
}

function checkGateEveryMinute(){
	var options = {
		enableHighAccuracy : true,
	};

	navigator.geolocation.getCurrentPosition(onSuccess, onError, options)

	function onSuccess(position: { coords: { latitude: any; longitude: any; }; }){
		var directionsService = new google.maps.DirectionsService();

		//BenGurion: LatLng(32.0027742, 34.872182), SFO: LatLng(37.6198635, -122.3874150)
		const yourPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		//BenGurionNearGateC: LatLng(32.0053747, 34.8741926), SFONearTerminal2: LatLng(37.6167940, -122.3845518)
		const end = new google.maps.LatLng(position.coords.latitude+0.01, position.coords.longitude+0.01); //needs to be updated with boarding location latlng

		var request = {
			origin: yourPosition,
			destination: end,
			travelMode: 'WALKING'
		};
		directionsService.route(request, function(result: { routes: { legs: { distance: { value: any; },duration: { value: any; }; }[]; }[]; }, status: string) {
			if (status == 'OK') {
				var alert_time_selected = parseInt(document.getElementById("alerter").innerHTML) //in mins

				var distance = result.routes[0].legs[0].distance.value;
				var google_speed = distance / result.routes[0].legs[0].duration.value

				if(document.getElementById("avg_speed_updater").innerHTML == ""){
					document.getElementById("avg_speed_updater").innerHTML = google_speed.toFixed(3)
				}

				var avg_speed = parseFloat(document.getElementById("avg_speed_updater").innerHTML)
				var duration = convertToMins(distance/avg_speed)

				document.getElementById("time_to_gate").innerHTML = duration.toString()
				
				//conditional math below is incorrect intentionally, read individual comments
				if(alert_time_selected <= 0){
					if(duration + alert_time_selected <= 0){ //should be, if current time - boarding time == alert_time_selected, then:
						single_notification("Title", "Body Text", 0) //set off alarm instantly, for alarms before boarding time
					}
				}
				else{
					if(duration == 0){ //should be, if current time == boarding time, then:
						single_notification("Title", "Body Text", alert_time_selected * 60) //needs to delay by alert time, for alarms after boarding time
					}
				}
			}
		});
		
		if(yourPosition == end){
			setTimer(false)
		}
	}
	function onError(error: any){
		console.log(error)
	}
}

//-------------------------------------------------------------------------------------

function single_notification(title,body,delay) {
	cordova.plugins.notification.local.schedule({
		title: title,
		text: body,
		trigger: {at: new Date(new Date().getTime() + delay)},
		priority: 0,
		sound: "default",
		foreground: true,
		lockscreen: true,
		vibrate: true,
		wakeup: true,
		actions: [
			{ id: 'yes', title: 'On my way!' },
			{ id: 'no',  title: 'Cannot make it :(' }
		]
   });
}