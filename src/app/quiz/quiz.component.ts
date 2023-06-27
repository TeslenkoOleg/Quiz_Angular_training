import {Component, inject, Input, TemplateRef} from '@angular/core';
import {Question} from '../data.models';
import {QuizService} from '../services/quiz.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  @Input()
  questions: Question[] | null = [];

  @Input()
  public set newQuestion(questions: Question[] | null) {
    if (this.questions && questions){
      this.questions = questions;
    }
  }

  @Input() updateQuestionTemplate!: TemplateRef<any>;

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);
  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl("/result");
  }
  trackFn(index: number): number {
    return index;
  }

}
