import { chain, findIndex, differenceBy } from 'lodash';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { animationFrame } from 'rxjs/scheduler/animationFrame';
import { easeLinear } from 'd3-ease';
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
  private _state;

  start() {
    this._list$ = new BehaviorSubject([]);
    this._state = this._list$
      .pairwise()
      .map(diff)
      //.scan(())
      
      /*.concatMap(changes => Observable.from(changes))
      
      .groupBy(change => change.key, change => change)
      .map(item$ => {
        console.log('group', item$);
        
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

        frame$.key = item$.key;
        
        return frame$
        .do(style => frameProxy$.next(style))
        
      });*/
  }

  get state() {
    return this._state;
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
    .map(item => ({ ...item, to: null }))
    .concat(next);