'use strict';

/**
 * @ngdoc overview
 * @name angularBedViewApp
 * @description
 * # angularBedViewApp
 *
 * Main module of the application.
 */
angular
  .module('angularBedViewApp', ['ui.codemirror','angularprimer','hc.downloader','hc.dsv'])

  .service('d3', function($window) {
    return $window.d3;
  })

  .service('_F', function($window) {
    return $window._F;
  })

  .service('svgUtil', function(d3) {
    return {
      getStringLength: function getStringLength(s) {
        if(!s || s.length === 0) {return 0;}
        var svg = d3.select('body').append('svg');
        var temp = svg.append('text');
        temp.text(s);
        var r = temp.node().getComputedTextLength();
        svg.remove();
        return r;
      }
    }
  });
