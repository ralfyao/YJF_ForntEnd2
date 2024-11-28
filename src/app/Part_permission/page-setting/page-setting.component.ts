import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { PermissionService } from 'src/app/Service/permission.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Page } from 'src/app/Model/PermissionData'
import { catchError, tap } from 'rxjs/operators';
import { UpdatePageRequest } from 'src/bin/updatePageRequest';
import { DeletePageRequest } from 'src/bin/deletePageRequest';
import { of } from 'rxjs';
@Component({
  selector: 'app-page-setting',
  templateUrl: './page-setting.component.html',
  styleUrls: ['./page-setting.component.css']
})
export class PageSettingComponent implements OnInit {

  constructor(
    private rest: PermissionService,
    private modalService: NgbModal,
    private session: SessionStorageService,
    private spinnerService: NgxSpinnerService
  ) { }


  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount)
  PageDate: Array<Page> = new Array<Page>();


  PageModalData: UpdatePageRequest = {
    updatePage: {
      SYS_PageId: 0,
      PageUrl: '',
      PageLocation: '',
      IsMain: false,
      MainPage: 0
    },
    Account: this.UserAccount
  };

  ngOnInit(): void {
    this.GetDate().subscribe();
  }
  GetDate() {
    this.spinnerService.show();
    return this.rest.apiPageData().pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.PageDate = res.PageList;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }
  PageEdit(page: UpdatePageRequest, modal) {
    this.PageModalData = { ...page, Account: this.UserAccount };
    this.openmodal(modal, '')
  }
  PageDelete(DeletePageId: number) {
    this.spinnerService.show();
    const request: DeletePageRequest = {
      Account: this.UserAccount,
      PageId: DeletePageId
    }
    this.rest.apiDeletePage(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.rest.successMessage('刪除成功');
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  PageSave() {
    this.spinnerService.show();
    console.log(this.PageModalData)
    this.rest.apiUpdatePage(this.PageModalData).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.spinnerService.hide();
        this.rest.successMessage('儲存成功');
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  openmodal(modal, size) {
    this.modalService.open(modal, { centered: true, size: size });
  }
}
