var $__build_47_vissec__ = (function() {
  "use strict";
  var __moduleName = "build/vissec";
  angular.module('vissec', ['ui.router']);
  angular.module('vissec').config((function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  }));
  return {};
})();
//# sourceURL=src/vissec.js
var $__build_47_controllers_47_main__ = (function() {
  "use strict";
  var __moduleName = "build/controllers/main";
  angular.module('vissec').config((function($stateProvider) {
    $stateProvider.state('main', {
      controller: 'MainController as main',
      resolve: {graph: (function($http) {
          return $http.get('data/graph.json').then((function(response) {
            var graph = egrid.core.graph.adjacencyList();
            response.data.nodes.forEach((function(node) {
              graph.addVertex(node);
            }));
            response.data.links.forEach((function(link) {
              graph.addEdge(link.source, link.target, {titles: link.titles});
            }));
            return graph;
          }));
        })},
      templateUrl: 'partials/main.html',
      url: '/'
    });
  })).controller('MainController', (($traceurRuntime.createClass)(function(graph) {
    var wrapper = $('#display-wrapper');
    var vertexSizeScale = d3.scale.sqrt().domain(d3.extent(graph.vertices(), (function(u) {
      return graph.get(u).titles.length;
    }))).range([1, 3]);
    var edgeWidthScale = d3.scale.linear().domain(d3.extent(graph.edges(), (function(link) {
      return graph.get(link[0], link[1]).titles.length;
    }))).range([1, 10]);
    var renderer = egrid.core.egm().vertexScale((function(node) {
      return vertexSizeScale(node.titles.length);
    })).vertexText((function(node) {
      return (node.text + " (" + node.titles.length + ")");
    })).edgeWidth((function(u, v) {
      return graph.get(u, v).titles.length;
    })).edgeOpacity((function() {
      return 0.7;
    })).edgeText((function(u, v) {
      return ("   (" + graph.get(u, v).titles.length + ")");
    })).contentsMargin(10).dagreRankDir('TB').dagreEdgeSep(100).dagreNodeSep(50).dagreRankSep(100).size([wrapper.width(), wrapper.height()]);
    var download = d3.downloadable({
      filename: 'vissec',
      width: wrapper.width(),
      height: wrapper.height()
    });
    var selection = d3.select('#display').datum(graph).call(renderer).call(renderer.center()).call(download);
    d3.select(window).on('resize', (function() {
      download.width(wrapper.width());
      download.height(wrapper.height());
      selection.call(renderer.resize(wrapper.width(), wrapper.height())).call(download);
    }));
  }, {}, {})));
  return {};
})();
//# sourceURL=src/controllers/main.js