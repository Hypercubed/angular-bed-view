'use strict';

angular.module('angularBedViewApp')

  .controller('MainCtrl', function ($scope, dsv, $http, $timeout, d3, svgUtil, _F) {
    var vm = this;

    vm.bedText = null;
    vm.scale = 1.1;

    var _labelWidth = _F('labelWidth');
    var _start = _F('chromStart');
    var _end = _F('chromEnd');
    var _chrom = _F('chrom');

    function processBedRow(d) {

      if (d.chrom.match(/^\#/)){ return; }

      d.chromStart = parseInt(d.chromStart);
      d.chromEnd = parseInt(d.chromEnd);
      if (!d.chromStart || !d.chromEnd) { return; }

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

      d.labelWidth = svgUtil.getStringLength(d.name);
      if (d.strand) {
        d.shape += (d.strand === '+') ? '-right' : '-left';
      }
      return d;
    }

    var yScale = $scope._$y = function(i) { return 11*i; };

    function draw(arr) {
      vm.bedArray = d3.nest()
        .key(_chrom)
        .entries(arr);

      var S = vm.scale;
      vm.bedArray.forEach(function(track, i) {
        var start = d3.min(track.values, _start);
        var end = d3.max(track.values, _end);

        var mid = (end + start)/2;

        start = mid - S*(mid - start);
        end = S*(end - mid) + mid;

        track.start = start;
        track.length = end-start;
        track.height = 40+yScale(track.values.length);
        track.labelWidth = d3.max(track.values, _labelWidth);
        track.labelWidth = Math.max(track.labelWidth, svgUtil.getStringLength(track.key || ''));
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

      $http(r).success(function(data) {  // Also add a copy of teh plain text to the textarea
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

    vm.onDrag = function(track, e, x) {
      var scale = x.invert;
      track.start -= scale(e.dx)-scale(0);
    }

  })

  .directive('d3Drag', function($parse, d3){
    return{
      require: 'primerTrack',
      compile: function($element, attr) {
        var fn = $parse(attr.d3Drag);
        return function(scope, element, attr, track) {
          var e = d3.select(element[0]);
          var drag = d3.behavior.drag().on('drag', function() {
            scope.$apply(function() {
              fn(scope, {$event:d3.event, _$x:track.xScale});
            })
          });
          e.call(drag);
        };
      }
    }
  });
