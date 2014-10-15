"use strict";angular.module("angularBedViewApp",["angularprimer","hc.downloader","hc.dsv"]),angular.module("angularBedViewApp").controller("MainCtrl",["$scope","dsv",function(a,b){var c=this,d="chrom	chromStart	chromEnd	name	score	strand	thickStart	thickEnd	itemRgb	blockCount	blockSizes	blockStarts\n";c.bedText="chr7	127471196	127472363	Pos1	0	+	127471196	127472363	255,0,0\nchr7	127472363	127473530	Pos2	0	+	127472363	127473530	255,0,0\nchr7	127473530	127474697	Pos3	0	+	127473530	127474697	255,0,0\nchr7	127474697	127475864	Pos4	0	+	127474697	127475864	255,0,0\nchr7	127475864	127477031	Neg1	0	-	127475864	127477031	0,0,255\nchr7	127477031	127478198	Neg2	0	-	127477031	127478198	0,0,255\nchr7	127478198	127479365	Neg3	0	-	127478198	127479365	0,0,255\nchr7	127479365	127480532	Pos5	0	+	127479365	127480532	255,0,0\nchr7	127480532	127481699	Neg4	0	-	127480532	127481699	0,0,255\n",c.process=function(){function a(a){if(!a||0===a.length)return 0;var b=d3.select("body").append("svg"),c=b.append("text");c.text(a);var d=c.node().getComputedTextLength();return b.remove(),d}var e=c.bedText;e=e.replace(/ +/g,"	"),c.bedArray=b.tsv.parse(d+e,function(b){return b.chromStart=+b.chromStart,b.chromEnd=+b.chromEnd,b.itemRgb=b.itemRgb||"0,0,0",b.shape="box",b.blockCount&&b.blockCount>0&&(b.blockSizes=b.blockSizes.split(","),b.blockStarts=b.blockStarts.split(","),b.blocks=new Array(45).map(function(a,c){var d=b.chromStart+parseInt(b.blockStarts[c]);return d?{start:d,end:d+parseInt(b.blockSizes[c])}:null})),b.labelWidth=a(b.name),b.strand&&(b.shape+="+"===b.strand?"-right":"-left"),b});var f=_F("labelWidth"),g=_F("chromStart"),h=_F("chromEnd"),i=_F("chrom");c.bedArray=d3.nest().key(i).entries(c.bedArray),c.bedArray.forEach(function(b,d){b.start=d3.min(b.values,g),b.length=d3.max(b.values,h)-b.start,b.height=40+10*b.values.length,b.labelWidth=d3.max(b.values,f),b.labelWidth=Math.max(b.labelWidth,a(b.key||"")),b.offset=0===d?0:c.bedArray[d-1].height+c.bedArray[d-1].offset}),c.margin={top:30,right:0,bottom:0,left:d3.max(c.bedArray,f)},c.svgHeight=c.bedArray[c.bedArray.length-1].offset+c.bedArray[c.bedArray.length-1].height,c.trackWidth=650-c.margin.left-c.margin.right}}]);