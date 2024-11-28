import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NavigationGroup } from 'src/app/Model/NavigationData'
@Component({
  selector: 'app-nav-group',
  templateUrl: './nav-group.component.html',
  styleUrls: ['./nav-group.component.css']
})
export class NavGroupComponent implements OnInit {
  @Input() group: NavigationGroup;
  @Output() targetId = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }
  GroupClick() {
    this.group.IsHidden = !this.group.IsHidden;
  }
}
