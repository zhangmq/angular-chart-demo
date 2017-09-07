import { Component, Input, OnInit } from '@angular/core';
import { arc } from 'd3-shape';
import { TransitionListService } from '../transition-list.service';

@Component({
  selector: '[chart-pie-item]',
  templateUrl: './chart-pie-item.component.html',
  styleUrls: ['./chart-pie-item.component.css'],
  providers: [  ]
})
export class ChartPieItemComponent implements OnInit {
  @Input() key;
  state$;
  state;
  constructor(
    private transitionList: TransitionListService
  ) {
  }

  ngOnInit() {
    this.state$ = this.transitionList.item(this.key)
      .filter(state => !!state)
      .map(state => ({
        d: arc()(state),
        opacity: state.opacity,
        color: state.color,
      }));
  }
}
