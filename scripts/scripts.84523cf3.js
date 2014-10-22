"use strict";angular.module("angularBedViewApp",["ui.codemirror","angularprimer","hc.downloader","hc.dsv"]).service("d3",["$window",function(a){return a.d3}]).service("_F",["$window",function(a){return a._F}]).service("svgUtil",["d3",function(a){return{getStringLength:function(b){if(!b||0===b.length)return 0;var c=a.select("body").append("svg"),d=c.append("text");d.text(b);var e=d.node().getComputedTextLength();return c.remove(),e}}}]),angular.module("angularBedViewApp").controller("MainCtrl",["$scope","dsv","$http","$timeout","d3","svgUtil","_F",function(a,b,c,d,e,f,g){function h(a){if(!a.chrom.match(/^\#/)&&(a.chromStart=parseInt(a.chromStart),a.chromEnd=parseInt(a.chromEnd),a.chromStart&&a.chromEnd)){if(a.itemRgb=a.itemRgb||"0,0,0",a.shape="box",a.blocks=[],a.thickStart=a.thickStart||a.chromStart,a.thickEnd=a.thickEnd||a.chromEnd,a.blockCount&&a.blockCount>0){a.blockSizes=a.blockSizes.split(","),a.blockStarts=a.blockStarts.split(","),a.blockCount=parseInt(a.blockCount);for(var b=0;b<a.blockCount;b++){var c=a.blockStarts[b];c&&(c=a.chromStart+parseInt(c),a.blocks.push({start:c,end:c+parseInt(a.blockSizes[b])}))}}else a.blocks.push({start:a.thickStart,end:a.thickEnd});return a.labelWidth=f.getStringLength(a.name),a.strand&&(a.shape+="+"===a.strand?"-right":"-left"),a}}function i(a){j.bedArray=e.nest().key(n).entries(a);var b=j.scale;j.bedArray.forEach(function(a,c){var d=e.min(a.values,l),g=e.max(a.values,m),h=(g+d)/2;d=h-b*(h-d),g=b*(g-h)+h,a.start=d,a.length=g-d,a.height=40+o(a.values.length),a.labelWidth=e.max(a.values,k),a.labelWidth=Math.max(a.labelWidth,f.getStringLength(a.key||"")),a.offset=0===c?0:j.bedArray[c-1].height+j.bedArray[c-1].offset}),j.margin={top:30,right:0,bottom:0,left:e.max(j.bedArray,k)},j.svgHeight=j.bedArray[j.bedArray.length-1].offset+j.bedArray[j.bedArray.length-1].height,j.trackWidth=650-j.margin.left-j.margin.right,j.bedForm.$setPristine()}var j=this;j.bedText=null,j.scale=1.1;var k=g("labelWidth"),l=g("chromStart"),m=g("chromEnd"),n=g("chrom"),o=a._$y=function(a){return 11*a};j.load=function(a){if(a.length){var d={method:"get",url:a,cache:!0};b.tsv(d,h).success(i),c(d).success(function(a){j.bedText=a})}};var p="chrom	chromStart	chromEnd	name	score	strand	thickStart	thickEnd	itemRgb	blockCount	blockSizes	blockStarts\n";j.process=function(a){if(a=a||j.bedText){a=a.replace(/[ \t\xA0\u00A0\u2028\u2029]+/g,"	"),a.match(/^chrom/)||(a=p+a);var c=b.tsv.parse(a,h);i(c)}},j.onRead=function(a){j.bedText=a.target.result,j.process()},j.onDrag=function(a,b,c){var d=c.invert;a.start-=d(b.dx)-d(0)}}]).directive("d3Drag",["$parse","d3",function(a,b){return{require:"primerTrack",compile:function(c,d){var e=a(d.d3Drag);return function(a,c,d,f){var g=b.select(c[0]),h=b.behavior.drag().on("drag",function(){a.$apply(function(){e(a,{$event:b.event,_$x:f.xScale})})});g.call(h)}}}}]);