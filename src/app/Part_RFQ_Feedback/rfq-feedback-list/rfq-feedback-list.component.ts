import { Component, Inject, OnInit, Input, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { RFQService } from 'src/app/Service/rfq.service';
import { DOCUMENT } from "@angular/common";
import { QuotationDetailVendor, SupplierQuotationDetail, QuotationDetail, QuotationDetailAnnexRep, FORM_QuotationDetailSupplierMap } from 'src/app/Model/vo';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum, RFQ_FeedbackList } from 'src/app/Enum/session-enum.enum';
import { HttpEventType } from '@angular/common/http';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RFQAttachListRequest } from 'src/bin/rFQAttachListRequest';
import { catchError, tap } from 'rxjs/operators';
import { QuerySingleQuotationDetailRequest } from 'src/bin/querySingleQuotationDetailRequest';
import { of } from 'rxjs';
import { SupplierAttachAllListReqeust } from 'src/bin/supplierAttachAllListReqeust';
import { SupplierQuotationDetailListRequest } from 'src/bin/supplierQuotationDetailListRequest';

@Component({
  selector: 'app-rfq-feedback-list',
  templateUrl: './rfq-feedback-list.component.html',
  styleUrls: ['./rfq-feedback-list.component.css']
})

export class RFQFeedbackListComponent implements OnInit {
  FBList: Array<SupplierQuotationDetail>;
  QuotationDetailAttachList: any;
  ReportAttachList: Array<QuotationDetailAnnexRep>;
  ReportLogList: Array<FORM_QuotationDetailSupplierMap>;
  FeedbackDescrpiton: string = "";
  FeedbackPrice: string = "";
  FeedbackItem: string = "";
  selectQuotationDetail: SupplierQuotationDetail = new SupplierQuotationDetail();
  QuotationDetail: QuotationDetail = new QuotationDetail();
  PageSize: number = 15;
  TotalCount: number = 0;
  Page: number = 1;
  formData: FormData = new FormData();
  Uploaded: string = "0KB";
  UploadTotal: string = "0KB";
  ProgressPercent: number = 0;
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
  SearchText: string = "";
  QuotationIsClosedString: string = "未結案";
  StatusList: Array<string> = [
    "全部",//3
    "未結案", //2
    "結案"//1

  ];
  QuotationIsClosedNumber: string = "2";
  constructor(
    @Inject(DOCUMENT) private document,
    private router: Router,
    public rest: RFQService,
    private inj: Injector,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private crypt: CustomValidateService
  ) {

  }

  ngOnInit() {
    this.InitialPage();
  }

  InitialPage() {
    const page = this.session.retrieve(RFQ_FeedbackList.Page);
    const selectitem = this.session.retrieve(RFQ_FeedbackList.SelectItem);
    if (page > 0) {
      this.Page = page;
      this.selectQuotationDetail = selectitem;
      this.queryFeedbackList(page.toString());
    } else {
      this.queryFeedbackList('1');
    }
  }

