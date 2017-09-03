import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ActionService, createAction, Action } from '../modules/action';
import { ChartService } from './chart.service';

@Component({
  selector: 'chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.css'],
})
export class ChartBarComponent {
  @Input() data;
  @Input() key;
  @Input() value;
  @Input() width = 600;
  @Input() height = 400;
  get transform() {
    return `translate(0, ${this.height})`
  }
  
  constructor() {}
}
