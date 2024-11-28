import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoService } from 'src/app/Service/mo.service'
import { DOCUMENT } from "@angular/common";
import { MaintainOrder } from 'src/app/Model/vo';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter } from '@angular/material/core';
import { MaintainListRequest } from 'src/bin/maintainListRequest';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-mo-list',
  templateUrl: './mo-list.component.html',
  styleUrls: ['./mo-list.component.css'],
  providers: [MoService]
})
export class MOListComponent implements OnInit {
  MOList;
  PageCount: number = 9;
  TotalCount: number = 0;
  Page: number = 1;
  ASMTG011: string = "";
  ASMTG012: string = "";
  StartDate: Date = new Date(new Date().setDate(new Date().getDate() - 7));
  EndDate: Date = new Date();
  AccountIdentity: string = LoginSessionEnum.AccountIdentity;
  ASMTGTG004String: string = "All";
  SearchText: string = "";
  singleDate: Date = new Date(Date.now());
  myFilterS = (d: Date | null): boolean => {

    return d <= this.EndDate;
  };
  myFilterE = (d: Date | null): boolean => {

    return d >= this.StartDate;
  }

  constructor(@Inject(DOCUMENT) private document,
    private router: Router,
    private rest: MoService,
    private spinnerService: NgxSpinnerService,
    private crypt: CustomValidateService,
    private _adapter: DateAdapter<any>,
    private session: SessionStorageService) {

  }

  ngOnInit() {
    this.AccountIdentity = this.session.retrieve(LoginSessionEnum.AccountIdentity).toString();
    this.queryMOListWithFilter('1');
    this._adapter.setLocale('zh-tw');
  }

  loadPage(page: any) {
    this.Page = page;
    this.queryMOListWithFilter(page);
  }

  TableRowColorChange(tablename: string, List: any, row: number) {
    var i = 0;
    List.forEach(x => {
      this.document.getElementById(tablename + i.toString()).setAttribute('style', '');
      i++
    });
    this.document.getElementById(tablename + row.toString()).setAttribute('style', 'background-color:deepskyblue;');
  }


  queryMOListWithFilter(StartPage: string) {
    if (!this.StartDate || !this.EndDate) {
      this.document.getElementById('status').setAttribute('style', 'color:red;visibility:visible;font-size:large;margin: 5px;');
    } else {
      this.document.getElementById('status').setAttribute('style', 'color:red;visibility:hidden;font-size:large;margin: 5px;');
      this.spinnerService.show();
      const acc: string = this.session.retrieve(LoginSessionEnum.UserAccount);
      const StartDate = DatetoyyyyMMdd(this.StartDate);
      const EndDate = DatetoyyyyMMdd(this.EndDate);

      const request: MaintainListRequest = {
        BillingDate_Start: StartDate,
        BillingDate_End: EndDate,
        ListCount: String(this.PageCount),
        LoginAccount: acc,
        PageNumber: StartPage,
        ASMTGTG004String: this.ASMTGTG004String,
        SearchText: this.SearchText
      }
      this.rest.apiMaintainList(request).pipe(
        tap(res => {
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            throw (res.ErrorMsg)
          }
          this.MOList = res.MaintainReps;
          this.TotalCount = Number(res.TotalCount);
          this.spinnerService.hide();
        }),
        catchError((res) => {
          this.rest.errorWithErrorMsg(res);
          this.spinnerService.hide();
          return of()
        })
      ).subscribe();
    }
  }

  toDetail(MO: MaintainOrder) {
    let s = JSON.stringify(MO);
    this.router.navigate(['login_success/AddMatainOrder'], { queryParams: { MO: this.crypt.AESEncrypt(s) } });
  }
  toAddDetail() {
    if (this.session.retrieve(LoginSessionEnum.AccountIdentity) == '1') this.router.navigate(['login_success/AddMatainOrder']);
  }
}

function DatetoyyyyMMdd(newdate: Date) {

  const formatedate = new Date(newdate);
  let yyyyMMdd = '';
  if (formatedate) {
    let year = formatedate.getFullYear().toString();
    let month = (formatedate.getMonth() + 1).toString();
    if (month.length < 2) {
      month = "0" + month;
    }
    let odate = formatedate.getDate().toString();
    if (odate.length < 2) {
      odate = "0" + odate;
    }
    yyyyMMdd = year + month + odate;
  }
  return yyyyMMdd;
}
