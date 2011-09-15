=====================
Device API Normaliser
=====================

Intro
=====

This library creates two helper functions designed to parse device orientation
and devicemotion events. It returns objects that you can query as per the
spec at the W3C with as much consistency as possible provided. Currently
as per this document: http://dev.w3.org/geo/api/spec-source-orientation

Presently the only devices that reliably use the device api events are 
mobile safari on iOS4+ and Firefox 6 (Fennec) on Android.

Mobile chrome does not currently support the device api.

This library is licenced under a BSD style licence as per to the licence document included in the repo.

All issues etc should be logged at the github repo at http://github.com/ajfisher/deviceapi-normaliser/

Usage
=====

Assumes - Jquery is installed so access to $.browser object is available.
Install the file in your path, include it in a script tag (after jquery) then add your 
eventlisteners to your page:

window.addEventListener("deviceorientation", [my_orientation_change_handler], false);

window.addEventListener("devicemotion", [my_motion_change_handler], false);

You will need to define your own handlers for the methods given above.

In these mothods simply call the relevant function below and you'll be
returned an object as per the spec.

You will need to call it with the event object passed into the handler.

Eg:

function my_orientation_change_handler(e) {
    var obj = deviceOrientation(e);

    // returns
    obj.gamma
    obj.alpha
    obj.beta
}

function my_motion_change_handler(e) {
    var obj = deviceMotion(e);
    
    // returns
    obj.accelerationIncludingGravity.x
    obj.accelerationIncludingGravity.y
    obj.accelerationIncludingGravity.z        

}
Known Issues
=============

* iOS devices prior to the iPhone 4 do not have a gyro and as a result don't
provide that data back.
* Mobile chrome does not support any of these events so is unsupported.
* rotation rate presently not implemented given lack of visibility on this
method from the browsers


Behavioural changes from default
=================================

The following mods have been made to bring the devices into "line" with the
spec above.

Safari:
* Early iOS devices have no gyro - as such any call to deviceOrientation will return
the right object but with data as null.
* I think Safari provides the wrong values:
    * Alpha is as a val [-180, 180] (should be [0-360])
    * Gamma [-180, 180] (should be [-90, 90])
    * Beta [ -90, 90] (should be [-180, 180])

Firefox:

* accelerometer values are given as a range [-1, 1] - these look to be as a
percentage of gravity. Thus they are multiplied by +9.81 (gravity acceleration) 
and they seem to normalise well with the iPhone.

Roadmap
=======

* Include the rotation information
* Get tests done for iOS devices which I don't presently have access to.
* Try out a honeycomb device to see if Mobile Chrome supports the API
* Write handler to detect whether eventlisteners should be bound or not.


