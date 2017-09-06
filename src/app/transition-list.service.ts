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
  private _identity;
  private _defaultStyle;
  private _mapper;
  private _duration;
  private _ease;
  private _interpolate;
  private _change$;
  
  start() {
    this._list$ = new BehaviorSubject([]);
    this._change$ = this._list$
      .pairwise()
      .map(diff)
      .shareReplay(1)
      .concatMap(changes => Observable.from(changes));
  }

  keys() {
    return this._change$.scan((keys, item) => {
      return keys.filter(key => key !== item.key).concat(item.key);
    }, []);
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
        .map(easeLinear)
        .map(interpolate(from, to));

        return transition$;
      });

    return frame$.do(style => frameProxy$.next(style));
    
    /*return item$.switchMap(item => {
      //const from = this._defaultStyle;
      //const { data, index } = item;
      //const to = data ? this._mapper(data, index) : this._defaultStyle;
      return 
      
      const start = performance.now();
      return Observable
        .generate(
          0,
          t => t < 1,
          t => (performance.now() - start) / this._duration,
          t => t,
        ).observeOn(animationFrame);
    });
    
    const frameProxy$ = new BehaviorSubject(this._defaultStyle);
    const frame$ = item$.switchMap(item => {
      const from = frameProxy$.getValue();

      const { index, data } = item;
      const to = data ? this._mapper(data, index) : this._defaultStyle;
      const leaving = !to;
      const start = performance.now();
      return Observable
        .generate(
          0,
          t => t < 1,
          t => (performance.now() - start) / this._duration,
          t => t,
        )
        .concat(Observable.of(1))
        .observeOn(animationFrame)
        .map(easeLinear)
        .map(interpolate(from, to))
        .concat(leaving ? Observable.of(null) : Observable.empty())
        .takeUntil(item$);
    });
    
    return frame$
      .do(style => frameProxy$.next(style));*/
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
/*
  next(collection) {
    this._list$.next(collection.reduce((list, item, index) => ({
      ...list, 
      [this._identity(item)]: {
        index,
        data: item,
      }
    }), {}));
  }*/
}

/*
const diff = ([prev, next]) => {
  const leaving = Object.keys(prev).reduce((acc, key) => ({
    ...acc,
    [key]: {
      ...acc[key],
      data: null,
    }
  }), {});

  return Object.keys(next).reduce((acc, key) => ({
    ...acc,
    [key]: next[key],
  }), leaving);
}
*/

const diff = ([prev, next]) => 
  differenceBy(prev, next, item => item.key)
    .map(item => ({ ...item, data: null }))
    .concat(next);