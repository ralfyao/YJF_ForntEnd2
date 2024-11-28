import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-errorMessage',
  templateUrl: './errorMessage.component.html',
  styleUrls: ['./errorMessage.component.css']
})
export class ErrorMessageComponent implements OnInit {
  @Input() message: string = '';
  @Input() enable: boolean;
  constructor() { }

  ngOnInit() {
  }

}
