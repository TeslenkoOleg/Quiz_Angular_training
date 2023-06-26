import { Pipe, PipeTransform } from '@angular/core';
import {Category} from "../data.models";

@Pipe({
  name: 'categoriesParentName',
  standalone: true
})
export class CategoriesParentNamePipe implements PipeTransform {

  transform(categories: Category[] | null): Category[] | null {
    if (!categories) {
      return null;
    }
    let uniqueSet = new Set();
    return categories.reduce((newArr: Category[], category: Category) => {
      const parentName = category.name.split(':')[0].trim();

      if (!uniqueSet.has(parentName)) {
        uniqueSet.add(parentName);

        newArr.push({id: category.id, name: parentName});
      }
      return newArr;
    }, []);
  }

}
