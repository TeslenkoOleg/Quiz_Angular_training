import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {

  transform(value: string = "", strToHighlight: string | null = ''): string {
      if (strToHighlight == null) {
          return value;
      }
      const index = value.toLowerCase().indexOf(strToHighlight.toLowerCase());
      if (index >= 0) {
        return value.substring(0, index) + '<b>'
          + value.substring(index, strToHighlight.length + index)
          + '</b>'
          + value.substring(strToHighlight.length + index);
      }
      return value;



  }

}
