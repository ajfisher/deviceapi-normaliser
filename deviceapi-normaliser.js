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
    ;
});

function deviceMotion(e) {

	// we need to normalise the values, safari will just return
	// as they are but ff will multiply by gravity.
    this.accelerationIncludingGravity = new Object();
    this.accelerationIncludingGravity.x = e.accelerationIncludingGravity.x;
    this.accelerationIncludingGravity.y = e.accelerationIncludingGravity.y;
    this.accelerationIncludingGravity.z = e.accelerationIncludingGravity.z;
    
    this.acceleration = new Object();
    if (e.acceleration !== null) {
        this.acceleration.x = e.acceleration.x;
        this.acceleration.y = e.acceleration.y;
        this.acceleration.z = e.acceleration.z;
    } else {
        this.acceleration.x = null;
        this.acceleration.y = null;
        this.acceleration.z = null;
    }
    
    this.rotationRate = new Object();
    if (e.rotationRate !== null) {
        this.rotationRate.alpha = e.rotationRate.alpha;
        this.rotationRate.beta = e.rotationRate.beta;
        this.rotationRate.gamma = e.rotationRate.gamma;
    } else {
        this.rotationRate.alpha = null;
        this.rotationRate.beta = null;
        this.rotationRate.gamma = null;
    }

    this.interval = null;
    if (e.interval !== null) { this.interval = e.interval; }

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

    this.absolute = false;
    if (e.absolute !== null) { this.absolute = e.absolute; }

	return(this);
	
}
