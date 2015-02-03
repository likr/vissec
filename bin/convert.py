import csv
import json
import os.path


def main():
    basepath = os.path.dirname(os.path.abspath(__file__))
    reader = csv.reader(open(basepath + '/data.csv'))
    next(reader)

    nodes = set()
    links = set()
    titles = {}
    for row in reader:
        title = row[0]
        sections = [section.capitalize() for section in row[3:]
                    if not section.startswith('*')]
        for head, tail in zip(sections, sections[1:]):
            nodes.add(head)
            nodes.add(tail)
            links.add((head, tail))
            titles.setdefault(head, set()).add(title)
            titles.setdefault(tail, set()).add(title)

    indices = {}
    for i, node in enumerate(nodes):
        indices[node] = i
        titles[node] = list(titles[node])

    nodes = [{'text': node, 'titles': titles[node]} for node in nodes]
    links = [{'source': indices[head], 'target': indices[tail]}
             for head, tail in links]

    obj = {
        'nodes': nodes,
        'links': links,
    }

    json.dump(obj, open(basepath + '/../app/data/graph.json', 'w'))

if __name__ == '__main__':
    main()
