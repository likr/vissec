import csv
import json
import os.path


def main():
    basepath = os.path.dirname(os.path.abspath(__file__))
    reader = csv.reader(open(basepath + '/data.csv'))
    data = list(reader)[1:]

    nodeTitles = {}
    for row in data:
        title = row[0]
        for section in row[3:]:
            if not section.startswith('*'):
                nodeTitles.setdefault(section.capitalize(), set()).add(title)
    validNodes = set(node for node in nodeTitles if len(nodeTitles[node]) > 1)

    nodes = set()
    links = set()
    linkTitles = {}
    for row in data:
        title = row[0]
        sections = [section.capitalize() for section in row[3:]
                    if section.capitalize() in validNodes]
        sections.append('References')
        nodeTitles.setdefault('References', set()).add(title)
        for head, tail in zip(sections, sections[1:]):
            nodes.add(head)
            nodes.add(tail)
            links.add((head, tail))
            linkTitles.setdefault((head, tail), set()).add(title)

    indices = {}
    for i, node in enumerate(nodes):
        indices[node] = i
        nodeTitles[node] = list(nodeTitles[node])
    for link in links:
        linkTitles[link] = list(linkTitles[link])

    nodes = [{'text': node, 'titles': nodeTitles[node]} for node in nodes]
    links = [{'source': indices[head], 'target': indices[tail],
              'titles': linkTitles[(head, tail)]} for head, tail in links]

    obj = {
        'nodes': nodes,
        'links': links,
    }

    json.dump(obj, open(basepath + '/../app/data/graph.json', 'w'))

if __name__ == '__main__':
    main()
