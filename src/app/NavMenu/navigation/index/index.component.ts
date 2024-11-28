import { Component, OnInit } from '@angular/core';
import { NavigationGroup, NavigationItem } from 'src/app/Model/NavigationData'
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(
    private session: SessionStorageService,
  ) { }
  GroupList: Array<NavigationGroup> = new Array<NavigationGroup>();
  ngOnInit(): void {
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
}
