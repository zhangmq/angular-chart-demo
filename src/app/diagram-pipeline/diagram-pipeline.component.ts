import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import * as fromTypes from './types';

@Component({
  selector: 'diagram-pipeline',
  templateUrl: './diagram-pipeline.component.html',
  styleUrls: ['./diagram-pipeline.component.css']
})
export class DiagramPipelineComponent implements OnInit {
  @Input() gridX: number;
  @Input() gridY: number;
  @Input() data;
  @Input() width: number;
  @Input() height: number;
  links: fromTypes.Link[];
  nodes: any[];
  transform = `translate(50, 100)`;
  constructor() {

  }

  ngOnInit() {
    const entities = this.data.nodes.reduce((prev, item) => ({
      ...prev,
      [item.id]: item,
    }), {});
    const { nodes, links } = buildState(entities, this.data.start);
    this.links = links.map(([from, to]): fromTypes.Link => ({
      x1: from.x * this.gridX,
      y1: from.y * this.gridY,
      x2: to.x * this.gridX,
      y2: to.y * this.gridY,
      radius: 16,
    }));
    this.nodes = nodes.map(node => ({
      displayName: node.type === 'stage' ? entities[node.id].displayName : node.type,
      r: [ 'begin', 'end' ].includes(node.type) ? 16 : 24,
      cx: node.x * this.gridX,
      cy: node.y * this.gridY,
      children: node.children ? node.children.map(child => ({
        displayName: entities[child.id].displayName,
        r: 24,
        cx: child.x * this.gridX,
        cy: child.y * this.gridY,
      })) : undefined
    }));
  }
}

export interface Node {
  type: 'begin' | 'end' | 'stage' | 'branch';
  x?: number;
  y?: number;
  id?: string;
  children?: Node[];
}

export interface State {
  nodes: Node[];
  links: [ Node, Node ][];
}

const buildState = (entities, start): State => {
  const begin: Node = { type: 'begin', x: 0, y: 0 };
  const end: Node = { type: 'end', y: 0 };

  const populate = (id, x): Node => {
    const entity = entities[id];

    if (entity.edges.length > 1) {
      const children = entity.edges.map((edge, y): Node => ({
        type: 'branch',
        id: edge.id,
        x,
        y,
      }));
    }

    const children = entity.edges.length > 1
      ? entity.edges.map((edge, y): Node => ({
        type: 'branch',
        id: edge.id,
        x,
        y,
      }))
      : undefined;

    return {
      type: 'stage',
      id,
      x,
      y: 0,
      children
    };
  };

  const next = (id) => {
    const entity = entities[id];
    if (entity.edges.length === 0) {
      return null;
    }

    const edge: any = _.head(entity.edges);

    if (entity.edges.length === 1) {
      return edge.id;
    }

    return next(edge.id);
  };

  const travel = ({ nodes, links }: State, id: string) => {
    const stage = id ? populate(id, nodes.length) : { ...end, x: nodes.length };
    const prev = _.last(nodes);

    const newState = {
      nodes: [ ...nodes, stage ],
      links: [
        ...links,
        ...createLinks(!prev.children ? [ prev ] : [], !stage.children ? [ stage ] : []),
        ...createLinks(prev.children || [], [ stage ]),
        ...createLinks([ prev ], stage.children || [])
      ]
    };

    return stage.type === 'end' ? newState : travel(newState, next(id));
  };

  return travel({ nodes: [ begin ], links: [] }, start);
};

const createLinks = (froms, tos) =>
  _.flatMap(froms, from => tos.map(to => [ from, to ]));
