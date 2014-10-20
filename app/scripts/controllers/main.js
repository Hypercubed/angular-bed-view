/* global d3 */
/* global _F */

'use strict';

/**
 * @ngdoc function
 * @name angularBedViewApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularBedViewApp
 */
angular.module('angularBedViewApp')
  .controller('MainCtrl', function ($scope, dsv, $http) {
    var vm = this;

    vm.bedText = null;

    var _labelWidth = _F('labelWidth');
    var _start = _F('chromStart');
    var _end = _F('chromEnd');
    var _chrom = _F('chrom');

    function getStringLength(s) {
      if(!s || s.length === 0) {return 0;}
      var svg = d3.select('body').append('svg');
      var temp = svg.append('text');
      temp.text(s);
      var r = temp.node().getComputedTextLength();
      svg.remove();
      return r;
    }

    function processBedRow(d) {
      d.chromStart = +d.chromStart;
      d.chromEnd = +d.chromEnd;
      d.itemRgb = d.itemRgb || '0,0,0';
      d.shape = 'box';
      d.blocks = [];

      d.thickStart = d.thickStart || d.chromStart;
      d.thickEnd = d.thickEnd || d.chromEnd;

      if (d.blockCount && d.blockCount > 0) {
        d.blockSizes = d.blockSizes.split(',');
        d.blockStarts = d.blockStarts.split(',');
        d.blockCount = parseInt(d.blockCount);

        for(var i = 0; i < d.blockCount; i++) {
          var start = d.blockStarts[i];
          if (start) {
            start = d.chromStart + parseInt(start);
            d.blocks.push({
              start: start,
              end: start + parseInt(d.blockSizes[i])
            });
          }
        }
      } else {
        d.blocks.push({
          start: d.thickStart,
          end: d.thickEnd
        });
      }

      d.labelWidth = getStringLength(d.name);
      if (d.strand) {
        d.shape += (d.strand === '+') ? '-right' : '-left';
      }
      return d;
    }

    var yScale = $scope.yScale = function(i) { return 11*i; };

    function draw(arr) {
      vm.bedArray = d3.nest()
        .key(_chrom)
        .entries(arr);

      vm.bedArray.forEach(function(track, i) {
        track.start = d3.min(track.values, _start);
        track.length = d3.max(track.values, _end)-track.start;
        track.height = 40+yScale(track.values.length);
        track.labelWidth = d3.max(track.values, _labelWidth);
        track.labelWidth = Math.max(track.labelWidth, getStringLength(track.key || ''));
        track.offset = i === 0 ? 0 : vm.bedArray[i-1].height + vm.bedArray[i-1].offset;
      });

      //console.log(vm.bedArray[0].start, vm.bedArray[0].length);

      vm.margin = {top: 30, right: 0, bottom: 0, left: d3.max(vm.bedArray, _labelWidth)};
      vm.svgHeight = vm.bedArray[vm.bedArray.length-1].offset + vm.bedArray[vm.bedArray.length-1].height;
      vm.trackWidth = 650-vm.margin.left-vm.margin.right;

      vm.bedForm.$setPristine();

    }

    vm.load = function(file) {
      if (!file.length) { return; }

      var r = {method: 'get', url: file, cache: true};

      dsv.tsv(r, processBedRow).success(draw);

      $http(r).success(function(data) {
        vm.bedText = data;
      });

    };

    var header = 'chrom\tchromStart\tchromEnd\tname\tscore\tstrand\tthickStart\tthickEnd\titemRgb\tblockCount\tblockSizes\tblockStarts\n';

    vm.process = function(text) {
      text = text || vm.bedText;
      if (!text) { return; }

      text = text.replace(/[ \t\xA0\u00A0\u2028\u2029]+/g, '\t');

      if (!text.match(/^chrom/)) {
        text = header+text;
      }

      var arr = dsv.tsv.parse(text, processBedRow);
      draw(arr);
    };

    vm.onRead = function( e ){
      vm.bedText = e.target.result;
      vm.process();
    };

  });
