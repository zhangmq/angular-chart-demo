import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ActionService, createAction, Action } from '../modules/action';
import { ChartService } from './chart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ ChartService ],
})
export class AppComponent implements OnInit {
  constructor(
    private chart: ChartService
  ) {}

  ngOnInit() {
    this.chart.fetch();
  }
}
