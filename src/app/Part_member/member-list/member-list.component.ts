import { Component, Inject, OnInit, Input } from '@angular/core';
import { MemberManageService } from 'src/app/Service/member-manage.service';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { PermissionService } from 'src/app/Service/permission.service';
import { SinglePermissionPerson } from 'src/app/Model/vo';
import { NgxSpinnerService } from 'ngx-spinner';
import { PostMemberListRequest } from 'src/bin/postMemberListRequest';
import { concatMap, tap } from 'rxjs/operators';
import { PostMemberListResponseAccountManagements } from 'src/bin/postMemberListResponseAccountManagements';
import { PostUpdateMemberStatusRequest } from 'src/bin/postUpdateMemberStatusRequest';
import { PostMemberListResponse } from 'src/bin/postMemberListResponse';


@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  providers: [MemberManageService]
})

export class MemberListComponent implements OnInit {
  memberlist: Array<PostMemberListResponseAccountManagements>;
  acc: string;
  PageCount: number = 10;
  TotalCount: number = 0;
  Page: number = 1;
  @Input() AccountIdentity: string = '';
  @Input() UserAccount: string = '';
  @Input() Name: string = '';
  @Input() Status: string = '0';
  Permission: Array<SinglePermissionPerson>;
  postMemberListRequest: PostMemberListRequest;

  constructor(
    private rest: MemberManageService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    public premanager: PermissionService
  ) {

  }

  ngOnInit() {
    this.Permission = this.session.retrieve(LoginSessionEnum.Permission);
    this.acc = this.session.retrieve(LoginSessionEnum.UserAccount);
    this.postMemberList();
  }
  /**
   *設定取得成員名單的Request
   *
   * @memberof MemberListComponent
   */
  setPostMemberListRequest() {
    this.postMemberListRequest = {
      PageNumber: this.Page.toString(),
      ListCount: this.PageCount.toString(),
      UserAccount: this.UserAccount,
      Name: this.Name,
      Status: this.Status,
      AccountIdentity: this.AccountIdentity
    }
  }
  /**
   *取得成員名單
   *
   * @param {boolean} [init=true]
   * @memberof MemberListComponent
   */
  postMemberList(init: boolean = true) {
    if (init) this.Page = 1;
    this.setPostMemberListRequest();
    this.spinnerService.show();
    this.rest.apiPostMemberList(this.postMemberListRequest).pipe(
      tap(res => {
        this.setMemberList(res);
      })
    ).subscribe().add(() => { this.spinnerService.hide() });
  }
  /**
   *換頁
   *
   * @param {*} page
   * @memberof MemberListComponent
   */
  loadPage(page: any) {
    this.Page = page;
    this.postMemberList(false);
  }

  /**
   *更變使用者狀態
   *
   * @param {string} targetAccount
   * @param {string} status
   * @memberof MemberListComponent
   */
  updateMemberStatus(targetAccount: string, status: string): void {
    const request: PostUpdateMemberStatusRequest = {
      UserAccount: targetAccount,
      LoginAccount: this.acc,
      Status: status
    };
    this.spinnerService.show();
    this.rest.apiPostUpdateMemberStatus(request).pipe(
      concatMap((res) => {
        if (res.ErrorMsg) return null
        return this.rest.apiPostMemberList(this.postMemberListRequest)
      }),
      tap(res => {
        this.setMemberList(res);
      })
    ).subscribe().add(() => this.spinnerService.hide());
  }

  setMemberList(res: PostMemberListResponse): void {
    if (!res) return
    res.RepAccountManagements = res.RepAccountManagements.map((i) => {
      return {
        ...i,
        Status: i.Status == '1' ? '啟用' : '停用',
        AccountIdentity: i.AccountIdentity == '1' ? '員工' : '供應商'
      }
    });
    this.memberlist = res.RepAccountManagements;
    this.TotalCount = Number(res.TotalCount);
  }
}
