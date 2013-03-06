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

* iOS devices prior to the iPhone 4 do not have a gyro and as a result don't provide that data back.
* Mobile chrome has only partial support on Android (orientation only). There is an outstanding ticket to get motion included though (https://code.google.com/p/chromium/issues/detail?id=135804)
* rotation rate presently not implemented given lack of visibility on this method from the browsers

Currently known to work on
==========================

Android
-------

* Firefox - Gingerbread (2.3)+ devices (Motion and Orientation)
* Chrome for Android - Gingerbread (2.3)+ Orientation only (no motion)
* Android Browser - ICS (4.0)+ (Motion and Orientation)

iPhone / iPad
-------------

* Chrome for iOS - iOS6+ Motion and Orientation
* Mobile Safari  - iOS4+ Motion and Orientation


Current Tests of Spec compliance
=================================

Device Orientation
------------------

The specs suggest the following:

X is in the plane of the ground and is positive to the East (-ive to West)
Y is in the plane of the ground and is positive to the North (-ive to South)
Z is perpendicular to the ground plane and is positive towards the sky (negative into the earth)

Rotation should be expressed using the right hand rule, thus positive values with rotation clockwise around the axis of rotation when looking down the axis.

Direction faced to get a 0 position. The spec is unclear what the defaults should be and so as a result many different choices are taken by the vendors. This causes confusion. The below tables show the results of each axis, including the ranges expressed

Alpha (compass/ yaw)
....................

                Zero point      RHR*    Range
iOS Chome:      East (90)       Y       [0, 360]
iOS Safari:     East (90)       Y       [0, 360]
Android Chrome: North (0)       Y       [0, 360]
Android:        West (270)      Y       [0, 360]
Android FF:     North (0)       N       [0, 360]

Beta (Pitch)
............

                Zero point      RHR*    Range           Notes
Reference       H. Plane        Y       [0, -180|180]
iOS Chome:      H. Plane        Y       [-90, 90]       Full range of rotation not supported.[1]
iOS Safari:     H. Plane        Y       [-90, 90]       Full range of rotation not supported.[1]
Android Chrome: H. Plane        Y       [-90, 90]       Full range of rotation not supported.[1]
Android:        H. Plane        Y       [-90, 90]       Full range of rotation not supported.[1]
Android FF:     H. Plane        N       [0, 180|-180]   Back to front[2]

[1] Under iOS the rotation goes the right direction from the horizontal plane however once it hits the maximal or minimal point at (90 | -90 degrees) it simply starts to decrease again, rather than provide the full rotation.

[2] In FF on android the rotation is back to front but it does go through the full range to 180 degrees. However under firefox the value is -90 when the top is point upwards and 90 when the top of the device points downwards. This is a reversing of the RHR.

Gamma (Roll)
.............

                Zero point      RHR*    Range           Notes
Reference       H. Plane        Y       [0, 90|-90]     [1]
iOS Chome:      H. Plane        Y       [0, 180|-180]   Full range of rotation not supported[2]
iOS Safari:     H. Plane        Y       [0, 180|-180]   Full range of rotation not supported[2]
Android Chrome: H. Plane        Y       [0, 270|-90]    Odd range to cope with the gaps[3]
Android:        H. Plane        Y       [0, 270|-90]    Odd range to cope with the gaps[3]
Android FF:     H. Plane        N       [0, -90|90]     Range back to front [4]

[1] This is poor definition by the W3C as it implies rotation only happens to 90 degrees from the horizontal plane, thus causing an issue when you go under this.

[2] Under iOS rotation starts from the horizontal plan with the screen facing up as the zero point. Rotating around the Y axis so that the screen is facing down will result in a value of 180 or -180. If the rotation occurs clockwise the values increase through the +ive range, if the rotation is anti-clockwise then the values increase through the -ive range. Thus resting the R edge (L edge upwards) the value is 90, the reverse (resting on the L edge, R edge up) means the value is -90.

[3] The Chrome for Android and stock android browsers create the right rotational vales for the +-90 range however the gap after 90 on the clockwise rotation is filled with increasing +ive values until it reaches the -90 value. This provides an opportunity to know exactly how far the device is rotated around the Y axis but can't be replicated by any of the others.

[4] Firefox reverses its range the same way as it does on Beta. The range is correct however rotation clockwise results in a -ive number and the reverse.

* RHR = Right Hand Rule. That positive values increase when rotating clockwise around the axis of rotation when looking along the axis' postive trajectory. This causes confusion because for a compass it looks like you're going backwards but that's because you're looking along the -ive trajectory of the Z axis.

With respect to RHR, Y=Yes, N=No and P=Partial which means it follow some of the RHR guidance

Device Motion
-------------

Support for motion properties:

                Acc     AccIG   Rot     Interval
iOS Chome:      N       Y       N       N
iOS Safari:     Y       Y       Y       Y
Android Chrome: N       N       N       N
Android:        N       Y       N       Y
Android FF:     Y       Y       Y       Y



Behavioural changes from default
=================================

The following mods have been made to bring the devices into "line" with the
spec above.

Safari:

* Early iOS devices have no gyro - as such any call to deviceOrientation will return the right object but with data as null.
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
* Write handler to detect whether eventlisteners should be bound or not based on capabilities.


