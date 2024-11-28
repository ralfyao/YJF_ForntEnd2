import { Component, OnInit, Injector, Inject } from '@angular/core';
import { RFQService } from 'src/app/Service/rfq.service';
import { PermissionService } from 'src/app/Service/permission.service';
import { SinglePermissionPerson, Quotation, PageStatus } from 'src/app/Model/vo';
import { LoginSessionEnum, QuotationPageEnum } from 'src/app/Enum/session-enum.enum';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-rfq-list',
  templateUrl: './rfq-list.component.html',
  styleUrls: ['./rfq-list.component.css']
})
export class RFQListComponent implements OnInit {
  QuotationList: Array<Quotation> = new Array<Quotation>();
  PageCount: number = 10;
  TotalCount: number = 0;
  Page: number = 1;
  Permission: Array<SinglePermissionPerson>;
  acc: string;
  sdate: string;
  edate: string;
  StartDate: Date = new Date(2019, 1, 1);
  EndDate: Date = new Date();
  QuotationIsClosedString: string = "未結案";
  QuotationIsClosedNumber: string = "1";
  StatusList: Array<string> = [
    "未結案",
    "結案"
  ];
  CustomerName: string;
  Quotation_ID: string;
  Search_QuoteNumber: string = "";
  Search_CreateName: string = "";
  YJFCustomerNumber: string = "";
  SearchText: string = "";
  PageStatusList: Array<PageStatus> = new Array<PageStatus>();
  StarterTimmer: number = 0;

  settings = {
    bigBanner: true,
    timePicker: false,
    format: 'yyyy-MM-dd',
    defaultOpen: false
  }



  constructor(
    @Inject(DOCUMENT) public document,
    private rest: RFQService,
    private inj: Injector,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    public premanager: PermissionService,
    private router: Router,
    private crypt: CustomValidateService) {


  }

  ngOnInit() {
    this.acc = this.session.retrieve(LoginSessionEnum.UserAccount);
    this.Permission = this.session.retrieve(LoginSessionEnum.Permission);
    this.sdate = new Date(new Date(2019, 1, 1)).getFullYear().toString() + "/" + (new Date(new Date(2019, 1, 1)).getMonth() + 1).toString() + "/" + new Date(new Date(2019, 1, 1)).getDate().toString();
    this.edate = new Date().getFullYear().toString() + "/" + (new Date().getMonth() + 1).toString() + "/" + new Date().getDate().toString();
    this.CheckPageStatus();
  }
  ngOnDestroy() {
    var newpagestatus = new PageStatus();
    newpagestatus.SearchText = this.SearchText;
    newpagestatus.QuotationStatus = this.QuotationIsClosedNumber;
    newpagestatus.PageNo = this.Page;
    newpagestatus.PageName = "rfq-list";
    if (this.PageStatusList.filter(x => x.PageName == "rfq-list").length > 0) {
      this.PageStatusList = this.PageStatusList.filter(x => x.PageName != "rfq-list");
      this.PageStatusList.push(newpagestatus);
      this.session.store(QuotationPageEnum.PageStatusList, this.PageStatusList);
    } else {
      this.PageStatusList.push(newpagestatus);
      this.session.store(QuotationPageEnum.PageStatusList, this.PageStatusList);
    };
  }

  TableRowColorChange(tablename: string, List: any, row: number) {
    var i = 0;
    List.forEach(x => {
      this.document.getElementById(tablename + i.toString()).setAttribute('style', 'height:43px;');
      i++
    });
    this.document.getElementById(tablename + row.toString()).setAttribute('style', 'height:43px;background-color:deepskyblue;');
  }
  SmartSearch(page: number) {
    this.Page = page;
    this.rest.API_SearchText(this.SearchText, this.sdate, this.edate, this.QuotationIsClosedNumber, page, this.PageCount, this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        this.QuotationList = data['QuotationListReps'];
        this.TotalCount = Number(data['TotalCount']);
      }, () => {

      }
    );
  }

  CheckPageStatus() {
    this.PageStatusList = this.session.retrieve(QuotationPageEnum.PageStatusList) == null ? new Array<PageStatus>() : this.session.retrieve(QuotationPageEnum.PageStatusList);
    if (this.PageStatusList.filter(x => x.PageName == "rfq-list").length > 0) {
      this.PageStatusList.filter(x => x.PageName == "rfq-list").forEach(x => {
        this.SearchText = x.SearchText;
        this.Page = x.PageNo;
        this.QuotationIsClosedNumber = x.QuotationStatus;
      });
      switch (this.QuotationIsClosedNumber) {
        case "1":
          this.QuotationIsClosedString = "未結案";
          this.QuotationIsClosedNumber = "1";
          break;
        case "2":
          this.QuotationIsClosedString = "結案";
          this.QuotationIsClosedNumber = "2";
          break;
      };
    }
    this.SmartSearch(this.Page);
  }

  queryQuotation(StartPage: string) {
    this.spinnerService.show();
    this.SearchText = "";
    this.rest.API_Query_QuotationList(this.YJFCustomerNumber, this.Search_QuoteNumber, this.Search_CreateName, this.QuotationIsClosedNumber, this.sdate, this.edate, String(this.PageCount), StartPage).then(
      (data) => {
        this.QuotationList = data['QuotationListReps'];
        this.TotalCount = Number(data['TotalCount']);
        this.spinnerService.hide();
      }, () => {

      }
    );
    this.rest.API_Query_MemberList("10", "1");
  }

  queryCusName(Quotation_ID: string) {
    if (Quotation_ID.length != 0) {
      this.spinnerService.show();
      this.rest.API_Query_SingleQuotation(Quotation_ID).then(
        (data) => {
          this.spinnerService.hide();
          this.CustomerName = data['QuotationRep']['CustomerName'];
        },
        () => {
          this.spinnerService.hide();
        }
      )
    }
  }

  ChangeIsClosed(Value: string) {
    switch (Value) {
      case "未結案":
        this.QuotationIsClosedString = Value;
        this.QuotationIsClosedNumber = "1";
        break;
      case "結案":
        this.QuotationIsClosedString = Value;
        this.QuotationIsClosedNumber = "2";
        break;
    };
    this.SmartSearch(1);

  }

  loadPage(page: number) {
    this.Page = page;
    this.SmartSearch(page);
  }

  addQuotation() {
    this.router.navigate(['login_success/RFQListDetail'], { queryParams: { Q: null } });
  }

  EditQuotation(Quotation: Quotation) {
    let s = JSON.stringify(Quotation);
    this.router.navigate(['login_success/RFQListDetail'], { queryParams: { Q: this.crypt.AESEncrypt(s) } });
  }

  onStartDateSelect(value: Date) {
    this.sdate = value.getFullYear().toString() + "/" + (value.getMonth() + 1).toString() + "/" + value.getDate().toString();
    console.log(this.sdate);
  }
  onEndDateSelect(value: Date) {
    this.edate = value.getFullYear().toString() + "/" + (value.getMonth() + 1).toString() + "/" + value.getDate().toString();
    console.log(this.edate);
  }


}
