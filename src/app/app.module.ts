import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {QuizMakerComponent} from './quiz-maker/quiz-maker.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuestionComponent } from './question/question.component';
import { AnswersComponent } from './answers/answers.component';
import { CategoriesParentNamePipe } from './pipes/categories-parent-name.pipe';
import {AutofilterDropdownComponent} from "./autofilter-dropdown/autofilter-dropdown.component";
import {HighlightPipe} from "./pipes/highlight.pipe";
import {HideByClickDirective} from "./directives/hide-by-click.directive";
import {LoadingLogoComponent} from "./loading-logo/loading-logo.component";
import {LoaderInterceptor} from "./interceptors/loader.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    QuizMakerComponent,
    QuizComponent,
    QuestionComponent,
    AnswersComponent,
    AutofilterDropdownComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        CategoriesParentNamePipe,
        HighlightPipe,
        HideByClickDirective,
        LoadingLogoComponent,
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
