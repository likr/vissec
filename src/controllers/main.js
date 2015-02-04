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
                graph.addEdge(link.source, link.target, {
                  titles: link.titles
                });
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
        .range([1, 3]);
      var edgeWidthScale = d3.scale.linear()
        .domain(d3.extent(graph.edges(), link => graph.get(link[0], link[1]).titles.length))
        .range([1, 10]);

      var renderer = egrid.core.egm()
        .vertexScale(node => vertexSizeScale(node.titles.length))
        .vertexText(node => `${node.text} (${node.titles.length})`)
        .edgeWidth((u, v) => graph.get(u, v).titles.length)
        .edgeOpacity(() => 0.7)
        .edgeText((u, v) => `   (${graph.get(u, v).titles.length})`)
        .contentsMargin(10)
        .dagreRankDir('TB')
        .dagreEdgeSep(100)
        .dagreNodeSep(50)
        .dagreRankSep(100)
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
