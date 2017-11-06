import { Input, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TransitionListService } from '../transition-list.service';
import { easeLinear } from 'd3-ease';
import { scaleSequential, interpolateCubehelixDefault } from 'd3-scale';
import { pie } from 'd3-shape';

@Component({
  selector: 'chart-pie',
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.css'],
  providers: [ TransitionListService ]
})
export class ChartPieComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() width = 600;
  @Input() height = 400;
  selected = null;
  keys$;
  tracker = (_, key) => key;
  get transform() {
    return `translate(${this.width / 2}, ${this.height / 2})`;
  }

  constructor(
    private transitionList: TransitionListService
  ) {
    const selected = Math.min(this.width / 2, this.height / 2) - 20;
    const outerRadius = selected - 20;
    const innerRadius = outerRadius - 50;
    const color = scaleSequential(interpolateCubehelixDefault)
      .domain([0, 20]);

    this.transitionList
      .key(item => item.data.index)
      .defaultStyle((_, __, key) => ({
        startAngle: -Math.PI / 2,
        endAngle: -Math.PI / 2,
        innerRadius,
        outerRadius,
        opacity: 0,
        color: color(key),
      }))
      .leaveStyle((_, __, key) => ({
        startAngle: Math.PI / 2,
        endAngle: Math.PI / 2,
        innerRadius,
        outerRadius,
        opacity: 0,
        color: color(key),
      }))
      .toStyle((item, index, key) => ({
        ...item,
        innerRadius,
        outerRadius,
        opacity: 1,
        color: color(key),
      }))
      .duration(500)
      .ease(easeLinear)
      .start();
  }

  ngOnInit() {
    this.keys$ = this.transitionList.keys();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.transitionList.next(
        pie().startAngle(-Math.PI / 2).endAngle(Math.PI / 2).value(item => item.value)(changes.data.currentValue)
      );
    }
  }
}
