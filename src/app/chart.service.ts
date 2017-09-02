import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { 
  ActionService, 
  createAction, 
  bindActionCreator, 
  createActionTypes 
} from '../modules/action';

const actionTypes = createActionTypes('chart', [
  'FETCH',
  'FETCH_SUCC',
  'FETCH_FAIL',
]);

@Injectable()
export class ChartService {
  data$;
  error$;
  loading$;

  fetch;
  fetchSucc;
  fetchFail;

  constructor(
    private actionService: ActionService
  ) {
    this.fetch = bindActionCreator(actionService, actionTypes.FETCH);
    this.fetchSucc = bindActionCreator(actionService, actionTypes.FETCH_SUCC);
    this.fetchFail = bindActionCreator(actionService, actionTypes.FETCH_FAIL);

    // effect
    actionService
      .select(action => action.type === actionTypes.FETCH)
      .switchMap(() => Observable.of([Math.random()]).delay(500))
      .subscribe(data => this.fetchSucc(data));
    
    // state
    this.data$ = this.actionService
      .select(action => action.type === actionTypes.FETCH_SUCC)
      .map(action => action.payload)
      .startWith([]);
    
    this.error$ = this.actionService
    .select(action => action.type === actionTypes.FETCH_FAIL)
    .map(action => action.payload)
    .startWith(null);

    const loadingStart$ = this.actionService
      .select(action => action.type === actionTypes.FETCH);

    const loadingEnd$ = this.actionService
      .select(action => [actionTypes.FETCH_SUCC, actionTypes.FETCH_FAIL].includes(action.type));
  }
}