import { chain, findIndex, differenceBy } from 'lodash';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Scheduler } from 'rxjs/rx';
import { easeLinear } from 'd3-ease';
import { timer } from 'd3-timer';
import { interpolate } from 'd3-interpolate';

@Injectable()
export class TransitionListService {
  private _list$;
  private _leaved$;
  private _identity;
  private _defaultStyle;
  private _mapper;
  private _duration = 500;
  private _ease = easeLinear;
  private _interpolate = interpolate;
  private _change$;
  
  start() {
    this._leaved$ = new BehaviorSubject({ key: null });
    this._list$ = new BehaviorSubject([]);
    this._change$ = this._list$
      .pairwise()
      .map(diff)
      .shareReplay(1)
      .concatMap(changes => Observable.from(changes));
  }

  keys() {
    return this._change$
      .map(change => keys => keys.filter(key => key !== change.key).concat(change.key))
      .merge(this._leaved$.map(leaved => keys => keys.filter(key => key !== leaved.key)))
      .scan((keys, action) => action(keys), [])
      .shareReplay(1);
  }

  item(key) {
    const item$ = this._change$
      .filter(change => change.key === key);
    
    const frameProxy$ = new BehaviorSubject(this._defaultStyle);
    const frame$ = item$
      .switchMap(item => {
        const from = frameProxy$.getValue();
        const { data, index } = item;
        const leaving = !data;
        const to = data ? this._mapper(data, index) : this._defaultStyle;
        const start = performance.now();
        //TODO: use Scheduler.animationFrame instead.
        const transition$ = Observable.create(observer => {
          const t = timer(elapsed => {
            if (elapsed > this._duration) {
              observer.next(1);
              observer.complete();
              t.stop();
              return;
            }

            observer.next(elapsed / this._duration);
          });
        })
        .map(this._ease)
        .map(this._interpolate(from, to))
        .concat(leaving ? Observable.of({ leaving: item }) : Observable.empty());

        return transition$;
      });
    

    return frame$
      .do(frame => {
        if (frame.leaving) {
          this._leaved$.next(frame.leaving);
        }
      })
      .filter(frame => !frame.leaving)
      .do(style => frameProxy$.next(style))
      .shareReplay(1);
    
    
  }

  key(identity) {
    this._identity = identity;
    return this;
  }

  toStyle(mapper) {
    this._mapper = mapper;
    return this;
  }

  defaultStyle(defaultStyle) {
    this._defaultStyle = defaultStyle;
    return this;
  }

  ease(ease) {
    this._ease = ease;
    return this;
  }

  duration(duration) {
    this._duration = duration;
    return this;
  }
  next(collection) {
    this._list$.next(collection.map((item, index) => ({
      key: this._identity(item),
      index,
      data: item,
    })));
  }
}

const diff = ([prev, next]) => 
  differenceBy(prev, next, item => item.key)
    .map(item => ({ ...item, data: null }))
    .concat(next);