  queryFeedbackList(StartPage: string) {
    this.spinnerService.show();
    const request: SupplierQuotationDetailListRequest = {
      SearchText: this.SearchText,
      USR_Supplier_ID: this.session.retrieve(LoginSessionEnum.SupplierID),
      ListCount: this.PageSize.toString(),
      PageNumber: StartPage,
      Status: this.QuotationIsClosedNumber
    }
    this.rest.apiSupplierQuotationDetailList(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.FBList = res.SupplierQuotationDetailReps;
        this.TotalCount = Number(res.TotalCount);
        this.spinnerService.hide()
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe()
  }

  ChangeIsClosed(Value: string) {
    switch (Value) {
      case "未結案":
        this.QuotationIsClosedString = Value;
        this.QuotationIsClosedNumber = "2";
        break;
      case "結案":
        this.QuotationIsClosedString = Value;
        this.QuotationIsClosedNumber = "1";
        break;
      case "全部":
        this.QuotationIsClosedString = Value;
        this.QuotationIsClosedNumber = "3";
        break;
    };
  }


  queryQuotationAttachList(SupplierQuotationDetail: SupplierQuotationDetail) {
    this.selectQuotationDetail = SupplierQuotationDetail;
    this.spinnerService.show();
    const request: RFQAttachListRequest = {
      FORM_Quotation_ID: SupplierQuotationDetail.FORM_Quotation_ID,
      FORM_QuotationDetail_ID: SupplierQuotationDetail.FORM_QuotationDetail_ID,
      ListCount: '10',
      PageNumber: '1'
    }
    return this.rest.apiRFQAttachList(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.QuotationDetailAttachList = res.QuotationAnnexReps;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }

  queryReportAttachList() {
    this.spinnerService.show();
    const reuqest: SupplierAttachAllListReqeust = {
      FORM_QuotationDetail_ID: this.selectQuotationDetail.FORM_QuotationDetail_ID,
      USR_Supplier_ID: this.session.retrieve(LoginSessionEnum.SupplierID)
    }
    this.rest.apiSupplierAttachAllList(reuqest).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.ReportAttachList = res.QuotationDetailAnnexReps
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  EditQuotation(SupplierQuotationDetail: SupplierQuotationDetail) {
    this.selectQuotationDetail = SupplierQuotationDetail;
    this.session.store(RFQ_FeedbackList.Page, this.Page);
    this.session.store(RFQ_FeedbackList.SelectItem, this.selectQuotationDetail);
    let s = JSON.stringify(SupplierQuotationDetail);
    console.log("S:", this.crypt.AESEncrypt(s));
    this.router.navigate(['login_success/SupplierQuotation'], { queryParams: { Q: this.crypt.AESEncrypt(s) } });
  }

  EditMutipleQuotation() {
    this.session.store(RFQ_FeedbackList.Page, this.Page);
    this.session.store(RFQ_FeedbackList.SelectItem, this.selectQuotationDetail);
    this.router.navigate(['login_success/SupplierMutipleQuoteComponent']);
  }



  reportDialog(SupplierQuotationDetail: SupplierQuotationDetail) {
    this.spinnerService.show();
    this.selectQuotationDetail = SupplierQuotationDetail;
    this.queryQuotationAttachList(SupplierQuotationDetail).subscribe();
    this.queryReportAttachList();
    const request: QuerySingleQuotationDetailRequest = {
      FORM_QuotationDetail_ID: SupplierQuotationDetail.FORM_QuotationDetail_ID,
      FORM_SupplierQuote_ID: this.session.retrieve(LoginSessionEnum.UserAccount)
    };
    this.rest.apiQuerySingleQuotationDetail(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.spinnerService.hide();
        this.QuotationDetail = res.quotationDetail
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  chooseFile(files: FileList) {
    // this.document.getElementById('filestatus').setAttribute('style', 'color:red;visibility:hidden;');
    this.formData = new FormData();
    this.formData.append('fileupload', files.item(0), files.item(0).name);
    this.formData.append('FORM_QuotationDetail_ID', this.selectQuotationDetail.FORM_QuotationDetail_ID);
    this.formData.append('LoginAccount', this.session.retrieve(LoginSessionEnum.UserAccount));
  }

  uploadReportAttach() {
    if (this.document.getElementById('fileupload').value != "") {
      this.document.getElementById('progressbar').setAttribute('style', 'visibility:visible;');
      this.document.getElementById('fileupload').disabled = true;
      this.document.getElementById('fileupload_btn').disabled = true;
      this.rest.API_Upload_RFQDetailUploadAttach(this.formData).subscribe(
        x => {
          if (x.type === HttpEventType.UploadProgress) {
            this.Uploaded = (x.loaded / 1024).toFixed(0).toString() + "KB";
            this.UploadTotal = (x.total / 1024).toFixed(0).toString() + "KB";
            this.ProgressPercent = Math.round(100 * x.loaded / x.total);
          }
        },
        err => {
          console.log(err);
          this.document.getElementById('fileupload').value = "";
          this.document.getElementById('fileupload').setAttribute('files', '');
          this.Uploaded = "0KB";
          this.UploadTotal = "0KB";
          this.ProgressPercent = 0;
          this.document.getElementById('progressbar').setAttribute('style', 'visibility:hidden;');
          this.document.getElementById('fileupload').disabled = false;
          this.document.getElementById('fileupload_btn').disabled = false;
          this.queryReportAttachList();
        },
        () => {
          console.log("complete!");
          this.document.getElementById('fileupload').value = "";
          this.document.getElementById('fileupload').setAttribute('files', '');
          this.Uploaded = "0KB";
          this.UploadTotal = "0KB";
          this.ProgressPercent = 0;
          this.document.getElementById('progressbar').setAttribute('style', 'visibility:hidden;');
          this.document.getElementById('fileupload').disabled = false;
          this.document.getElementById('fileupload_btn').disabled = false;
          this.queryReportAttachList();
        }
      );
    } else {
      this.document.getElementById('progressbar').setAttribute('style', 'visibility:hidden;');
      this.document.getElementById('fileupload').disabled = false;
      this.document.getElementById('fileupload_btn').disabled = false;
    }
  }
  loadPage(page: number) {
    this.Page = page;
    this.session.store(RFQ_FeedbackList.Page, this.Page);
    this.queryFeedbackList(page.toString());
  }

  updateReportDetail() {
    this.spinnerService.show();
    let vendor: QuotationDetailVendor = new QuotationDetailVendor()
    vendor.USR_Supplier_ID = "1";
    this.selectQuotationDetail.QuotePrice = this.FeedbackPrice;
    this.selectQuotationDetail.QuoteRemark = this.FeedbackDescrpiton;
    this.rest.API_Update_MOFeedBack(this.selectQuotationDetail.FORM_QuotationDetailSupplierMap_ID,
      this.selectQuotationDetail.QuotePrice, this.selectQuotationDetail.QuoteRemark, this.session.retrieve(LoginSessionEnum.UserAccount))
      .then(
        (list) => {
          this.spinnerService.hide();
          this.queryFeedbackList("1");
        }, (fail) => {
          this.spinnerService.hide();
        }
      )
  }
  DeleteSupplierAttach(attach: QuotationDetailAnnexRep) {
    this.spinnerService.show();
    this.rest.API_Delete_SupplierAttach(attach.FORM_QuotationDetailAnnexMap_ID, this.session.retrieve(LoginSessionEnum.SupplierID))
      .then(
        (list) => {
          this.spinnerService.hide();
          this.queryReportAttachList();

        }, (fail) => {
          this.spinnerService.hide();
        }
      )

  }

  isnumber(value: string) {
    var num = Number.parseFloat(value);
    return !(Number.isNaN((Number.parseFloat(value)))) && num.toString().length == value.length;
  }

  SelectQuoDetail(feedback: SupplierQuotationDetail) {
    this.selectQuotationDetail = feedback;
  }



}
