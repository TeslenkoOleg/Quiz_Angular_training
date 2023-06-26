import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {DropdownOption} from "../data.models";

@Component({
  selector: 'app-autofilter-dropdown',
  templateUrl: './autofilter-dropdown.component.html',
  styleUrls: ['./autofilter-dropdown.component.css']
})
export class AutofilterDropdownComponent<T extends DropdownOption> implements OnInit, AfterViewInit {

  @Input()
  entries$!: Observable<T[]>;

  @Input()
  placeholder!: string;

  @Input()
  set selection(entry: T | null) {
    if (entry) {
      this.entryControl.setValue(entry.name);
    } else {
      this.entryControl.setValue('');
    }
  }

  @Output()
  selectionChange = new EventEmitter<T>();

  filteredEntries$!: Observable<T[]>;
  entryControl = new FormControl();

  ngOnInit() {
    this.filteredEntries$ = combineLatest([this.entryControl.valueChanges, this.entries$]).pipe(
      map(([userInput, entries]) =>
         userInput ? entries.filter(c => c.name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1): entries));
  }

  /**
   If you want to show dropdown list before entering words in the input field
   you should use afterViewInit for triggering observable by setting the "this.entryControl" value
   */
  ngAfterViewInit() {
    // use setTimeout for fixing error: ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.entryControl.setValue('');
    }, 0);
  }

  newSelection(entry: T) {
    this.entryControl.setValue(entry.name);
    this.selectionChange.emit(entry);
  }
}
