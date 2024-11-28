import { Component, OnInit, Input, Injector, Inject } from '@angular/core';
import { RFQService } from 'src/app/Service/rfq.service';
import { ClosedQuotationResult, QuotationList, SupplierQuoteLog, ResultQuoteLog, FinalQuotationLog, YJFPartNo, FinalQuotationLogBody } from 'src/app/Model/vo';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { DOCUMENT } from "@angular/common";
import { PermissionService } from 'src/app/Service/permission.service';
import { Router, RouterState, ActivatedRoute } from '@angular/router';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-rfq-result-check-out',
  templateUrl: './rfq-result-check-out.component.html',
  styleUrls: ['./rfq-result-check-out.component.css']
})
export class RFQResultCheckOutComponent implements OnInit {

  ResultHeader: QuotationList;
  UserName: string;
  /**
 * 原始業務建立的報價項目清單(以客戶品號為Group)) *
 *  項目A  -  多個供應商S
 * QuotationDetail  --  FORM_QuotationDetailSupplierMap
 * 之前所建立的溢價比(從))
 */
  quotationDetailList: Array<ClosedQuotationResult>;
  selectdetail: ClosedQuotationResult = null;

  /**
 * 每個供應商對客戶品號進行報價(以供應商為 Group)) *
 * 項目A  --多個供應商S  -- 每個項目有多個供應商報價C
 * FORM_QuotationDetailSupplierMap - LOG_SupplierQuotationRecord
 */
  selectDetail_VendorList: Array<SupplierQuoteLog> = new Array<SupplierQuoteLog>();
  selectlog: SupplierQuoteLog = null;

  /**
 * 以最終選擇的供應商品項，進行溢價報價(紀錄溢價報價的資訊) *
 * 每個項目有多個供應商報價C --紀錄對客人的溢價報價後的價格(原是報價*溢價比/匯率))
 * LOG_SupplierQuotationRecord - FORM_QuotationResultLog
 */
  ResultQyoteLogList: Array<ResultQuoteLog> = new Array<ResultQuoteLog>();
  selectResultLog: ResultQuoteLog;
  Currencys: Array<string> = [
    "TWD", "EUR", "USD", "JPY", "CNY"];

  /**
* 對客戶的最終報價 *
* 紀錄溢價報價與要提供給客戶的最終報價單格式(打成當地的語言)
* 紀錄最終給客戶的報價內容
* FORM_QuotationResultLog - YJF QuotationSystem COPTA COPTB
*/
  FinalQuotationList: Array<FinalQuotationLog> = new Array<FinalQuotationLog>();

  SummarySupplierLog: Array<ResultQuoteLog> = new Array<ResultQuoteLog>();

  FinalQuotationLog: FinalQuotationLog = new FinalQuotationLog();
  FinalQuoteBodyList: Array<FinalQuotationLogBody> = new Array<FinalQuotationLogBody>();
  FinalQuoteBody: FinalQuotationLogBody = new FinalQuotationLogBody();
  PartNo: string = "";
  PartDes: string = "";
  Page: number = 1;
  YjfPartNoList: Array<YJFPartNo> = new Array<YJFPartNo>();
  TotalCount: number;
  StartpageEnd: number = 0;
  Loading1: number = 0;
  Loading2: number = 0;
  DeliveryDays: number;
  TA002: string;
  DeliveryTerm: string;
  Currency: string;
  NowDate: string;
  dragout: number;
  dropin: number;
  SelectFinalQuotationLog: FinalQuotationLog = new FinalQuotationLog();
  filterFinalQuotation:string="";


  constructor(
    @Inject(DOCUMENT) private document,

    public rest: RFQService,
    private inj: Injector,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private flashMessage: FlashMessagesService,
    private premanager: PermissionService,
    private router: Router,
    private crypt: CustomValidateService
  ) {
    const state: RouterState = this.router.routerState;
    const root: ActivatedRoute = state.root;
    root.queryParams.subscribe(params => {
      let data = this.crypt.AESDecrypt(params['RFQ']);
      if (data == undefined) {
        this.ResultHeader = new QuotationList();
      }
      else {
        this.ResultHeader = JSON.parse(data);
      }
    })
  }

