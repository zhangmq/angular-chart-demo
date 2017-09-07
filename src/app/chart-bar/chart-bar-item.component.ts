import { Component, Input, OnInit } from '@angular/core';
import { TransitionListService } from '../transition-list.service';

@Component({
  selector: '[chart-bar-item]',
  templateUrl: './chart-bar-item.component.html',
  styleUrls: ['./chart-bar-item.component.css'],
  providers: [  ]
})
export class ChartBarItemComponent implements OnInit {
  @Input() key;
  state$;
  constructor(
    private transitionList: TransitionListService
  ) {
  }

  ngOnInit() {
    this.state$ = this.transitionList.item(this.key).filter(state => !!state);
  }
}
