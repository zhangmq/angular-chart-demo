import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActionService, createAction } from '../modules/action';

@Injectable()
export class ChartService {
  data$;
  error$;
  loading$;

  constructor(
    private actionService: ActionService) {
    
    // effect
    actionService
      .select(action => action.type === '@chart/fetch')
      .switchMap(() => Observable.of([Math.random()]).delay(2000))
      .subscribe(data => actionService.dispatch(createAction('@chart/fetch_succ', data)));
    
    // state
    this.data$ = this.actionService
      .select(action => action.type === '@chart/fetch_succ')
      .map(action => action.payload)
      .startWith([]);
    
    this.error$ = this.actionService
    .select(action => action.type === '@chart/fetch_fail')
    .map(action => action.payload)
    .startWith(null);

    const loadingStart$ = this.actionService
      .select(action => action.type === '@chart/fetch');

    const loadingEnd$ = this.actionService
      .select(action => ['@chart/fetch_succ', '@chart/fetch_fail'].includes(action.type));
  }
}