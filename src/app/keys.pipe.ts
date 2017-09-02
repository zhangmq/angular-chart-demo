import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(value);
    if (!value) {
      return null;
    } 

    return Object.keys(value).map(key => ({ key, value: value[key]}));
  }

}
