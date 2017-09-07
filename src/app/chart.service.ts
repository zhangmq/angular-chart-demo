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
  'FETCH_ANOTHER',
  'FETCH_ANOTHER_SUCC',
  'FETCH_ANOTHER_FAIL',
]);

@Injectable()
export class ChartService {
  data$;
  error$;
  loading$;

  data2$;
  error2$;
  loading2$;

  fetch;
  fetchSucc;
  fetchFail;
  fetchAnother;
  fetchAnotherSucc;
  fetchAnotherFail;

  constructor(
    private actionService: ActionService
  ) {
    this.fetch = bindActionCreator(actionService, actionTypes.FETCH);
    this.fetchSucc = bindActionCreator(actionService, actionTypes.FETCH_SUCC);
    this.fetchFail = bindActionCreator(actionService, actionTypes.FETCH_FAIL);

    this.fetchAnother = bindActionCreator(actionService, actionTypes.FETCH_ANOTHER);
    this.fetchAnotherSucc = bindActionCreator(actionService, actionTypes.FETCH_ANOTHER_SUCC);
    this.fetchAnotherFail = bindActionCreator(actionService, actionTypes.FETCH_ANOTHER_FAIL);

    const fetch$ = actionService
      .select(action => action.type === actionTypes.FETCH);

    const fetchSucc$ = actionService
      .select(action => action.type === actionTypes.FETCH_SUCC);

    const fetchFail$ = actionService
      .select(action => action.type === actionTypes.FETCH_FAIL);

    const fetchAnother$ = actionService
      .select(action => action.type === actionTypes.FETCH_ANOTHER);

    const fetchAnotherSucc$ = actionService
      .select(action => action.type === actionTypes.FETCH_ANOTHER_SUCC);

    const fetchAnotherFail$ = actionService
      .select(action => action.type === actionTypes.FETCH_ANOTHER_FAIL);

    // effect
    fetch$
      .switchMap(() => Observable.of(generateData(20)).delay(200))
      .subscribe(data => this.fetchSucc(data));

    fetchAnother$
      .switchMap(() => Observable.of(generateData(100, 50)).delay(200))
      .subscribe(data => this.fetchAnotherSucc(data));

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

    this.data2$ = fetchAnotherSucc$
    .map(action => action.payload)
    .startWith([]);

    this.error2$ = fetchAnother$
      .map(() => null)
      .merge(fetchAnotherFail$.map(action => action.payload))
      .startWith(null);

    this.loading2$ = fetchAnother$
      .map(() => true)
      .merge(fetchAnotherSucc$.merge(fetchFail$).map(() => false))
      .startWith(false);
  }
}

const generateData = (max, min = 5) => chain(new Array(max).fill(0))
  .map((_, index) => ({ index, value: (Math.random() * 100).toFixed(2) }))
  .shuffle()
  .take(Math.floor(5 + Math.random() * (max - 5)))
  .sort((a, b) => a.index - b.index)
  .value();
