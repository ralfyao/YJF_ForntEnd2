import { Component, Inject, OnInit, Input, Injector } from '@angular/core';
import { CustomService } from 'src/app/Service/Custom.service'
import { DOCUMENT } from "@angular/common";
import { Customer, SinglePermissionPerson } from 'src/app/Model/vo';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { PermissionService } from 'src/app/Service/permission.service';
import { Router, RouterState, ActivatedRoute } from '@angular/router';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import 'rxjs/Rx';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InsertAddCustomerRequest } from 'src/bin/insertAddCustomerRequest';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormServiceService } from 'src/app/Service/formService.service';
import { QuerySingleCustomerDetailRequest } from 'src/bin/querySingleCustomerDetailRequest';
/**子元件：新增客戶表單、修改客戶資料表單、瀏覽客戶資料細節
 * @export AddCustomerComponent
 * @class AddCustomerComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})

export class AddCustomerComponent implements OnInit {
  /**用來接收由客戶清單或其他UI傳來的客戶VO
   * @type {Customer}
   * @memberof AddCustomerComponent
   */
  public customer: Customer;
  /**目前登入者的帳號
   * @type {string}
   * @memberof AddCustomerComponent
   */
  public LoginUserAccount: string;
  /**目前登入者的系統權限
   * @type {Array<SinglePermissionPerson>}
   * @memberof AddCustomerComponent
   */
  public Permission: Array<SinglePermissionPerson>;



  /**綁INPUT：業務人員(暫無用到)
   * @type {string}
   * @memberof AddCustomerComponent
   */
  public ClerkName: string = "";



  /**綁INPUT：客戶編號
   * @type {string}
   * @memberof AddCustomerComponent
   */
  public CustomerNumber: string = "";


  /**綁INPUT：給SELECT存取用的陣列(客戶帳號狀態)
   * @type {string[]}
   * @memberof AddCustomerComponent
   */
  public StatusAry: string[] = ['停用', '啟用'];

  public CountryCode: string = "";
  public Currency: string = "";
  public DeliveryTerm: string = "";

  constructor(
    @Inject(DOCUMENT) private document,
    private cust: CustomService,
    private inj: Injector,
    private session: SessionStorageService,
    public premanager: PermissionService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private crypt: CustomValidateService,
    public fS: FormServiceService
  ) {
    const state: RouterState = this.router.routerState;
    const root: ActivatedRoute = state.root;
    root.queryParams.subscribe(params => {
      let data = this.crypt.AESDecrypt(params['qraf'])
      if (data != undefined) {
        this.customer = JSON.parse(data);
      }
    });
  }

  form: FormGroup = new FormGroup({
    YJFCustomerNumber: new FormControl(''),
    CountryCode: new FormControl(''),
    LoginUserName: new FormControl(''),
    CreateDate: new FormControl(''),
    CustomerNumber: new FormControl(''),
    Nickname: new FormControl('', [Validators.required]),
    Status: new FormControl('1', [Validators.required]),
    EmployeeCount: new FormControl(''),
    ContactPerson: new FormControl('', [Validators.required]),
    UserName: new FormControl('', [Validators.required]),
    TaxIDNumber: new FormControl('', [Validators.pattern(/^[0-9]{8}$/)]),
    Fax: new FormControl(''),
    TEL: new FormControl(''),
    TEL2: new FormControl(''),
    Email: new FormControl('', [Validators.required, Validators.email]),
    Capital: new FormControl(''),
    Revenue: new FormControl(''),
    Currency: new FormControl('', [Validators.required]),
    DeliveryTerm: new FormControl('', [Validators.required]),
    Remark: new FormControl('')
  })

  ngOnInit() {
    this.LoginUserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
    this.Permission = this.session.retrieve(LoginSessionEnum.Permission);
    if (this.customer != null && String(this.customer.CST_Customer_ID).trim().length != 0) {
      this.queryCustomerSingle(this.customer.CST_Customer_ID);
    }
    this.alertclose();
  }


  /**新增客戶
   * @returns {null}
   * @memberof AddCustomerComponent
   */
  addCustomer() {
    if (!this.form.valid) {
      this.fS.errorOccur(this.form);
      return
    }
    const customerInfo: Customer = new Customer();
    customerInfo.CST_Customer_ID = this.CustomerNumber;
    customerInfo.ClerkName = this.ClerkName;
    Object.keys(this.form.controls).forEach((i) => {
      customerInfo[i] = this.form.get(i).value;
    });
    this.spinnerService.show();
    const request: InsertAddCustomerRequest = {
      ...customerInfo,
      LoginAccount: this.LoginUserAccount
    }
    this.cust.apiInsertAddCustomer(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.cust.successMessage('已完成新增客戶');
        this.router.navigateByUrl('/login_success/CustomerManage');
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.cust.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  /**更新客戶資料
   * @returns
   * @memberof AddCustomerComponent
   */
  updateCustomer() {
    if (!this.form.valid) {
      this.fS.errorOccur(this.form);
      return
    }
    const customerDetail: Customer = new Customer();
    customerDetail.CST_Customer_ID = this.CustomerNumber;
    customerDetail.ClerkName = this.ClerkName;
    Object.keys(this.form.controls).forEach((i) => {
      customerDetail[i] = this.form.get(i).value;
    });
    const request: InsertAddCustomerRequest = {
      ...customerDetail,
      LoginAccount: this.LoginUserAccount
    }
    this.spinnerService.show();
    this.cust.apiInsertUpdateCustomer(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.cust.successMessage('資料已更新');
        this.router.navigateByUrl('/login_success/CustomerManage');
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.cust.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  /**如果是用瀏覽的方式進來就會呼叫這個方法，來回填所有的INPUT
   * @param {string} CustomerNumber
   * @memberof AddCustomerComponent
   */
  queryCustomerSingle(CustomerNumber: string) {
    this.spinnerService.show();
    const request: QuerySingleCustomerDetailRequest = {
      CST_Customer_ID: CustomerNumber
    }
    this.cust.apiQuerySingleCustomerDetail(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        Object.keys(this.form.controls).forEach((i) => {
          this.form.get(i).setValue(res.SingleCustomerDetailRep[i])
        })
        this.CustomerNumber = res.SingleCustomerDetailRep.CST_Customer_ID;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.cust.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe()
  }
  DateString() {
    return new Date(Date.now()).toDateString();
  }

  /**關閉告警訊息
   * @memberof AddCustomerComponent
   */
  alertclose() {
    this.document.getElementById('alertstate').setAttribute('style', 'display:none;visibility:hidden;');
  }
}


