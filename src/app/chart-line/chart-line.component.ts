import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { animationFrame } from 'rxjs/scheduler/animationFrame';
import { line, curveCardinal } from 'd3-shape';
import { interpolatePath } from 'd3-interpolate-path';
import { easeLinear } from 'd3-ease';

@Component({
  selector: 'chart-line',
  templateUrl: './chart-line.component.html',
  styleUrls: ['./chart-line.component.css']
})
export class ChartLineComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() width = 600;
  @Input() height = 400;
  line$;
  private _data$;
  private _duration = 500;

  get transform() {
    return `translate(0, ${this.height})`;
  }

  constructor() {
    this._data$ = new BehaviorSubject([]);
  }

  ngOnInit() {
    const lineProxy$ = new BehaviorSubject(null);

    this.line$ = this._data$
      .map(line()
        .curve(curveCardinal.tension(0.8))
        .x(item => item.index * 6)
        .y(item => -item.value)
      )
      .switchMap(to => {
        const from = lineProxy$.getValue() || `M0,0 L${this.width},0`;
        const interpolate = interpolatePath(from, to);
        const start = performance.now();
        return Observable
          .of(0, animationFrame)
          .repeat()
          .map(() => (performance.now() - start) / this._duration)
          .takeWhile(t => t < 1)
          .concat(Observable.of(1))
          .map(easeLinear)
          .map(interpolate);
    })
    .do(path => lineProxy$.next(path));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this._data$.next(changes.data.currentValue);
    }
  }

}