  ngOnInit() {
    this.UserName = this.session.retrieve(LoginSessionEnum.Name);
    this.DeliveryTerm = this.ResultHeader.DeliveryTerm;
    this.Currency = this.ResultHeader.Currency;
    this.StartPage();
    this.NowDate = DatetoyyyyMMdd(new Date(Date.now()));
  }


  StartPage() {
    this.spinnerService.show();
    this.rest.API_ResultQuotationList(this.ResultHeader.FORM_Quotation_ID.toString())
      .then(
        (list) => {
          this.quotationDetailList = list['closedQuotationResultReps'];
          this.Loading1 = 1;
          if (this.Loading1 + this.Loading2 == 2) {
            this.spinnerService.hide();
          }

        }, () => {
          this.quotationDetailList = null;
        }
      );
    this.rest.API_QueryFORM_QuotationResultLog(parseInt(this.ResultHeader.FORM_Quotation_ID), 1, -1, this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        this.ResultQyoteLogList = data['ResultQyoteLogList'];
        this.TotalCount = data['TotalCount'];
        this.FinalQuotationList = new Array<FinalQuotationLog>();
        this.ResultQyoteLogList.sort(function (a, b) {
          if (a.QuoteItemNumber != b.QuoteItemNumber) {
            return a.QuoteItemNumber.localeCompare(b.QuoteItemNumber);
          }
          if (a.QuoteItemNumber == b.QuoteItemNumber) {
            return a.QuoteTypeName.localeCompare(b.QuoteTypeName);
          }
        });

        this.rest.API_QueryFinalQuotationLog(parseInt(this.ResultHeader.FORM_Quotation_ID), this.session.retrieve(LoginSessionEnum.UserAccount)).then(
          (data) => {
            var i = 0;
            if (data['FinalQuotationLog'].length > 0) {
              this.FinalQuotationList = data['FinalQuotationLog'];
              this.FinalQuotationList.forEach(x => {
                i += 1;
                x.Rowindex = i
                if (x.WeightPrice > 0) {
                  x.UnitPrce = x.Weight * x.WeightPrice;
                  x.Amount = x.QTY * x.UnitPrce;
                } else {
                  x.Amount = x.QTY * x.UnitPrce;
                }
              });
            }
          }, () => {
          }
        );
        this.Loading2 = 1;
        if (this.Loading1 + this.Loading2 == 2) {
          this.spinnerService.hide();
        }
      }, () => {
      }
    );
  }


  SyncTerm() {
    this.FinalQuotationList.forEach(x => x.DeliveryDays = this.DeliveryDays);
    this.FinalQuotationList.forEach(x => x.DeliveryTerm == this.DeliveryTerm);
  }

  backPage() {
    this.router.navigate(['login_success/RFQResultList']);
  }

  SyncPrice(rows: number) {
    if (this.FinalQuotationList[rows].WeightPrice > 0) {
      this.FinalQuotationList[rows].UnitPrce = this.FinalQuotationList[rows].Weight * this.FinalQuotationList[rows].WeightPrice;
      this.FinalQuotationList[rows].Amount = this.FinalQuotationList[rows].QTY * this.FinalQuotationList[rows].UnitPrce;
    } else {
      this.FinalQuotationList[rows].Amount = this.FinalQuotationList[rows].QTY * this.FinalQuotationList[rows].UnitPrce;
    }
  }


  Rowselect(log: SupplierQuoteLog) {
    this.selectlog = log;
    this.selectDetail_VendorList.forEach(x => {
      if (x.LOG_SupplierQuotationRecord_ID == log.LOG_SupplierQuotationRecord_ID) {
        this.document.getElementById('ID' + x.LOG_SupplierQuotationRecord_ID.toString()).setAttribute('style', 'background-color:turquoise');
      }
      else {
        this.document.getElementById('ID' + x.LOG_SupplierQuotationRecord_ID.toString()).setAttribute('style', 'background-color:white');
      }
    });
    this.selectResultLog = this.ResultQyoteLogList.find(x => x.LOG_SupplierQuotationRecord_ID == log.LOG_SupplierQuotationRecord_ID);
  }

  queryQuotationDetailList() {
    this.spinnerService.show();
    this.rest.API_ResultQuotationList(this.ResultHeader.FORM_Quotation_ID.toString())
      .then(
        (list) => {
          this.quotationDetailList = list['closedQuotationResultReps'];
          this.spinnerService.hide();
        }, () => {
          this.spinnerService.hide();
          this.quotationDetailList = null;
        }
      )
  }

  queryDetailVendor(selectDetail: ClosedQuotationResult) {
    this.spinnerService.show();
    this.selectdetail = selectDetail;
    this.rest.API_Query_SupplierQuoteLogList(Number.parseInt(selectDetail.FORM_QuotationDetail_ID), this.session.retrieve(LoginSessionEnum.UserAccount))
      .then(
        (list) => {
          this.selectDetail_VendorList = list['resultSupplierQuoteList'];
          this.selectDetail_VendorList.forEach(x => {
            var newquoteResult = new ResultQuoteLog;
            newquoteResult.FORM_QuotationDetail_ID = x.FORM_QuotationDetail_ID;
            newquoteResult.FORM_SupplierQuote_ID = x.FORM_SupplierQuote_ID;
            newquoteResult.LOG_SupplierQuotationRecord_ID = x.LOG_SupplierQuotationRecord_ID;
            newquoteResult.USR_Supplier_ID = parseInt(x.USR_Supplier_ID);
            newquoteResult.Remark = x.QuoteRemark;
            newquoteResult.Weight = parseFloat(selectDetail.Weight);
            newquoteResult.QuoteQTY = x.QuoteQty;
            newquoteResult.Currency = "TWD";
            newquoteResult.FORM_QuotationResult_Log_ID = 0;
            newquoteResult.SupplierName = x.SupplierName;
            newquoteResult.QuoteTypeName = selectDetail.QuoteTypeName;
            newquoteResult.SYS_QuoteType_ID = parseInt(selectDetail.SYS_QuoteType_ID);
            newquoteResult.ExchangeRate = 1;
            newquoteResult.QuoteItem = x.QuoteItem;
            newquoteResult.QuoteItemNumber = this.quotationDetailList.find(y => y.FORM_QuotationDetail_ID == x.FORM_QuotationDetail_ID.toString()).QuoteItemNumber;
            newquoteResult.Dimension = this.quotationDetailList.find(y => y.FORM_QuotationDetail_ID == x.FORM_QuotationDetail_ID.toString()).QuoteDetailDimension;
            newquoteResult.PartNo = x.PartNo;
            if (this.ResultQyoteLogList.findIndex(x => x.LOG_SupplierQuotationRecord_ID == newquoteResult.LOG_SupplierQuotationRecord_ID) < 0) {
              this.ResultQyoteLogList.push(newquoteResult);
            }
          });
          this.spinnerService.hide();

        }, () => {
          this.spinnerService.hide();
          this.selectDetail_VendorList = new Array<SupplierQuoteLog>();
        }
      )
  }

  CaculateResultLog(log: ResultQuoteLog) {

    if (this.selectDetail_VendorList.find(x => x.LOG_SupplierQuotationRecord_ID == log.LOG_SupplierQuotationRecord_ID).SYS_QuoteType_ID == 13 || this.selectDetail_VendorList.find(x => x.LOG_SupplierQuotationRecord_ID == log.LOG_SupplierQuotationRecord_ID).SYS_QuoteType_ID == 15) {
      log.SinglePrice = parseFloat((this.selectlog.QuoteWeightPrice * log.ProfitRatio / log.ExchangeRate).toFixed(2));
      log.UnitPrice = parseFloat((log.SinglePrice * log.Weight).toFixed(2));
      log.Amount = parseFloat((log.UnitPrice * log.QuoteQTY).toFixed(2));

    }
    else {
      log.UnitPrice = parseFloat((this.selectlog.QuoteUnitPrice * log.ProfitRatio / log.ExchangeRate).toFixed(2));
      log.Amount = parseFloat((log.UnitPrice * log.QuoteQTY).toFixed(2));
    }

  }
  CaculateResultLogByWeightPrice(log: ResultQuoteLog) {
    if (this.selectDetail_VendorList.find(x => x.LOG_SupplierQuotationRecord_ID == log.LOG_SupplierQuotationRecord_ID).SYS_QuoteType_ID == 13 || this.selectDetail_VendorList.find(x => x.LOG_SupplierQuotationRecord_ID == log.LOG_SupplierQuotationRecord_ID).SYS_QuoteType_ID == 15) {
      log.UnitPrice = parseFloat((log.SinglePrice * log.Weight).toFixed(2));
      log.ProfitRatio = parseFloat((log.SinglePrice * log.ExchangeRate / this.selectlog.QuoteWeightPrice).toFixed(2));
      log.Amount = parseFloat((log.UnitPrice * log.QuoteQTY).toFixed(2));
    }
  }
  ConfirmQuoteDetail() {
    this.selectlog = null;
    this.selectdetail = null;
  }

  CurrencyChange(SelectCurrency: string) {
    this.rest.API_Query_GlobalCurrency(SelectCurrency).then(
      (data) => {
        if (data != null && data != undefined && this.selectResultLog != null) {
          this.ResultQyoteLogList.find(x => x.LOG_SupplierQuotationRecord_ID == this.selectResultLog.LOG_SupplierQuotationRecord_ID).ExchangeRate =
            parseFloat(Number(data['ExchangeRate']).toFixed(2));
          this.ResultQyoteLogList.find(x => x.LOG_SupplierQuotationRecord_ID == this.selectResultLog.LOG_SupplierQuotationRecord_ID).Currency =
            SelectCurrency;
          this.CaculateResultLog(this.selectResultLog);
        }

      }, () => {

      }
    )

  }
  CurrencySetAll() {
    let log = this.selectResultLog;
    this.ResultQyoteLogList.filter(x => x.FORM_QuotationDetail_ID == log.FORM_QuotationDetail_ID).forEach(x => {
      x.Currency = log.Currency;
      x.ExchangeRate = log.ExchangeRate;
      var selectlog = this.selectDetail_VendorList.find(y => y.LOG_SupplierQuotationRecord_ID == x.LOG_SupplierQuotationRecord_ID)

      if (x.SYS_QuoteType_ID != 13 && x.SYS_QuoteType_ID != 15) {
        x.UnitPrice = parseFloat((selectlog.QuoteUnitPrice * x.ProfitRatio / x.ExchangeRate).toFixed(2));
        x.Amount = parseFloat((x.UnitPrice * x.QuoteQTY).toFixed(2));
      }
      else {
        x.SinglePrice = parseFloat((selectlog.QuoteWeightPrice * x.ProfitRatio / x.ExchangeRate).toFixed(2));
        x.UnitPrice = parseFloat((x.SinglePrice * x.Weight).toFixed(2));
        x.Amount = parseFloat((x.UnitPrice * x.QuoteQTY).toFixed(2));
      }
    });
  }

  AddQuotationItem() {
    let log = new FinalQuotationLog;
    log.FORM_Quotation_ID = parseInt(this.ResultHeader.FORM_Quotation_ID);
    log.DeliveryDays = this.DeliveryDays;
    log.DeliveryTerm = this.ResultHeader.DeliveryTerm;
    log.Rowindex = this.FinalQuotationList.length + 1;
    this.FinalQuotationList.push(log);
  }


  FomateCurrency(event: any, Currency: string) {
    var input = event.currentTarget;
    input.value = Currency + " " + input.value;
  }


  CollseTable() {
    var divtable = this.document.getElementById("CollsepTable");
    var divbutton = this.document.getElementById("CollseButton");
    if (divbutton.textContent == "收起供應商報價表格") {
      divtable.setAttribute("style", "visibility: collapse");
      divbutton.textContent = "打開供應商報價表格";
    }
    else {
      divtable.setAttribute("style", "visibility : visible");
      divbutton.textContent = "收起供應商報價表格";
    }
  }

  CaulateFinalQuote(item:FinalQuotationLog,loc:string){
    if(item.PartNO!="9009"){
      if(loc=="QTY"){
        this.FinalQuotationList.find(x=>x.Rowindex==item.Rowindex).Amount = item.QTY*item.UnitPrce;
      }else if(loc=="UnitPrice"){
        console.log(item.UnitPrce);
        this.FinalQuotationList.find(x=>x.Rowindex==item.Rowindex).Amount = item.QTY*item.UnitPrce;
      }else if(loc=="Amount"){
        this.FinalQuotationList.find(x=>x.Rowindex==item.Rowindex).UnitPrce = item.Amount/item.QTY;
      }
      this.FinalQuotationList.find(x=>x.Rowindex==item.Rowindex).WeightPrice=0;
    }else{
      console.log('123');
      if(loc=="QTY"){
        this.FinalQuotationList.find(x=>x.Rowindex==item.Rowindex).UnitPrce = item.Weight*item.WeightPrice;
        this.FinalQuotationList.find(x=>x.Rowindex==item.Rowindex).Amount = item.QTY*item.UnitPrce;
      }else if(loc=="UnitPrice"){
        this.FinalQuotationList.find(x=>x.Rowindex==item.Rowindex).WeightPrice = item.UnitPrce/item.Weight;
        this.FinalQuotationList.find(x=>x.Rowindex==item.Rowindex).Amount = item.QTY*item.UnitPrce;
      }else if(loc=="Amount"){
        this.FinalQuotationList.find(x=>x.Rowindex==item.Rowindex).UnitPrce = item.Amount/item.QTY;
        this.FinalQuotationList.find(x=>x.Rowindex==item.Rowindex).WeightPrice = item.UnitPrce/item.Weight;
      }else if(loc=="WeightPrice"){
        this.FinalQuotationList.find(x=>x.Rowindex==item.Rowindex).UnitPrce = item.Weight*item.WeightPrice;
        this.FinalQuotationList.find(x=>x.Rowindex==item.Rowindex).Amount = item.QTY*item.UnitPrce;
      }
    }

  }
  RemoverFinalLog(index: number) {
    this.FinalQuotationList.splice(index, 1);
  }


  LoadYJFPartNO(PartNo: string, PartDes: string, item: FinalQuotationLog) {

    this.spinnerService.show();
    this.SelectFinalQuotationLog = item;
    this.rest.API_YJFSystemPartNoList(PartNo, PartDes).then(
      (data) => {
        this.spinnerService.hide();
        this.YjfPartNoList = data['YJFPartNoList'];
      }, () => {

      }
    );

    this.SummarySupplierLog = JSON.parse(JSON.stringify(this.ResultQyoteLogList));
    this.SummarySupplierLog.forEach(x => {
      if (item.FinalQuoteBodyList.filter(y => y.FORM_QuotationResult_Log_ID == x.FORM_QuotationResult_Log_ID).length > 0) {
        x.Choice = true;
      } else {
        x.Choice = false;
      };
    });
  }

  SaveFORM_QuotationResultLog() {
    this.spinnerService.show();
    var list = this.ResultQyoteLogList.filter(x => x.Choice);
    this.rest.API_UpdateFORM_QuotationResultLog(list, this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        this.spinnerService.hide();
      }, () => {

      }
    );
  }

  QueryFORM_QuotationResultLog(FORM_Quotation_ID: number, Page: number, PageCount: number) {
    this.spinnerService.show()
    this.rest.API_QueryFORM_QuotationResultLog(FORM_Quotation_ID, Page, PageCount, this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        this.spinnerService.hide();
        this.ResultQyoteLogList = data['ResultQyoteLogList'];
        this.ResultQyoteLogList.sort(function (a, b) {
          if (a.QuoteItemNumber != b.QuoteItemNumber) {
            return a.QuoteItemNumber.localeCompare(b.QuoteItemNumber);
          }
          if (a.QuoteItemNumber == b.QuoteItemNumber) {
            return a.QuoteTypeName.localeCompare(b.QuoteTypeName);
          }
        });
        this.TotalCount = data['TotalCount'];
      }, () => {

      }
    );
  }

  QuotationClose() {
    this.spinnerService.show();
    this.rest.API_CloseQuotation(this.ResultHeader.FORM_Quotation_ID, this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        this.spinnerService.hide();

      }, () => {

      }
    );
  }
  filterFinalQuotationCheck(item:ResultQuoteLog){
    if(this.filterFinalQuotation.length>0)
    return item.QuoteItemNumber.includes(this.filterFinalQuotation);
    else
    {
      return true;
    }
  }

  CheckoutResult() {
    let s = JSON.stringify(this.ResultHeader);
    this.router.navigate(['login_success/RfqResultCheckOutCostReview'], { queryParams: { RFQ: this.crypt.AESEncrypt(s) } });
  }

  UpdateFinalQuotation() {
    this.spinnerService.show();
    this.rest.API_UpdateYJFQuotationSQL(this.FinalQuotationList, this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        this.spinnerService.hide();
        this.TA002 = data['TA002'];
        if (this.TA002 != '' && data['WorkStatus'] == 'OK') {
          this.flashMessage.show('儲存成功', { cssClass: 'alert-success', timeout: 2000 });
        } else {
          this.flashMessage.show('更新失敗', { cssClass: 'alert-danger', timeout: 2000 });
        }
      }, () => {
      }
    );
  }

  QueryFinalQuotationLog() {
    this.spinnerService.show();
    this.rest.API_QueryFinalQuotationLog(parseInt(this.ResultHeader.FORM_Quotation_ID), this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        this.FinalQuotationList = data['FinalQuotationLog'];
        this.spinnerService.hide();
      }, () => {
      }
    );
  }

  dragstart(item: FinalQuotationLog) {
    this.dragout = item.Rowindex;
  }
  dropinto(item: FinalQuotationLog) {
    this.dropin = item.Rowindex;
    this.document.getElementById("ID" + this.dropin).setAttribute("style", "height: 40px;background-color: lavender");
  }
  dragleave(item: FinalQuotationLog) {
    this.dropin = item.Rowindex;
    this.document.getElementById("ID" + this.dropin).setAttribute("style", "height: 40px;background-color: white");
  }
  moverows() {
    var oldindex = this.FinalQuotationList.find(x => x.Rowindex == this.dragout).Rowindex;
    var newindex = this.FinalQuotationList.find(x => x.Rowindex == this.dropin).Rowindex;
    this.FinalQuotationList.find(x => x.Rowindex == this.dragout).Rowindex = newindex;
    this.FinalQuotationList.find(x => x.Rowindex == this.dropin).Rowindex = oldindex;
    this.FinalQuotationList.sort(function (a, b) {
      if (a.Rowindex > b.Rowindex)
        return 1
      if (b.Rowindex <= b.Rowindex)
        return -1
    });

  }
  CaculateWeight() {
    var Totalweight = 0;
    this.FinalQuotationList.filter(x => x.Weight).forEach(x => Totalweight += x.Weight);
    return Totalweight;
  }
  CaculateAmount() {
    var TotalAmount = 0;
    this.FinalQuotationList.filter(x => x.Weight).forEach(x => TotalAmount += x.Amount);
    return (Math.round(TotalAmount * 100) / 100).toString();
  }

  CheckQTYinFInal(item:number){
    var qty = 0;
    this.FinalQuotationList.forEach(x=>{
      x.FinalQuoteBodyList.forEach(y=>{
        if(y.LOG_SupplierQuotationRecord_ID==item){
          qty+=1;
        }
      })
    });
    return qty;
  }


  ChangeSupplieLog(Resultlog: ResultQuoteLog, FinalLog: FinalQuotationLog) {
    if (this.SummarySupplierLog.filter(x => x.Choice).length == 1) {
      var newrow = this.SummarySupplierLog.find(x => x.Choice);
      this.SelectFinalQuotationLog.PartNO = newrow.PartNo;
      this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).PartNO = newrow.PartNo;
      this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).PartDes = newrow.QuoteItemNumber + newrow.QuoteTypeName;
      this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).Weight = Resultlog.Weight;
      this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).Currency = Resultlog.Currency;
      this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).ExchangeRate = Resultlog.ExchangeRate;
      this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).UnitPrce = 0;
      this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).Amount = 0;
    }
    if (this.SummarySupplierLog.filter(x => x.Choice).length == 0) {
      this.SelectFinalQuotationLog.PartNO = '';
      this.FinalQuotationList.splice(FinalLog.Rowindex - 1, 1);
      var log = new FinalQuotationLog();
      log.FORM_Quotation_ID = parseInt(this.ResultHeader.FORM_Quotation_ID);
      log.DeliveryDays = this.DeliveryDays;
      log.DeliveryTerm = this.ResultHeader.DeliveryTerm;
      log.Rowindex = FinalLog.Rowindex;
      this.FinalQuotationList.push(log);

    } else {
      var FinalQuotationLog_ID = this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).FinalQuotationLog_ID;
      this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).FinalQuoteBodyList = new Array<FinalQuotationLogBody>();

      this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).UnitPrce = 0;
      this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).Amount = 0;
      this.SummarySupplierLog.forEach(x => {
        var newrow = new FinalQuotationLogBody();
        if (x.Choice) {
          newrow.FORM_QuotationDetail_ID = x.FORM_QuotationDetail_ID;
          newrow.FORM_QuotationResult_Log_ID = x.FORM_QuotationResult_Log_ID;
          newrow.FORM_Quotation_ID = parseInt(this.ResultHeader.FORM_Quotation_ID);
          newrow.FinalQuotationLog_ID = FinalQuotationLog_ID;
          newrow.LOG_SupplierQuotationRecord_ID = x.LOG_SupplierQuotationRecord_ID;
          this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).FinalQuoteBodyList.push(newrow);
        };
      });
      this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).QTY = 1;
      this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).UnitPrce = Math.round(this.SummarySupplierLog.filter(x => x.Choice).map(x => x.UnitPrice).reduce((a, b) => a + b) * 100) / 100;
      this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).Amount = Math.round(this.SummarySupplierLog.filter(x => x.Choice).map(x => x.Amount).reduce((a, b) => a + b) * 100) / 100;
      if (this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).PartNO == "9009") {
        this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).WeightPrice = Math.round(this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).UnitPrce / this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).Weight * 100) / 100;
      } else {
        this.FinalQuotationList.find(x => x.Rowindex == FinalLog.Rowindex).WeightPrice = 0;
      }
      this.FinalQuotationList.sort((a,b)=>a.Rowindex-b.Rowindex);
    }



  }
}

function DatetoyyyyMMdd(newdate: Date) {

  var formatedate = new Date(newdate);
  if (formatedate != null) {
    var year = formatedate.getFullYear().toString();
    var month = (formatedate.getMonth() + 1).toString();
    while (month.length < 2) {
      month = "0" + month;
    }
    var odate = formatedate.getDate().toString();
    while (odate.length < 2) {
      odate = "0" + odate;
    }
    var yyyyMMdd = year + month + odate;
  }
  return yyyyMMdd;
}
