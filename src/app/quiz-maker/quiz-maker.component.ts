import {Component} from '@angular/core';
import {Category, Difficulty, ISelectData, ISubCategory, Question} from '../data.models';
import {combineLatest, map, Observable, of, retry, Subject, tap} from 'rxjs';
import {QuizService} from '../services/quiz.service';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent {

  categories$: Observable<Category[]>;
  currentCategory$ = new Subject<Category>();
  subcategories$: Observable<ISubCategory[]>;
  questions$!: Observable<Question[]>;

  /// for saving selected category and subcategory
  selectedCategory!: Category;
  selectedSubCategory!: ISubCategory | null;

  // for saving selected difficulty and quiz category id for getting new questions via API
  selectedDifficulty!: ISelectData | null;
  selectedQuizCategoryId!: string;

  // for changing question
  updatedQuestion$!: Observable<Question[]>;

  // hide subcategory dropdown until category isn't selected
  hiddenSubCategory: boolean = true;

  // for defining set for subcategories automatically
  includeSubCategory = new Set<string>();
  quizDifficulties$: Observable<ISelectData[]>;
  oldQuestions: Question[] = [];

  hideUpdateQuestionTemplate: boolean = false;

  constructor(protected quizService: QuizService) {
    // get difficulties from service and convert to observable
    this.quizDifficulties$ = of(this.quizService.getDifficulties());
    // get categories
    this.categories$ = quizService.getAllCategories().pipe(
      map((categories: Category[]) => this.removeSubCategories(categories)),
    )
    // get subcategories for selected category
    this.subcategories$ = combineLatest([this.currentCategory$.asObservable(), quizService.getAllCategories()]).pipe(
      map(([currentCategory, categories]: [Category, Category[]]) : ISubCategory[] =>
        this.getSubcategories(currentCategory, categories)
      ));
  }

  createQuiz(): void {
    this.hideUpdateQuestionTemplate = false;

    this.selectedQuizCategoryId = ''+(this.selectedSubCategory ? this.selectedSubCategory.id : this.selectedCategory ? this.selectedCategory.id : '');
    this.questions$ = this.quizService.createQuiz(this.selectedQuizCategoryId, this.selectedDifficulty?.name as Difficulty)
      .pipe(
        tap((questions: Question[]) => {
          this.oldQuestions = questions;
        })
      );
  }
  updateCategory(category: Category) {
    this.selectedCategory = category;

    this.selectedSubCategory = null;

    this.currentCategory$.next(category);
  }
  getSubcategories(currentCategory: Category, categories: Category[]): ISubCategory[] {
    const currentParentCategory = currentCategory.name.split(':')[0].trim();
    // hide subcategory dropdown if parent category has no subcategories
    this.hiddenSubCategory = !this.includeSubCategory.has(currentParentCategory);

    return categories.reduce((acc: ISubCategory[], cat: Category) => {
      const splitCat = cat.name.split(':');
      if (splitCat.length > 1) {

        const parentCat = splitCat[0].trim();
        const subCat = splitCat[1].trim();

        if (currentParentCategory === parentCat){
          acc.push({id: cat.id, name: subCat, parentCategory: cat.name});
        }
      }
      return acc;
    }, []);
  }

  removeSubCategories(categories: Category[]): Category[] {
    let uniqueSet = new Set();
    return categories.reduce((newArr: Category[], category: Category) => {
      const parentName = category.name.split(':')[0].trim();

      if (!uniqueSet.has(parentName)) {
        uniqueSet.add(parentName);
        newArr.push({id: category.id, name: parentName});
      } else {
        this.includeSubCategory.add(parentName); // define a set of categories that have subcategories
      }

      return newArr;
    }, []);
  }
  onChangeQuestion(event: any): void {
    let questionToChange = event;
    this.hideUpdateQuestionTemplate = true;
    // get updated questions
    this.updatedQuestion$ = this.quizService.createQuiz(this.selectedQuizCategoryId, this.selectedDifficulty?.name as Difficulty)
      .pipe(
        map((newQuestions) => {
          const currentIndex = this.oldQuestions.findIndex((question) => question.question === questionToChange.question);
          this.oldQuestions[currentIndex] = this.prepareRandomQuestion(questionToChange, newQuestions);
          return this.oldQuestions;
        }
      ),
        retry(3), // Number of retries if error occurs
      );
  }

  prepareRandomQuestion(questionToChange: Question, newQuestions: Question[]): Question {

    const randomIndex = Math.floor(Math.random() * newQuestions.length);
    let randomQuestion = newQuestions[randomIndex];

    let questionAlreadyExists = this.oldQuestions.find(question => question.question === randomQuestion.question);

    while (questionAlreadyExists) {
      const randomIndex = Math.floor(Math.random() * newQuestions.length);
      randomQuestion = newQuestions[randomIndex];
      questionAlreadyExists = this.oldQuestions.find(question => question.question === randomQuestion.question);
      if (questionAlreadyExists) {
        newQuestions.splice(randomIndex, 1);
      }
      if (newQuestions.length === 0) {
        break;
      }
    }

    if (newQuestions.length === 0) {
      // Handle the case when newQuestions is empty
      // resetting the quiz by calling createQuiz again
      throw new Error('No new questions available'); // Throw an error if newQuestions is empty
    }

    return randomQuestion;
  }

}
