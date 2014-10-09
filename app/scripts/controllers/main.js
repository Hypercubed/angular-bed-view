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

    var header = 'chrom\tstart\tend\tname\tscore\tstrand\tfeatureStart\tfeatureEnd\trgb\n';

    vm.bedText =  'chr7\t127471196\t127472363\tPos1\t0\t+\t127471196\t127472363\t255,0,0\n'+
                  'chr7\t127472363\t127473530\tPos2\t0\t+\t127472363\t127473530\t255,0,0\n'+
                  'chr7\t127473530\t127474697\tPos3\t0\t+\t127473530\t127474697\t255,0,0\n'+
                  'chr7\t127474697\t127475864\tPos4\t0\t+\t127474697\t127475864\t255,0,0\n'+
                  'chr7\t127475864\t127477031\tNeg1\t0\t-\t127475864\t127477031\t0,0,255\n'+
                  'chr7\t127477031\t127478198\tNeg2\t0\t-\t127477031\t127478198\t0,0,255\n'+
                  'chr7\t127478198\t127479365\tNeg3\t0\t-\t127478198\t127479365\t0,0,255\n'+
                  'chr7\t127479365\t127480532\tPos5\t0\t+\t127479365\t127480532\t255,0,0\n'+
                  'chr7\t127480532\t127481699\tNeg4\t0\t-\t127480532\t127481699\t0,0,255\n';

    vm.process = function() {
      var text = vm.bedText;
      text = text.replace(/ +/g, '\t');
      //console.log(text);

      vm.bedArray = dsv.tsv.parse(header+text, function(d) {
        d.start = +d.start;
        d.end = +d.end;
        d.rgb = d.rgb || '0,0,0';
        d.shape = 'box';
        d.labelWidth = getStringLength(d.name);
        if (d.strand) {
          d.shape += (d.strand === '+') ? '-right' : '-left';
        }
        return d;
      });

      var _labelWidth = _F('labelWidth');

      vm.bedArray = d3.nest()
        .key(function(d) { return d.chrom; })
        .entries(vm.bedArray);

      vm.bedArray.forEach(function(d, i) {
        d.start = d3.min(d.values, _F('start'));
        d.length = d3.max(d.values, _F('end'))-d.start;
        d.height = 40+10*d.values.length;
        d.labelWidth = d3.max(d.values, _labelWidth);
        d.labelWidth = Math.max(d.labelWidth, getStringLength(d.key || ''));
        d.offset = i === 0 ? 0 : vm.bedArray[i-1].height + vm.bedArray[i-1].offset;
      });

      function getStringLength(s) {
        if(!s || s.length === 0) return 0;
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
