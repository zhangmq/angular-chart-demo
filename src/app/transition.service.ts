import { findIndex } from 'lodash';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class TransitinService {
  create(
    identity,
    interpolator = null,
    easing = null,
    duration=500
  ) {
    const source$ = new BehaviorSubject([]);

    const onChange = data => source$.next(data);
    const transitins$ = source$
      .pairwise()
      .map(diffWith(identity))
      .flatMap(changes => Observable.from(changes));

    return {
      onChange,
      transitins$,
    }
  }
}

const diffWith = identity => ([prev, current]) => {
  const partitions = prev.reduce((acc, item) => {
    const [ enter, update, exit ] = acc;
    const index = findIndex(enter, o => identity(o) === identity(item));
    if (item < 0) {
      return [
        enter, 
        update, 
        [ ...exit, item]
      ]
    } else {
      const updated = enter[index];
      
      return [
        enter.slice(index, index + 1), 
        [ ...update, updated], 
        exit
      ];
    }
  }, [current, [], []]);

  return [
    ...partitions[0].map(item => item => ({ key: identity(item), type: 'enter', to: item })),
    ...partitions[0].map(item => item => ({ key: identity(item), type: 'update', to: item })),
    ...partitions[0].map(item => item => ({ key: identity(item), type: 'exit', to: null })),
  ]
}