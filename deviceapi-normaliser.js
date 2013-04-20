/**
    deviceapi-normaliser.js
    
    Author: Andrew Fisher
    Date: 27/03/2013
    
    Version: 0.5
    
    This file is licensed under a BSD licence as per the Licence.
        
**/

var mo = {
    _browser:  null,
    _os: null,
    _ua: navigator.userAgent,
    normalise: false, 
    orientation: false,
    motion: false,

    init: function() {
        // Initialises the library to do things like device checking etc.


        var orientation = false;
        var motion = false

        // first pass.
        if (window.DeviceOrientationEvent) {
            orientation = true;
        }

        if (window.DeviceMotionEvent) {
            motion = true;
        }

        if (orientation && motion) {
            // Could be iOS, Android Stock or FF or blackberry
            if (this._ua.match(/Firefox/i) && this._ua.match(/Android/i)) {
                // this is definitive
                this._os = "Android";
                this._browser = "Firefox";
            } else if (this._ua.match(/Android/i)){
                // Stock Android
                this._os = "Android";
                this._browser = "Stock";
            } else if (this._ua.match(/Blackberry|RIM/i)){
                //blackberry
                this._os = "Blackberry";
                this._browser = "Stock";
            } else {
                this._os = "iOS";
                this._browser = "webkit";
            }
        } else if (orientation && !motion) {
            // It's chrome but is it desktop or mobile?
            this._browser = "Chrome";
            if (this._ua.match(/Android/i)){
                this._os = "Android";
            } else {
                this._os = "Desktop";
            }
        } else if (!orientation) {

            // this is something very odd
            this._browser = "Unknown";
            this._os = "Unknown";
        }

        // TODO - actually set these properly.
        this.orientation = orientation;
        this.motion = motion;
    },
}



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
