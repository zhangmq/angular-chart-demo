import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActionService } from '../action';

@Injectable()
export class PieService {
  constructor(actionPipeService: ActionService) {
  }
}