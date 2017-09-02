import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'; 
import { createAction, Action } from './create-action';

@Injectable()
export class ActionService {
  action$;
  
  constructor() {
    this.action$ = new BehaviorSubject(createAction('@action-pipe/init'));
  }

  select(condition: Function) {
    return this.action$.filter(condition);
  }
  
  dispatch(action: Action) {
    console.log('dispatch', window.performance.now(), action);
    this.action$.next(action);
  }
}