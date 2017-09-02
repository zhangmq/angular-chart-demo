import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ActionService, createAction, Action } from '../modules/action';
import { ChartService } from './chart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ ActionService, ChartService ],
})
export class AppComponent {
  constructor(
    private chartService: ChartService
  ) {}
}
