import {Directive, ElementRef, HostListener, inject, Renderer2} from '@angular/core';

@Directive({
  selector: '[appHideByClick]',
  standalone: true
})
export class HideByClickDirective {
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);

  @HostListener('click', ['$event.target'])
  onClick(target: EventTarget) {

    const buttons = Array.from(this.elementRef.nativeElement.querySelectorAll('button.change-button'));

    const isButtonClick = buttons.some((button: any) => button === target || button.contains(target as Node));

    if (isButtonClick) {
      buttons.forEach((button: any) => this.renderer.setStyle(button, 'display', 'none'));
    }
  }

}
