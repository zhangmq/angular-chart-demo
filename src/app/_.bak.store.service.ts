import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/from';

export function createAction(type, payload = null) {
  return {
    type,
    payload,
  }
}

@Injectable()
export class ActionService {
  action$;
  
  constructor() {
    this.action$ = new BehaviorSubject(createAction('@action-service/init'));
  }

  select(selector) {
    return this.action$.filter(selector);
  }
  
  dispatch(action) {
    this.action$.next(action);
  }
}

@Injectable()
export class Chart1Service {
  changes$;

  constructor(actionService: ActionService) {
    this.changes$ = actionService
      .select(action => action.type === '@chart1/update')
      .map(action => action.payload)
      .startWith([])
      .pairwise()
      .map(diff)
      .shareReplay(1);
  }

  getItemKeys() {
    return this.changes$
      .map(changes => changes.map(change => change.key));
  }

  getItemChange(key) {
    return this.changes$
      .flatMap(changes => Observable.from(changes))
      .filter(change => change.key === key);
  }
}

const diff = ([prev, list]) => {
  
};

/*
function chart1(action$) {
  const diff$ = action$
    .filter(action => action.type === '@chart1/update')
    .pairwise()
  
  return {
    sinks: {
      list$
    },
    selectors: {

    }
  }
}*/