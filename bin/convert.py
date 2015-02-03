import csv
import json
import os.path


def main():
    basepath = os.path.dirname(os.path.abspath(__file__))
    reader = csv.reader(open(basepath + '/data.csv'))
    next(reader)

    nodes = set()
    links = set()
    for row in reader:
        for head, tail in zip(row[3:], row[4:]):
            nodes.add(head)
            nodes.add(tail)
            links.add((head, tail))

    indices = {}
    for i, node in enumerate(nodes):
        indices[node] = i

    nodes = [{'text': node} for node in nodes]
    links = [{'source': indices[head], 'target': indices[tail]}
             for head, tail in links]

    obj = {
        'nodes': nodes,
        'links': links,
    }

    json.dump(obj, open(basepath + '/../app/data/graph.json', 'w'))

if __name__ == '__main__':
    main()
