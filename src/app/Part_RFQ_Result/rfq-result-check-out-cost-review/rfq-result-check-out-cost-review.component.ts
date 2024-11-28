import { Component, OnInit, Input, Injector, Inject } from '@angular/core';
import { RFQService } from 'src/app/Service/rfq.service';
import { ClosedQuotationResult, QuotationList, SupplierQuoteLog, ResultQuoteLog, FinalQuotationLog, YJFPartNo } from 'src/app/Model/vo';

import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { DOCUMENT } from "@angular/common";
import { PermissionService } from 'src/app/Service/permission.service';
import { Router, RouterState, ActivatedRoute } from '@angular/router';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-rfq-result-check-out-cost-review',
  templateUrl: './rfq-result-check-out-cost-review.component.html',
  styleUrls: ['./rfq-result-check-out-cost-review.component.css']
})
export class RfqResultCheckOutCostReviewComponent implements OnInit {
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
  FinalQuotationLog: FinalQuotationLog = null;
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
        var newresult = this.ResultQyoteLogList.filter(x => x.Choice);


        this.rest.API_QueryFinalQuotationLog(parseInt(this.ResultHeader.FORM_Quotation_ID), this.session.retrieve(LoginSessionEnum.UserAccount)).then(
          (data) => {
            if (data['FinalQuotationLog'].length > 0) {
              this.FinalQuotationList = data['FinalQuotationLog'];
              this.FinalQuotationList.forEach(x => {
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
  CheckoutResult() {
    let s = JSON.stringify(this.ResultHeader);
    this.router.navigate(['login_success/RFQResulCheckOut'], { queryParams: { RFQ: this.crypt.AESEncrypt(s) } });
  }
  CaculateResultLogByWeightPrice(log: ResultQuoteLog) {
    if (this.selectDetail_VendorList.find(x => x.LOG_SupplierQuotationRecord_ID == log.LOG_SupplierQuotationRecord_ID).SYS_QuoteType_ID == 13||this.selectDetail_VendorList.find(x => x.LOG_SupplierQuotationRecord_ID == log.LOG_SupplierQuotationRecord_ID).SYS_QuoteType_ID == 15) {
      log.UnitPrice = parseFloat((log.SinglePrice * log.Weight).toFixed(2));
      log.ProfitRatio = parseFloat((log.SinglePrice * log.ExchangeRate / this.selectlog.QuoteWeightPrice).toFixed(2));
      log.Amount = parseFloat((log.UnitPrice * log.QuoteQTY).toFixed(2));
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
  CurrencySetAll() {
    let log = this.selectResultLog;
    this.ResultQyoteLogList.filter(x => x.FORM_QuotationDetail_ID == log.FORM_QuotationDetail_ID).forEach(x => {
      x.Currency = log.Currency;
      x.ExchangeRate = log.ExchangeRate;
      var selectlog = this.selectDetail_VendorList.find(y => y.LOG_SupplierQuotationRecord_ID == x.LOG_SupplierQuotationRecord_ID)

      if (x.SYS_QuoteType_ID != 13&&x.SYS_QuoteType_ID != 15) {
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
  CaculateResultLog(log: ResultQuoteLog) {

    if (this.selectDetail_VendorList.find(x => x.LOG_SupplierQuotationRecord_ID == log.LOG_SupplierQuotationRecord_ID).SYS_QuoteType_ID == 13||this.selectDetail_VendorList.find(x => x.LOG_SupplierQuotationRecord_ID == log.LOG_SupplierQuotationRecord_ID).SYS_QuoteType_ID == 15) {
      log.SinglePrice = parseFloat((this.selectlog.QuoteWeightPrice * log.ProfitRatio / log.ExchangeRate).toFixed(2));
      log.UnitPrice = parseFloat((log.SinglePrice * log.Weight).toFixed(2));
      log.Amount = parseFloat((log.UnitPrice * log.QuoteQTY).toFixed(2));

    }
    else {
      log.UnitPrice = parseFloat((this.selectlog.QuoteUnitPrice * log.ProfitRatio / log.ExchangeRate).toFixed(2));
      log.Amount = parseFloat((log.UnitPrice * log.QuoteQTY).toFixed(2));
    }

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
  backPage() {
    this.router.navigate(['login_success/RFQResultList']);
  }
  ConfirmQuoteDetail() {
    this.selectlog = null;
    this.selectdetail = null;
  }

  SaveFORM_QuotationResultLog() {
    this.spinnerService.show();
    var ResultQyoteLogList = this.ResultQyoteLogList.filter(x => x.Choice);
    this.rest.API_UpdateFORM_QuotationResultLog(ResultQyoteLogList, this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        this.spinnerService.hide();
      }, () => {

      }
    );
  }
  MaxWidth() {
    var maxsup = "";
    var supid = "";
    var maxamount = "";
    var amountid = "";
    this.ResultQyoteLogList.filter(x => x.Choice).forEach(x => {
      if (x.SupplierName.length > maxsup.length) {
        maxsup = x.SupplierName;
        supid = x.LOG_SupplierQuotationRecord_ID.toString();
      }
      if (x.Amount.toString().length > maxamount.length) {
        maxamount = x.Amount.toString();
        amountid = x.LOG_SupplierQuotationRecord_ID.toString();
      }

    });
    var maxsuptd = this.document.getElementById("Sup" + supid);

    if (maxsuptd != null && maxsuptd != undefined) {
      var maxwidths = maxsuptd.offsetWidth;
      this.ResultQyoteLogList.filter(x => x.Choice).forEach(x => {
        var tds = this.document.getElementById("Sup" + x.LOG_SupplierQuotationRecord_ID.toString());
        if (tds != null) {
          tds.setAttribute('style', 'width :' + maxwidths + 'px');
        }

      });
    };

    var maxamounttd = this.document.getElementById("Amu" + amountid);
    if (maxamounttd != null && maxamounttd != undefined) {
      var maxwidtha = maxamounttd.offsetWidth;
      this.ResultQyoteLogList.filter(x => x.Choice).forEach(x => {
        var tda = this.document.getElementById("Amu" + x.LOG_SupplierQuotationRecord_ID.toString());
        if (tda != null) {
          tda.setAttribute('style', 'width :' + maxwidtha + 'px');
        }

      });
    };
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

