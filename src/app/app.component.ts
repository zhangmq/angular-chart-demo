import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ActionService, createAction, Action } from '../modules/action';
import { ChartService } from './chart.service';
import * as nodes from '../assets/nodes.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ ChartService ],
})
export class AppComponent implements OnInit, OnDestroy {
  // interval;
  data = {
    nodes,
    start: '13',
  };
  constructor(
    public chart: ChartService
  ) {}

  ngOnInit() {
    // benchmark
    // this.interval = setInterval(() => {
    //   this.chart.fetch();
    // }, 500);

    // normal
    this.chart.fetch();
    // this.chart.fetchAnother();
  }

  ngOnDestroy() {
    // if (this.interval) {
    //   clearInterval(this.interval);
    // }
  }
}
