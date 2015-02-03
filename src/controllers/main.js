angular.module('vissec')
  .config($stateProvider => {
    $stateProvider.state('main', {
      controller: 'MainController as main',
      resolve: {
        graph: ($http) => {
          return $http.get('data/graph.json')
            .then(response => {
              var graph = egrid.core.graph.adjacencyList();
              response.data.nodes.forEach(node => {
                graph.addVertex(node);
              });
              response.data.links.forEach(link => {
                graph.addEdge(link.source, link.target);
              });
              return graph;
            });
        }
      },
      templateUrl: 'partials/main.html',
      url: '/'
    });
  })
  .controller('MainController', class {
    constructor(graph) {
      var wrapper = $('#display-wrapper');
      var vertexSizeScale = d3.scale.sqrt()
        .domain(d3.extent(graph.vertices(), u => graph.get(u).titles.length))
        .range([2, 5]);

      var renderer = egrid.core.egm()
        .vertexScale(node => vertexSizeScale(node.titles.length))
        .vertexVisibility(node => node.titles.length > 1)
        .contentsMargin(10)
        .dagreRankDir('TB')
        .dagreEdgeSep(100)
        .dagreNodeSep(50)
        .dagreRankSep(100)
        .maxTextLength(30)
        .size([wrapper.width(), wrapper.height()]);
      var download = d3.downloadable({
        filename: 'vissec',
        width: wrapper.width(),
        height: wrapper.height()
      });
      var selection = d3.select('#display')
        .datum(graph)
        .call(renderer)
        .call(renderer.center())
        .call(download);

      d3.select(window)
        .on('resize', () => {
          download.width(wrapper.width());
          download.height(wrapper.height());
          selection
            .call(renderer.resize(wrapper.width(), wrapper.height()))
            .call(download);
        });
    }
  });
