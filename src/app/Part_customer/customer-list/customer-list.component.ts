import { Component, Inject, OnInit, Input, Injector, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CustomService } from 'src/app/Service/Custom.service'
import { Customer, SinglePermissionPerson } from 'src/app/Model/vo';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { PermissionService } from 'src/app/Service/permission.service';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QueryCustomerListRequest } from 'src/bin/queryCustomerListRequest';
import { catchError, tap } from 'rxjs/operators';
import { SweetAlertService } from 'src/app/Service/sweet-alert.service';
import { of } from 'rxjs';

/**子元件：客戶清單
 * @export CustomerListComponent
 * @class CustomerListComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [CustomService]
})

export class CustomerListComponent implements OnInit {
  /**存放客戶清單資料的陣列
   * @type {Array<Customer>}
   * @memberof CustomerListComponent
   */
  customerlist: Array<Customer>;
  /** 設定UI分頁資料筆數用(每頁顯示幾筆)
   * @type {number}
   * @memberof CustomerListComponent
   */
  PageCount: number = 10;
  /**用來接API回傳的資料總筆數，UI顯示用
   * @type {number}
   * @memberof CustomerListComponent
   */
  TotalCount: number = 0;
  /**UI暫存目前在第幾頁使用，用來傳入查詢API
   * @type {number}
   * @memberof CustomerListComponent
   */
  Page: number = 1;
  /**存放目前的登入者帳號
   * @type {string}
   * @memberof CustomerListComponent
   */
  LoginUserAccount: string;
  /**存搜尋欄INPUT客戶代號
   * @type {string}
   * @memberof CustomerListComponent
   */
  @Input() CustomerNumber: string = "";
  /**存搜尋欄INPUT聯絡人
   * @type {string}
   * @memberof CustomerListComponent
   */
  @Input() ContactPerson: string = "";
  /**存搜尋欄INPUT系統編號
   * @type {string}
   * @memberof CustomerListComponent
   */
  @Input() YJFCustomerNumber: string = "";
  /**存搜尋欄INPUT電話
   * @type {string}
   * @memberof CustomerListComponent
   */
  @Input() Nickname: string = "";
  /**存目前登入者的系統權限
   * @type {Array<SinglePermissionPerson>}
   * @memberof CustomerListComponent
   */
  Permission: Array<SinglePermissionPerson>;
  queryCustomerListRequest: QueryCustomerListRequest;
  constructor(
    @Inject(DOCUMENT) private document,
    private rest: CustomService,
    private inj: Injector,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    public premanager: PermissionService,
    private router: Router,
    private crypt: CustomValidateService,
    private modalService: NgbModal
  ) {

  }


  ngOnInit() {
    this.LoginUserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
    this.Permission = this.session.retrieve(LoginSessionEnum.Permission);
    this.queryCustomerListRequest = {
      Account: this.LoginUserAccount,
      ListCount: this.PageCount.toString(),
      PageNumber: '1'
    }
    this.queryMemberList();
  }
  /**
   *取得客戶資料
   *
   * @memberof CustomerListComponent
   */
  queryMemberList() {
    this.spinnerService.show();
    this.rest.apiQueryCustomerList(this.queryCustomerListRequest).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.customerlist = res.SingleCustomerDetailReps;
        this.TotalCount = +res.TotalCount;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  TableRowColorChange(tablename: string, List: any, row: number) {
    var i = 0;
    List.forEach(x => {
      this.document.getElementById(tablename + i.toString()).setAttribute('style', '');
      i++
    });
    this.document.getElementById(tablename + row.toString()).setAttribute('style', 'background-color:deepskyblue;');
  }

  /**換頁UI呼叫
   * @param {*} page UI第幾頁的參數(從HTML傳進來)
   * @memberof CustomerListComponent
   */
  loadPage(page: any) {
    this.Page = page;
    this.queryCustomerListRequest.PageNumber = page;
    this.queryMemberList();
  }

  /**進新增客戶子元件
   * @memberof CustomerListComponent
   */
  addCustomer() {
    this.router.navigate(['login_success/CustomerManageDetail'], { queryParams: { qraf: null } });
  }

  /**瀏覽客戶細節
   * @param {Customer} cust 客戶VO
   * @memberof CustomerListComponent
   */
  CustomerDetail(cust: Customer) {
    let s = JSON.stringify(cust);
    this.router.navigate(['login_success/CustomerManageDetail'], { queryParams: { qraf: this.crypt.AESEncrypt(s) } });
  }

  /**快捷鍵客戶建立詢價單
   * @param {Customer} cust 客戶VO
   * @memberof CustomerListComponent
   */
  CreateRFQ(cust: Customer) {
    let s = JSON.stringify(cust);
    this.router.navigate(['login_success/RFQListDetail'], { queryParams: { CUS: this.crypt.AESEncrypt(s) } });
  }
  DateString() {
    return new Date(Date.now()).toDateString();
  }
  /**
   *開啟搜尋popup
   *
   * @param {ElementRef} modal
   * @memberof CustomerListComponent
   */
  openModal(modal: ElementRef): void {
    this.CustomerNumber = this.queryCustomerListRequest.CustomerNumber;
    this.ContactPerson = this.queryCustomerListRequest.ContactPerson;
    this.Nickname = this.queryCustomerListRequest.Nickname;
    this.YJFCustomerNumber = this.queryCustomerListRequest.YJFCustomerNumber;
    this.modalService.open(modal, { size: 'lg' });
  }
  /**
   *依條件搜尋客戶名單
   *
   * @memberof CustomerListComponent
   */
  onSearch(): void {
    this.queryCustomerListRequest = {
      ...this.queryCustomerListRequest,
      CustomerNumber: this.CustomerNumber,
      ContactPerson: this.ContactPerson,
      Nickname: this.Nickname,
      YJFCustomerNumber: this.YJFCustomerNumber,
      PageNumber: '1'
    }
    this.queryMemberList();
    this.modalService.dismissAll();
  }
  /**
   *清除搜尋條件
   *
   * @memberof CustomerListComponent
   */
  onClear(): void {
    this.CustomerNumber = '';
    this.ContactPerson = '';
    this.Nickname = '';
    this.YJFCustomerNumber = '';
  }

}
