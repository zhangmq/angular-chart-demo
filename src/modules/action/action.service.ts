import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'; 
import debug from 'debug';
import { createAction, Action } from './create-action';

const log = debug('dispatch');

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
    this.action$.next(action);
    log('type: %s\npayload: %O', action.type, action.payload);
  }
}