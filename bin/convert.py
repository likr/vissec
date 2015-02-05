import csv
import json
import os.path


class Paper:
    def __init__(self, title, url, sections):
        self.title = title
        self.url = url
        self.sections = sections + ['References']


def main():
    basepath = os.path.dirname(os.path.abspath(__file__))
    reader = csv.reader(open(basepath + '/data.csv'))
    next(reader)
    papers = [Paper(row[0], row[1], [s.capitalize() for s in row[4:]])
              for row in reader]

    section_paper_indices = {}
    for i, paper in enumerate(papers):
        for section in paper.sections:
            section_paper_indices.setdefault(section, set()).add(i)

    for paper in papers:
        paper.sections = [s for s in paper.sections
                          if not s.startswith('*')
                          and len(section_paper_indices[s]) > 1]

    nodes = set()
    links = set()
    link_paper_indices = {}
    for i, paper in enumerate(papers):
        for section in paper.sections:
            nodes.add(section)
        for head, tail in zip(paper.sections, paper.sections[1:]):
            links.add((head, tail))
            link_paper_indices.setdefault((head, tail), set()).add(i)

    indices = {}
    for i, node in enumerate(nodes):
        indices[node] = i
        section_paper_indices[node] = list(section_paper_indices[node])
    for link in links:
        link_paper_indices[link] = list(link_paper_indices[link])

    nodes = [{'text': node, 'papers': section_paper_indices[node]}
             for node in nodes]
    links = [{'source': indices[link[0]], 'target': indices[link[1]],
              'papers': link_paper_indices[link]}
             for link in links]

    obj = {
        'nodes': nodes,
        'links': links,
        'papers': [{'title': p.title, 'url': p.url} for p in papers],
    }

    json.dump(obj, open(basepath + '/../app/data/graph.json', 'w'))

if __name__ == '__main__':
    main()
