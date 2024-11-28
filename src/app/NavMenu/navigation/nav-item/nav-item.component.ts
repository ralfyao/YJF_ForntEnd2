import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavigationItem } from 'src/app/Model/NavigationData'

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.css']
})
export class NavItemComponent implements OnInit {
  @Input() item: NavigationItem;
  @Output() targetId = new EventEmitter<string>();
  constructor(
    private router: Router
  ) { }
  ngOnInit(): void {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      const pathes = window.location.pathname.split('/');
      const target = pathes[pathes.length - 1];
      if (this.item.Code == target) {
        this.targetId.emit(`nav${this.item.Code}`)
      }

    });
    const pathes = window.location.pathname.split('/');
    const target = pathes[pathes.length - 1];
    if (this.item.Code == target) {
      this.targetId.emit(`nav${this.item.Code}`)
    }
  }

}
