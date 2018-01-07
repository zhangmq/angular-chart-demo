import { Input, Component, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { easeLinear } from 'd3-ease';
import { scaleSequential, interpolateCubehelixDefault } from 'd3-scale';
import { arc, pie } from 'd3-shape';
import { differenceBy } from 'lodash';

@Component({
  selector: 'chart-pie2',
  templateUrl: './chart-pie2.component.html',
})
export class ChartPie2Component implements OnChanges {
  @Input() data;
  @Input() width = 600;
  @Input() height = 400;
  data$;
  selected$;
  arcs$;
  keys$;
  tracker = (_, arc) => {
    return arc.id;
  }
  get transform() {
    return `translate(${this.width / 2}, ${this.height})`;
  }

  constructor() {
    const selectedRadius = Math.min(this.width / 2, this.height);
    const outerRadius = selectedRadius - 20;
    const innerRadius = 120;
    const color = scaleSequential(interpolateCubehelixDefault)
      .domain([0, 20]);
    this.data$ = new BehaviorSubject([]);
    this.selected$ = new BehaviorSubject(null);

    const pies$ = this.data$.filter(data => data.length).map(
      pie().value(item => item.value).startAngle(-Math.PI / 2).endAngle(Math.PI / 2)
    );

    this.arcs$ = Observable
      .combineLatest(
        pies$,
        this.selected$,
        (pies: any[], selected) => {
          console.log(selected);
          return pies.map(pie => {
            return {
              ...pie,
              innerRadius,
              outerRadius: selected === pie.data.index ? selectedRadius : outerRadius
            };
          });
        }
      )
      .map(items => items.map(item => {
        return {
          d: arc()(item),
          id: item.data.index,
          color: color(item.data.index),
          title: `Title ${item.data.value}`,
        };
      }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      console.log(changes.data);
      this.data$.next(changes.data.currentValue);
      this.selected$.next(null);
    }
  }

  onSelect(id) {
    console.log('selected', id);
    this.selected$.next(id);
  }
}

/*
function diff([prev, next]) {
  return differenceBy(prev, next, (item: any) => item.key)
    .map(item => ({ ...item, data: null }))
    .concat(next);
}*/
