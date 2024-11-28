import { Component, Inject, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { RFQService } from 'src/app/Service/rfq.service';
import { DOCUMENT } from "@angular/common";
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum, QuotationPageEnum } from 'src/app/Enum/session-enum.enum';
import { QuotationResult, QuotationList, PageStatus } from 'src/app/Model/vo';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-rfq-result-list',
  templateUrl: './rfq-result-list.component.html',
  styleUrls: ['./rfq-result-list.component.css']
})
export class RFQResultListComponent implements OnInit {
  QuotationNumber: string = "";
  QuotationResultList: Array<QuotationList>;
  PageCount: number = 10;
  TotalCount: number = 0;
  Page: number = 1;
  QuotationIsClosedString: string = "未結案";
  QuotationIsClosedNumber: string = "1";
  StatusList: Array<string> = [
    "未結案",
    "結案"
  ];
  SearchText: string = "";

  //#region 搜尋列
  sdate: Date = new Date(new Date().getTime() - (7 * 24 * 3600000));
  StartDate: NgbDate = NgbDate.from({
    year: this.sdate.getFullYear(),
    month: this.sdate.getMonth() + 1,
    day: this.sdate.getDate()
  });
  EndDate: NgbDate = NgbDate.from({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  });
  Search_QuoteNumber: string = "";
  Search_CreateName: string = "";
  Search_CSTName: string = "";
  PageStatusList:Array<PageStatus>= new Array<PageStatus>();
  //#endregion

  constructor(
    @Inject(DOCUMENT) private document,
    private router: Router,
    private rest: RFQService,
    private inj: Injector,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private crypt: CustomValidateService) { }

  ngOnInit() {
    this.CheckPageStatus();
  }

  ngOnDestroy(){
    var newpagestatus = new PageStatus();
    newpagestatus.SearchText = this.SearchText;
    newpagestatus.QuotationStatus = this.QuotationIsClosedNumber;
    newpagestatus.PageNo = this.Page;
    newpagestatus.PageName = "RFQResultList";
    if(this.PageStatusList.filter(x=>x.PageName=="RFQResultList").length>0){
      this.PageStatusList=this.PageStatusList.filter(x=>x.PageName!="RFQResultList");
      this.PageStatusList.push(newpagestatus);
      this.session.store(QuotationPageEnum.PageStatusList,this.PageStatusList);
    }else
    {
      this.PageStatusList.push(newpagestatus);
      this.session.store(QuotationPageEnum.PageStatusList,this.PageStatusList);
    };
  }

  SmartSearch(page: number) {
    this.Page = page;
    let s1: string;
    let s2: string;
    s1 = this.StartDate.year.toString() + "/" + this.StartDate.month.toString() + "/" + this.StartDate.day.toString();
    s2 = this.EndDate.year.toString() + "/" + this.EndDate.month.toString() + "/" + this.EndDate.day.toString();
    this.rest.API_SearchText(this.SearchText, s1, s2, this.QuotationIsClosedNumber, page, this.PageCount, this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        this.QuotationResultList = data['QuotationListReps'];
        this.TotalCount = Number(data['TotalCount']);
      }, () => {

      }
    );
  }

  TableRowColorChange(tablename:string,List:any,row:number){
    var i = 0;
    List.forEach(x=>{
      this.document.getElementById(tablename+i.toString()).setAttribute('style', '');
      i++
    });
    this.document.getElementById(tablename+row.toString()).setAttribute('style', 'background-color:deepskyblue;');
  }

  CheckPageStatus(){
    this.PageStatusList =this.session.retrieve(QuotationPageEnum.PageStatusList)==null?new Array<PageStatus>():this.session.retrieve(QuotationPageEnum.PageStatusList);
    if(this.PageStatusList.filter(x=>x.PageName=="RFQResultList").length>0)
    {
      this.PageStatusList.filter(x=>x.PageName=="RFQResultList").forEach(x=>{
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

  queryResultList(page: string) {
    this.spinnerService.show();
    this.rest.API_Query_QuotationResultList(this.Search_QuoteNumber, this.Search_CreateName, this.Search_CSTName, this.QuotationIsClosedNumber, String(this.PageCount), page).then(
      (data) => {
        this.QuotationResultList = data['QuotationListReps'];
        this.TotalCount = data['TotalCount'];
        this.spinnerService.hide();
      }, () => {
        this.spinnerService.hide();
      });
    this.rest.API_Query_MemberList("10", "1");

  }



  FeedbackList(result: QuotationResult) {

  }

  CheckoutResult(result: QuotationResult) {
    let s = JSON.stringify(result);
    console.log("S:", this.crypt.AESEncrypt(s));
    this.router.navigate(['login_success/RFQResulCheckOut'], { queryParams: { RFQ: this.crypt.AESEncrypt(s) } });
  }

  loadPage(page: any) {
    this.Page = page;
    this.SmartSearch(page);
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
  }
}
