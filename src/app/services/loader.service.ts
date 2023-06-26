import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {

    public isLoading = new BehaviorSubject<boolean>(false);

    private REQ_COUNT: number;
    public get reqCount(): number {
        return this.REQ_COUNT;
    }
    public set reqCount(count: number){
        this.REQ_COUNT = count;
    }
    constructor() {
        this.REQ_COUNT = 0;
    }

    public show() {
            this.isLoading.next(true);
    }

    public hide() {
            this.isLoading.next(false);
    }

    public reqCountInc(): void {
        this.REQ_COUNT++;
        if (this.reqCount === 1) {
            this.show();
        }
    }

    public reqCountDec(): void {
        this.REQ_COUNT--;
        if (!this.reqCount) {
            this.hide();
        }
    }
}
