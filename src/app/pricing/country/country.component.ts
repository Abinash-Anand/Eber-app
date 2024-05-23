import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { json } from 'stream/consumers';
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrl: './country.component.css'
})
export class CountryComponent implements OnInit {
 constructor(private http: HttpClient){}
 ngOnInit(): void {
   
 }
}
