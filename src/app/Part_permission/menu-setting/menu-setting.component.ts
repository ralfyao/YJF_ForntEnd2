import { DeleteMenuGroupRequest } from './../../../bin/deleteMenuGroupRequest';
import { Component, OnInit } from '@angular/core';
import { PermissionService } from 'src/app/Service/permission.service';
import { NavigationItem, NavigationGroup } from 'src/app/Model/NavigationData'
import { Page } from 'src/app/Model/PermissionData'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { UpdateMenuGroupRequest } from 'src/bin/updateMenuGroupRequest';
import { GetMenuRequest } from 'src/bin/getMenuRequest';
import { UpdateMenuRequest } from 'src/bin/updateMenuRequest';
import { of } from 'rxjs';
import { DeleteMenuRequest } from 'src/bin/deleteMenuRequest';
@Component({
  selector: 'app-menu-setting',
  templateUrl: './menu-setting.component.html',
  styleUrls: ['./menu-setting.component.css']
})
export class MenuSettingComponent implements OnInit {

  constructor(
    private rest: PermissionService,
    private modalService: NgbModal,
    private session: SessionStorageService,
    private spinnerService: NgxSpinnerService
  ) { }

  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount)

  MenuGroupList: Array<NavigationGroup> = new Array<NavigationGroup>();

  PageList: Array<Page> = new Array<Page>();
  MenuList: Array<NavigationItem> = new Array<NavigationItem>();
  MenuData: Array<NavigationItem> = new Array<NavigationItem>();

  SelectGroup: Array<NavigationGroup> = new Array<NavigationGroup>();

  GroupModalData: NavigationGroup = new NavigationGroup();
  MenuModalData: NavigationItem = new NavigationItem();
  ngOnInit(): void {
    this.GetDate().subscribe();
  }
  GetDate() {
    this.spinnerService.show();
    return this.rest.apiMenuData().pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.MenuGroupList = res.MenuGroupList;
        this.MenuList = res.MenuList;
        this.PageList = res.PageList;
      }),
      tap(() => {
        this.GroupSelected();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }),
      tap(() => {
        this.spinnerService.hide();
      })
    )
  }
  GroupSelected() {
    if (this.SelectGroup.length > 0) {
      this.MenuData = this.MenuList.filter(m => m.GroupId == this.SelectGroup[0].SYS_MenuGroupId);
    } else {
      this.MenuData = this.MenuList;
    }
  }

  GroupEdit(group: NavigationGroup, modal) {
    if (group == null) {
      group = new NavigationGroup();
    }
    this.GroupModalData = { ...group };
    this.openmodal(modal, '')
  }
  GroupDelete(DeleteGroupId: number) {
    this.spinnerService.show();
    const request: DeleteMenuGroupRequest = {
      Account: this.UserAccount,
      GroupId: DeleteGroupId
    }
    this.rest.apiDeleteMenuGroup(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
      }), switchMap(() => {
        return this.GetDate()
      }), switchMap(() => {
        return this.UpdateLeftMenu()
      }), catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }),
      tap(() => {
        this.rest.successMessage('刪除成功');
        this.spinnerService.hide();
      })
    ).subscribe();
  }
  GroupSave() {
    this.spinnerService.show();
    const request: UpdateMenuGroupRequest = {
      Account: this.UserAccount,
      UpdateGroup: this.GroupModalData
    }
    return this.rest.apiUpdateMenuGroup(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.rest.successMessage('儲存成功');
      }),
      switchMap(() => {
        return this.GetDate();
      }),
      switchMap(() => {
        return this.UpdateLeftMenu();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  MenuEdit(menu: NavigationItem, modal) {
    if (menu == null) {
      menu = new NavigationItem();
    }
    this.MenuModalData = { ...menu };
    this.openmodal(modal, '')
  }
  MenuDelete(DeleteMenuId) {
    this.spinnerService.show();
    const request: DeleteMenuRequest = {
      MenuId: DeleteMenuId,
      Account: this.UserAccount
    }
    this.rest.apiDeleteMenu(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
      }),
      switchMap(() => {
        return this.GetDate()
      }),
      switchMap(() => {
        return this.UpdateLeftMenu();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }),
      tap(() => {
        this.rest.successMessage('刪除成功');
        this.spinnerService.hide();
      })
    ).subscribe()
  }
  MenuSave() {
    this.spinnerService.show();
    const request: UpdateMenuRequest = {
      Account: this.UserAccount,
      UpdateMenu: this.MenuModalData
    }
    this.rest.apiUpdateMenu(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
      }), catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }), switchMap(() => {
        return this.GetDate();
      }), switchMap(() => {
        return this.UpdateLeftMenu();
      }), tap(() => {
        this.rest.successMessage('儲存成功');
      })
    ).subscribe();
  }
  UpdateLeftMenu() {
    this.spinnerService.show();
    const request: GetMenuRequest = {
      Account: this.UserAccount
    }
    return this.rest.apiGetMenu(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.session.store("MenuList", res.MenuList);
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }),
      tap(() => {
        this.spinnerService.hide();
      })
    )
  }
  openmodal(modal, size) {
    this.modalService.open(modal, { centered: true, size: size });
  }
}
