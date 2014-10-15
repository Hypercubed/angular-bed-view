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
  .controller('MainCtrl', function ($scope, dsv) {
    var vm = this;

    var header = 'chrom\tchromStart\tchromEnd\tname\tscore\tstrand\tthickStart\tthickEnd\titemRgb\tblockCount\tblockSizes\tblockStarts\n';

    vm.bedText =  'chr7\t127471196\t127472363\tPos1\t0\t+\t127471196\t127472363\t255,0,0\n'+
                  'chr7\t127472363\t127473530\tPos2\t0\t+\t127472363\t127473530\t255,0,0\n'+
                  'chr7\t127473530\t127474697\tPos3\t0\t+\t127473530\t127474697\t255,0,0\n'+
                  'chr7\t127474697\t127475864\tPos4\t0\t+\t127474697\t127475864\t255,0,0\n'+
                  'chr7\t127475864\t127477031\tNeg1\t0\t-\t127475864\t127477031\t0,0,255\n'+
                  'chr7\t127477031\t127478198\tNeg2\t0\t-\t127477031\t127478198\t0,0,255\n'+
                  'chr7\t127478198\t127479365\tNeg3\t0\t-\t127478198\t127479365\t0,0,255\n'+
                  'chr7\t127479365\t127480532\tPos5\t0\t+\t127479365\t127480532\t255,0,0\n'+
                  'chr7\t127480532\t127481699\tNeg4\t0\t-\t127480532\t127481699\t0,0,255\n';

    //vm.bedText = 'chr22\t1000\t5000\tcloneA\t960\t+\t1000\t5000\t0\t2\t567,488,\t0,3512\nchr22\t2000\t6000\tcloneB\t900\t-\t2000\t6000\t0\t2\t433,399,\t0,3601';

    vm.process = function() {
      var text = vm.bedText;
      text = text.replace(/ +/g, '\t');
      //console.log(text);

      vm.bedArray = dsv.tsv.parse(header+text, function(d) {
        d.chromStart = +d.chromStart;
        d.chromEnd = +d.chromEnd;
        d.itemRgb = d.itemRgb || '0,0,0';
        d.shape = 'box';
        if (d.blockCount && d.blockCount > 0) {
          d.blockSizes = d.blockSizes.split(',');
          d.blockStarts = d.blockStarts.split(',');
          d.blocks = (new Array(45)).map(function(start,i) {
            var s = d.chromStart + parseInt(d.blockStarts[i]);
            if (!s) { return null; }
            return {
              start: s,
              end: s + parseInt(d.blockSizes[i])
            };
          });
        }
        d.labelWidth = getStringLength(d.name);
        if (d.strand) {
          d.shape += (d.strand === '+') ? '-right' : '-left';
        }
        return d;
      });

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

      function getStringLength(s) {
        if(!s || s.length === 0) {return 0;}
        var svg = d3.select('body').append('svg');
        var temp = svg.append('text');
        temp.text(s);
        var r = temp.node().getComputedTextLength();
        svg.remove();
        return r;
      }

      vm.margin = {top: 30, right: 0, bottom: 0, left: d3.max(vm.bedArray, _labelWidth)};
      vm.svgHeight = vm.bedArray[vm.bedArray.length-1].offset + vm.bedArray[vm.bedArray.length-1].height;
      vm.trackWidth = 650-vm.margin.left-vm.margin.right;

    };

  });
