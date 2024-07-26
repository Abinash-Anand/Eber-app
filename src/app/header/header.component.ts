import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  lottieOptions = {
    path:  '../../assets/icons/animation2.json'         // URL to your JSON file
  };
}
