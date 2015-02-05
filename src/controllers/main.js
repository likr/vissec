angular.module('vissec')
  .config($stateProvider => {
    $stateProvider.state('main', {
      controller: 'MainController as main',
      resolve: {
        graph: ($http) => {
          return $http.get('data/graph.json')
            .then(response => {
              var data = response.data;
              var graph = egrid.core.graph.adjacencyList();
              data.nodes.forEach(node => {
                node.papers = node.papers.map(i => data.papers[i]);
                graph.addVertex(node);
              });
              data.links.forEach(link => {
                link.papers = link.papers.map(i => data.papers[i]);
                graph.addEdge(link.source, link.target, {
                  papers: link.papers
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
  .controller('PapersModalController', ($scope, $modalInstance, papers) => {
    $scope.papers = papers;

    $scope.close = () => {
      $modalInscance.close();
    };
  })
  .controller('MainController', class {
    constructor($modal, graph) {
      var wrapper = $('#display-wrapper');
      var vertexSizeScale = d3.scale.sqrt()
        .domain(d3.extent(graph.vertices(), u => graph.get(u).papers.length))
        .range([1, 3]);
      var edgeWidthScale = d3.scale.linear()
        .domain(d3.extent(graph.edges(), link => graph.get(link[0], link[1]).papers.length))
        .range([1, 10]);

      var renderer = egrid.core.egm()
        .vertexScale(node => vertexSizeScale(node.papers.length))
        .vertexText(node => `${node.text} (${node.papers.length})`)
        .vertexButtons([
          {
            icon: 'images/glyphicons-40-notes.png',
            onClick: d => {
              $modal.open({
                templateUrl: 'partials/papers.html',
                controller: 'PapersModalController',
                resolve: {
                  papers: () => d.papers
                }
              });
            }
          }
        ])
        .edgeWidth((u, v) => graph.get(u, v).papers.length)
        .edgeOpacity(() => 0.7)
        .edgeText((u, v) => `   (${graph.get(u, v).papers.length})`)
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
