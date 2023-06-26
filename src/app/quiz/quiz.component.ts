import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Question} from '../data.models';
import {QuizService} from '../services/quiz.service';
import {Router} from '@angular/router';
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  @Input()
  questions: Question[] | null = [];

  @Input()
  changeQuestionIndex!: Subject<Question>;
  @Input()
  public set newQuestion(questions: Question[] | null) {
    if (this.questions && questions){
      this.questions = questions;
    }
  }
  @Output() changeQuestionEmitter = new EventEmitter<Question>();

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);
  updatedQuestionIndex!: Question;
  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }
  changeQuestion(questionIndex: Question): void {
    if (this.changeQuestionIndex){
      this.updatedQuestionIndex = questionIndex;
      this.changeQuestionIndex.next(questionIndex);
      this.changeQuestionEmitter.emit(questionIndex);
    }
  }
  trackFn(index: number, item: Question): number {
    return index;
  }

}
