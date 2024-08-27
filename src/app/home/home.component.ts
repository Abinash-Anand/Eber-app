import { Component } from '@angular/core';
// import {animation} from '../../assets/icons/animation'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
   lottieOptions = {
    path:  '../../assets/icons/animation.json'         // URL to your JSON file
  };

}
