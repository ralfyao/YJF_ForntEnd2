import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-digital-signage',
  templateUrl: './digital-signage.component.html',
  styleUrls: ['./digital-signage.component.css']
})
export class DigitalSignageComponent implements OnInit {
  FirstTitle:string = '標題欄1';
  FirstRow:string = '內容欄1';
  SecTitle:string = '標題欄2';
  SecRow:string = '內容欄2';
  ThridTitle:string = '標題欄3';
  ThridRow:string = '內容欄3';


  constructor() { }

  ngOnInit(): void {
  }

}
