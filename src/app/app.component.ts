import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class AppComponent implements OnInit, OnDestroy {
  actions$: Observable<Action[]>;
  chart$: Observable<Array<number>>;

  private _actionSubscription: Subscription;

  constructor(
    private actionService: ActionService,
    private chartService: ChartService
  ) {
    
    this.actions$ = actionService
      .select(() => true)
      .scan((state, action) => [ action, ...state ], []);

    this.chart$ = chartService.data$;
  }

  ngOnInit() {
    this._actionSubscription = Observable.of(0).delay(0).subscribe(() => {
      this.actionService.dispatch(createAction('@app/init'));
    });
  }

  ngOnDestroy() {
    this._actionSubscription && this._actionSubscription.unsubscribe();
  }

  fetchChart() {
    this.actionService.dispatch(createAction('@chart/fetch'));
  }
}
