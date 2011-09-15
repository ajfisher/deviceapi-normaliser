/**
    deviceapi-normaliser.js
    
    Author: Andrew Fisher
    Date: 15/09/2011
    
    Version: 0.2
    
    This file is licensed under a BSD licence as per the Licence.
        
**/
    
// set up some constants
var accel_multi = 1; // used to normalise the accel values if firefox

$(function() {
    if ($.browser.mozilla) {
        accel_multi = 9.81;
    }
});

function deviceMotion(e) {

	// we need to normalise the values, safari will just return
	// as they are but ff will multiply by gravity.
    this.accelerationIncludingGravity = new Object();
    this.accelerationIncludingGravity.x = e.accelerationIncludingGravity.x * accel_multi;
    this.accelerationIncludingGravity.y = e.accelerationIncludingGravity.y * accel_multi;
    this.accelerationIncludingGravity.z = e.accelerationIncludingGravity.z * accel_multi;
    
    this.acceleration = new Object();
    this.acceleration.x = null;
    this.acceleration.y = null;
    this.acceleration.z = null;
    
    return (this);
}

function deviceOrientation(e) {
    
    // normalise the values for the orientation event.
    
    // TODO:
    // these values need further normalisation because I know safari
    // breaks them but haven't got a device to test with.
    
	this.gamma = e.gamma;
	this.beta = e.beta;
	this.alpha = e.alpha; // compass
	
	return(this);
	
}
