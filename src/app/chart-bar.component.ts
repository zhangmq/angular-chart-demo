import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ChartService } from './chart.service';
import { TransitionListService } from './transition-list.service';
@Component({
  selector: 'chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.css'],
  providers: [ TransitionListService ]
})
export class ChartBarComponent implements OnChanges{
  @Input() data;
  @Input() width = 600;
  @Input() height = 400;

  key = item => item.key;

  get transform() {
    return `translate(0, ${this.height})`
  }
  
  constructor(
    private transitionList: TransitionListService
  ) {
    this.transitionList
      .key(item => item.index)
      .defaultStyle({ offset: 0, value: 0 })
      .toStyle(item => ({ offset: item.index, value: item.value }))
      .duration(500)
      .start();

    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      console.log('changed', changes.data.currentValue);
      this.transitionList.next(changes.data.currentValue);
    }
  }
}
