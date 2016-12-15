"use strict";

var myWidget = myWidget || {};

myWidget.Load = function () {
    $(document).ready(function() {
                alert('allo!');
                alert($().SPServices.SPGetCurrentSite());
            })
};