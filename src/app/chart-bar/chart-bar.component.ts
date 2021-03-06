import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { easeBounceInOut, easeQuadInOut } from 'd3-ease';
import { TransitionListService } from '../transition-list.service';

@Component({
  selector: 'chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.css'],
  providers: [ TransitionListService ],
})
export class ChartBarComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() width = 600;
  @Input() height = 400;
  keys$;
  tracker = (_, key) => key;

  get transform() {
    return `translate(0, ${this.height})`;
  }

  constructor(
    private transitionList: TransitionListService
  ) {
    this.transitionList
      .key(item => item.index)
      .defaultStyle(() => ({ offset: 0, value: 100, opacity: 0 }))
      .leaveStyle(() => ({ offset: 20, value: 0, opacity: 0 }))
      .toStyle((item, index) => ({ offset: index, value: item.value, opacity: 1 }))
      .duration(500)
      .ease(easeQuadInOut)
      .start();
  }

  ngOnInit() {
    this.keys$ = this.transitionList.keys();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.transitionList.next(changes.data.currentValue);
    }
  }
}
