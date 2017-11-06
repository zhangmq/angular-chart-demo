import { Component, OnInit, Input } from '@angular/core';
import * as fromTypes from '../types';

@Component({
  selector: '[diagram-pipeline-link]',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {
  @Input() link: fromTypes.Link;
  d: string;
  constructor() {
  }

  ngOnInit() {
    const { x1, y1, x2, y2, radius } = this.link;
    if (y1 === y2) {
      this.d = `M${x1} ${y1} L${x2} ${y2}`;
      return;
    }

    this.d = radiusCornerLink(x1, y1, x2, y2, radius);
  }
}

const radiusCornerLink = (x1, y1, x2, y2, r) => {
  const interpolateX = interpolate(x1, x2);
  const turningX = y2 > y1 ? interpolateX(0.6) : interpolateX(0.4);

  const qx1 = x2 > x1 ? turningX - r : turningX + r;
  const qx2 = x2 > x1 ? turningX + r : turningX - r;

  const qy1 = y2 > y1 ? y1 + r : y1 - r;
  const qy2 = y2 < y1 ? y2 + r : y2 - r;

  return `M${x1} ${y1} L${qx1} ${y1}
          Q${turningX} ${y1}, ${turningX} ${qy1} L${turningX} ${qy2}
          Q${turningX} ${y2}, ${qx2} ${y2} L${x2} ${y2}`;
 };

 const interpolate = (a, b) => t => (1 - t) * a + b * t;

