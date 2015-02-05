var $__build_47_vissec__ = (function() {
  "use strict";
  var __moduleName = "build/vissec";
  angular.module('vissec', ['ui.router', 'ui.bootstrap']);
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
            var data = response.data;
            var graph = egrid.core.graph.adjacencyList();
            data.nodes.forEach((function(node) {
              node.papers = node.papers.map((function(i) {
                return data.papers[i];
              }));
              graph.addVertex(node);
            }));
            data.links.forEach((function(link) {
              link.papers = link.papers.map((function(i) {
                return data.papers[i];
              }));
              graph.addEdge(link.source, link.target, {papers: link.papers});
            }));
            return graph;
          }));
        })},
      templateUrl: 'partials/main.html',
      url: '/'
    });
  })).controller('PapersModalController', (function($scope, $modalInstance, papers) {
    $scope.papers = papers;
    $scope.close = (function() {
      $modalInscance.close();
    });
  })).controller('MainController', (($traceurRuntime.createClass)(function($modal, graph) {
    var wrapper = $('#display-wrapper');
    var vertexSizeScale = d3.scale.sqrt().domain(d3.extent(graph.vertices(), (function(u) {
      return graph.get(u).papers.length;
    }))).range([1, 3]);
    var edgeWidthScale = d3.scale.linear().domain(d3.extent(graph.edges(), (function(link) {
      return graph.get(link[0], link[1]).papers.length;
    }))).range([1, 10]);
    var renderer = egrid.core.egm().vertexScale((function(node) {
      return vertexSizeScale(node.papers.length);
    })).vertexText((function(node) {
      return (node.text + " (" + node.papers.length + ")");
    })).vertexButtons([{
      icon: 'images/glyphicons-40-notes.png',
      onClick: (function(d) {
        $modal.open({
          templateUrl: 'partials/papers.html',
          controller: 'PapersModalController',
          resolve: {papers: (function() {
              return d.papers;
            })}
        });
      })
    }]).edgeWidth((function(u, v) {
      return graph.get(u, v).papers.length;
    })).edgeOpacity((function() {
      return 0.7;
    })).edgeText((function(u, v) {
      return ("   (" + graph.get(u, v).papers.length + ")");
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