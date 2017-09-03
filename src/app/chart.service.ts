import { chain } from 'lodash';
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

    const fetch$ = actionService
      .select(action => action.type === actionTypes.FETCH);

    const fetchSucc$ = actionService
      .select(action => action.type === actionTypes.FETCH_SUCC);
    
    const fetchFail$ = actionService
      .select(action => action.type === actionTypes.FETCH_FAIL);

    // effect
    fetch$    
      .switchMap(() => Observable.of(generateData(20)).delay(200))
      .subscribe(data => this.fetchSucc(data));
    
    // state
    this.data$ = fetchSucc$
      .map(action => action.payload)
      .startWith([]);
    
    this.error$ = fetch$
      .map(() => null)
      .merge(fetchFail$.map(action => action.payload))
      .startWith(null);
      
    this.loading$ = fetch$
      .map(() => true)
      .merge(fetchSucc$.merge(fetchFail$).map(() => false))
      .startWith(false);
  }
}

const generateData = max => chain(new Array(max).fill(0))
  .map((_, index) => ({ index, value: (Math.random() * 100).toFixed(2) }))
  .shuffle()
  .take(Math.floor(Math.random() * max))
  .sort((a, b) => a.index - b.index)
  .value();