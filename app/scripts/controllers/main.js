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

    function getStringLength(s) {
      if(!s || s.length === 0) {return 0;}
      var svg = d3.select('body').append('svg');
      var temp = svg.append('text');
      temp.text(s);
      var r = temp.node().getComputedTextLength();
      svg.remove();
      return r;
    }

    function processBed(d) {
      d.chromStart = +d.chromStart;
      d.chromEnd = +d.chromEnd;
      d.itemRgb = d.itemRgb || '0,0,0';
      d.shape = 'box';
      d.blocks = [];

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

      }

      d.labelWidth = getStringLength(d.name);
      if (d.strand) {
        d.shape += (d.strand === '+') ? '-right' : '-left';
      }
      return d;
    }

    vm.load = function(file) {
      if (!file.length) { return; }

      $http.get(file).success(function(data) {
        vm.bedText = data;
        vm.process();
      });

      //dsv.tsv({method: 'get', url: file}, processBed).success(function(data) {
      //  vm.bedArray = data;
      //});


    };

    var header = 'chrom\tchromStart\tchromEnd\tname\tscore\tstrand\tthickStart\tthickEnd\titemRgb\tblockCount\tblockSizes\tblockStarts\n';

    vm.process = function() {
      var text = vm.bedText;
      text = text.replace(/ +/g, '\t');

      if (!text.match(/^chrom/)) {
        text = header+text;
      }

      vm.bedArray = dsv.tsv.parse(text, processBed);

      var _labelWidth = _F('labelWidth');
      var _start = _F('chromStart');
      var _end = _F('chromEnd');
      var _chrom = _F('chrom');

      vm.bedArray = d3.nest()
        .key(_chrom)
        .entries(vm.bedArray);

      vm.bedArray.forEach(function(d, i) {
        d.start = d3.min(d.values, _start);
        d.length = d3.max(d.values, _end)-d.start;
        d.height = 40+10*d.values.length;
        d.labelWidth = d3.max(d.values, _labelWidth);
        d.labelWidth = Math.max(d.labelWidth, getStringLength(d.key || ''));
        d.offset = i === 0 ? 0 : vm.bedArray[i-1].height + vm.bedArray[i-1].offset;
      });

      vm.margin = {top: 30, right: 0, bottom: 0, left: d3.max(vm.bedArray, _labelWidth)};
      vm.svgHeight = vm.bedArray[vm.bedArray.length-1].offset + vm.bedArray[vm.bedArray.length-1].height;
      vm.trackWidth = 650-vm.margin.left-vm.margin.right;

    };

  });
