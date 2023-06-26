import {Component} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LoaderService} from "../services/loader.service";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-loading-logo',
  templateUrl: './loading-logo.component.html',
  styleUrls: ['./loading-logo.component.scss'],
  imports: [
    CommonModule
  ],
  standalone: true
})
export class LoadingLogoComponent {

  public isLoading: BehaviorSubject<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading;
  }

}
