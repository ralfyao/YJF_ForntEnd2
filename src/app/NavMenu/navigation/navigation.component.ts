import { Component, ElementRef, OnInit } from '@angular/core';
import { NavigationGroup, NavigationItem } from 'src/app/Model/NavigationData'
import { Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { Subject } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

@Component({
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  hiddenDelaySubject: Subject<any> = new Subject();
  constructor(
    private session: SessionStorageService,
    private router: Router) { }
  MenuIsHidden: boolean = true;
  LoginUserName: string = "";
  GroupList: Array<NavigationGroup> = new Array<NavigationGroup>();
  ngOnInit(): void {
    this.hiddenDelaySubject.pipe(
      delay(50),
      map((res) => {
        if (this.MenuIsHidden) this.MenuIsHidden = false;
        return res
      }),
      delay(5),
      tap(res => document.getElementById(res).scrollIntoView({ behavior: 'smooth', block: 'center' })
      )
    ).subscribe();
    this.LoginUserName = this.session.retrieve(LoginSessionEnum.Name);
    this.MenuIsHidden = true;
    this.SetMenu();
  }
  SetMenu() {
    const MenuList: Array<NavigationItem> = this.session.retrieve("menulist");
    let GroupNameList = Array.from(new Set(MenuList.map(item => item.GroupName)))
    for (let index = 0; index < GroupNameList.length; index++) {
      let groupitem: NavigationGroup = new NavigationGroup();
      const childrenList: Array<NavigationItem> = MenuList.filter(x => x.GroupName == GroupNameList[index]);
      if (childrenList.length > 0) {
        groupitem.Children = childrenList;
        groupitem.SYS_MenuGroupId = childrenList[0].GroupId;
        groupitem.GroupIcon = childrenList[0].GroupIcon;
        groupitem.GroupName = childrenList[0].GroupName;
        this.GroupList.push(groupitem);
      }


    }
  }
  MenuClick() {
    this.MenuIsHidden = !this.MenuIsHidden;
  }
  Logout() {
    this.session.clear();
    this.router.navigate(['']);
  }
  targetId(e: string) {
    this.hiddenDelaySubject.next(e);
  }
}
