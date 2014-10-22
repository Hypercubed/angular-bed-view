angular-bed-view
================

Simple example of a bed file viewer built using [Hypercubed/angular-primer](http://github.com/Hypercubed/angular-primer/), [Hypercubed/angular-downloadsvg-directive](http://github.com/Hypercubed/angular-downloadsvg-directive/), [Hypercubed/angular-dsv](http://github.com/Hypercubed/angular-dsv/), [Hypercubed/_F](http://github.com/Hypercubed/_F/).

[demo](http://hypercubed.github.io/angular-bed-view/)

## Install

```bash
git clone https://github.com/Hypercubed/angular-bed-view.git
cd angular-bed-view
grunt serve
```

## Components

[Hypercubed/angular-primer](https://github.com/Hypercubed/angular-primer/) is a small set of AngularJS directives useful for generating interactive SVG based visualizations of genomic features.  For example:

```html
<svg width="100%" shape-rendering="crispEdges" >
  <g primer-track transform="translate(0,30)">
    <g primer-scale/>
    <g primer-label anchor="start"><text text-anchor="end">3'</text></g>
    <g primer-label anchor="end"><text text-anchor="start">5'</text></g>
    <g primer-feature start="10" end="25">
      <g primer-feature-shape class="marker"/>
      <g primer-label="A" orient="top" />
    </g>
    <g primer-feature start="30" end="55">
      <g primer-feature-shape class="marker" />
      <g primer-label="B" orient="top" />
    </g>
    <g primer-feature start="60" end="95">
      <g primer-feature-shape class="marker"/>
      <g primer-label="C" orient="top" />
    </g>
  </g>
</svg>
```

![example](https://github.com/Hypercubed/angular-primer/raw/master/README-example.png)

[Hypercubed/angular-downloadsvg-directive](https://github.com/Hypercubed/angular-downloadsvg-directive/) is a AngularJS directive to download embedded `<svg>` graphics as an svg file... including CSS defined styles. (see [demo](http://hypercubed.github.io/angular-bed-view/) for example).

[Hypercubed/angular-dsv](https://github.com/Hypercubed/angular-dsv/) is a AngularJS based version of [d3.dsv](https://github.com/mbostock/d3/wiki/CSV#dsv).  It will use d3.dsv (or shim) to parse delimiter separated  tabular formats (tab-seperator, common seperated, etc) retrieved using AngularJS' [$http](https://docs.angularjs.org/api/ng/service/$http).  For example:

```js
dsv.tsv({method: 'GET', url: '/someUrl'}, function(d) { return {key: d.key, value: +d.value}; })
    .success(function(data, status, headers, config) {
      // this callback will be called asynchronously
      // when the response is available
    })
    .error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
```


[Hypercubed/_F](https://github.com/Hypercubed/_F/) is simply global shortcut for composable d3 style accessors functions.  For example:

      | \_F                             | JS equivalent |
      | ------------------------------ | ------------- |
      | \_F('prop')                     | function(d) { return d.prop; } |
      | \_F('prop').eq(value)           | function(d) { return d.prop === value; } |
      | \_F('prop').gt(10).and().lt(20) | function(d) { return d.prop > 10 && d.prop < 20; } |

## Acknowledgments
This work was supported by a research grant from the Japanese Ministry of Education, Culture, Sports, Science and Technology (MEXT) to the RIKEN Center for Life Science Technologies.

## License
Copyright (c) 2014 Jayson Harshbarger

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
