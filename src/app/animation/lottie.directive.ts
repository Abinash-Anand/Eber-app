import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import lottie from 'lottie-web';

@Directive({
  selector: '[appLottie]'
})
export class LottieDirective implements OnInit {
  @Input('appLottie') options: any; // Bind the Input property correctly

  constructor(private el: ElementRef) {}

  ngOnInit() {
    lottie.loadAnimation({
      container: this.el.nativeElement,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: this.options.path // Use this.options instead of this.appLottie
    });
  }
}
