import { Component, OnInit, Inject, Injector } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, RouterState, ActivatedRoute } from '@angular/router';
import { RFQService } from 'src/app/Service/rfq.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PermissionService } from 'src/app/Service/permission.service';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import { SupplierQuotationRecord, QuotationDetail, QuotationDetailAnnexRep, YJFQuotationAttachRep } from 'src/app/Model/vo';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { HttpEventType } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { RFQAttachListRequest } from 'src/bin/rFQAttachListRequest';
import { catchError, tap } from 'rxjs/operators';
import { SupplierAttachAllListReqeust } from 'src/bin/supplierAttachAllListReqeust';
import { of } from 'rxjs';

@Component({
  selector: 'app-supplier-mutiple-quote',
  templateUrl: './supplier-mutiple-quote.component.html',
  styleUrls: ['./supplier-mutiple-quote.component.css']
})
export class SupplierMutipleQuoteComponent implements OnInit {
  SupplierQuotationList: Array<SupplierQuotationRecord> = new Array<SupplierQuotationRecord>();
  newdetail: SupplierQuotationRecord = new SupplierQuotationRecord();
  QuotationDetaillist: Array<QuotationDetail> = new Array<QuotationDetail>();
  QuotationDetail: QuotationDetail = new QuotationDetail();
  SupplierAttachList: Array<QuotationDetailAnnexRep>;
  SupplierAttachLevelShow: Array<number>;
  QuotationAttachList: Array<YJFQuotationAttachRep> = new Array<YJFQuotationAttachRep>();
  UserName: string;
  YJFttachLevelShow: Array<number> = new Array<number>();
  SupplierAttach: QuotationDetailAnnexRep = new QuotationDetailAnnexRep();
  formData: FormData = new FormData();
  Uploaded: string = "0KB";
  UploadTotal: string = "0KB";
  ProgressPercent: number = 0;
  QuotationDetailAttachList: any;
  CollapseYJFTable: boolean = false;
  CollapseYJFTableString: string = "查看尚未報價資訊";
  FORM_SupplierQuote_ID: number = 0;
  FORM_QuotationDetailSupplierMap_ID: string = "";
  FORM_QuotationDetail_ID: string;
  constructor(
    @Inject(DOCUMENT) private document,
    private router: Router,
    public rest: RFQService,
    private inj: Injector,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    public premanager: PermissionService,
    private crypt: CustomValidateService
  ) {
    const state: RouterState = this.router.routerState;
    const root: ActivatedRoute = state.root;
    root.queryParams.subscribe(params => {
      let data = this.crypt.AESDecrypt(params['Q'])
      if (data == undefined) {
        this.FORM_SupplierQuote_ID = 0;
      }
      else {
        var checkRecord = new SupplierQuotationRecord();
        checkRecord = JSON.parse(data);
        this.FORM_SupplierQuote_ID = checkRecord.FORM_SupplierQuote_ID;
        this.QueryLogByFORM_SupplierQuote_ID(checkRecord.FORM_SupplierQuote_ID);
        this.querySupplierAttachList();
        this.queryFeedbackList();

      }
    });
  }

  ngOnInit() {
    this.UserName = this.session.retrieve(LoginSessionEnum.Name);
    this.queryFeedbackList();

  }

  backPage() {
    this.router.navigate(['login_success/RFQFeedback']);
  }

  queryFeedbackList() {
    this.spinnerService.show();
    this.rest.API_AllSupplierQuotationDetailList(this.session.retrieve(LoginSessionEnum.SupplierID), this.FORM_SupplierQuote_ID).then(
      (data) => {
        this.QuotationDetaillist = data['AllSupplierQuotationDetailList'];
        this.spinnerService.hide();
      }, () => {
        this.spinnerService.hide();
      }
    )
  }

  QuotationItem() {
    this.newdetail = new SupplierQuotationRecord();
    this.newdetail.FORM_QuotationDetail_ID = this.QuotationDetail.FORM_QuotationDetail_ID;
    this.newdetail.UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
    this.newdetail.USR_Supplier_ID = this.session.retrieve(LoginSessionEnum.SupplierID);
  }


  CaculateNewDetail() {
    if (this.QuotationDetail.SYS_QuoteType_ID == "13") {
      this.newdetail.QuotePrice = Number.parseFloat(this.QuotationDetail.CastingWeight) * this.newdetail.QuoteWeightPrice * this.newdetail.QuoteQty;
    }
    else {
      this.newdetail.QuotePrice = this.newdetail.QuoteUnitPrice * this.newdetail.QuoteQty;
    }
  }
  chooseFile(files: FileList) {
    // this.document.getElementById('filestatus').setAttribute('style', 'color:red;visibility:hidden;');
    this.formData = new FormData();
    this.formData.append('fileupload', files.item(0), files.item(0).name);
    this.formData.append('FORM_QuotationDetail_ID', this.newdetail.FORM_QuotationDetail_ID);
    this.formData.append('FORM_QuotationDetailSupplierMap_ID', this.FORM_QuotationDetailSupplierMap_ID);
    this.formData.append('FORM_SupplierQuote_ID', this.FORM_SupplierQuote_ID.toString());
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
          this.querySupplierAttachList();
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
          this.querySupplierAttachList();
        }
      );
    } else {
      this.document.getElementById('progressbar').setAttribute('style', 'visibility:hidden;');
      this.document.getElementById('fileupload').disabled = false;
      this.document.getElementById('fileupload_btn').disabled = false;
    }
  }

  querySupplierAttachList() {
    this.spinnerService.show();
    const request: SupplierAttachAllListReqeust = {
      FORM_QuotationDetail_ID: this.FORM_QuotationDetail_ID,
      USR_Supplier_ID: this.session.retrieve(LoginSessionEnum.SupplierID),
      FORM_SupplierQuote_ID: this.FORM_SupplierQuote_ID.toString()
    }

    this.rest.apiSupplierAttachAllList(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.SupplierAttachList = res.QuotationDetailAnnexReps;
        this.SupplierAttachLevelShow = [0];
        this.SupplierAttachList.forEach(x => {
          if (x.TextPage > 0) {
            this.SupplierAttachLevelShow.push(x.TextPage)
          }
        });
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  SupplierAttachSelect(Attach: QuotationDetailAnnexRep) {
    this.SupplierAttach = Attach;
  }
  DeleteSupplierAttach(Attach: QuotationDetailAnnexRep) {
    this.rest.API_Delete_SupplierAttach(Attach.FORM_QuotationDetailAnnexMap_ID, this.session.retrieve(LoginSessionEnum.SupplierID))
      .then(
        (list) => {
          this.querySupplierAttachList();
          this.SupplierAttach = new QuotationDetailAnnexRep;

        }, (fail) => {
        }
      )
  }

  AddSupplierQuotationDetail(newdetail: SupplierQuotationRecord) {
    newdetail.FORM_QuotationDetail_ID = this.QuotationDetail.FORM_QuotationDetail_ID;
    newdetail.UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
    newdetail.USR_Supplier_ID = this.session.retrieve(LoginSessionEnum.SupplierID);
    newdetail.YJFQuoteItemString = this.QuotationDetail.QuoteItemNumber;
    newdetail.FORM_SupplierQuote_ID = this.FORM_SupplierQuote_ID;
    this.FORM_QuotationDetail_ID = this.QuotationDetail.FORM_QuotationDetail_ID;
    this.rest.API_InsertSupplierQuotationRecordList(newdetail).then(
      (data) => {
        var FORM_SupplierQuote_ID = data['FORM_SupplierQuote_ID'];
        this.FORM_SupplierQuote_ID = FORM_SupplierQuote_ID;
        var FORM_QuotationDetailSupplierMap_ID = data['FORM_QuotationDetailSupplierMap_ID'];
        this.FORM_QuotationDetailSupplierMap_ID = FORM_QuotationDetailSupplierMap_ID;

        this.QueryLogByFORM_SupplierQuote_ID(FORM_SupplierQuote_ID);
      }, (fail) => {

      }
    );

    this.newdetail = new SupplierQuotationRecord();

    this.document.getElementById('newdetailQuoteItem').focus();
  }

  QueryLogByFORM_SupplierQuote_ID(FORM_SupplierQuote_ID: number) {
    this.rest.API_QueryLogByFORM_SupplierQuote_ID(FORM_SupplierQuote_ID, this.session.retrieve(LoginSessionEnum.SupplierID)).then(
      (data) => {
        this.SupplierQuotationList = data['LogSupplierRecordList'];
      }, (fail) => {

      }
    )
  }

  queryQuotationAttachList(QuotationDetail: QuotationDetail) {
    this.spinnerService.show();
    const request: RFQAttachListRequest = {
      FORM_Quotation_ID: QuotationDetail.FORM_Quotation_ID,
      FORM_QuotationDetail_ID: QuotationDetail.FORM_QuotationDetail_ID,
      ListCount: '10',
      PageNumber: '1'
    }
    this.rest.apiRFQAttachList(request).pipe(
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
    ).subscribe();

  }

  CollapseYJFTableChange() {
    this.CollapseYJFTable = !this.CollapseYJFTable;
    if (this.CollapseYJFTable) {
      this.CollapseYJFTableString = "收起表單";
    } else {
      this.CollapseYJFTableString = "查看尚未報價資訊";
    }

  }

  DeleteSupplierRecord(Log: SupplierQuotationRecord) {
    this.rest.API_Delete_SupplierRecord(Log.LOG_SupplierQuotationRecord_ID)
      .then(
        (list) => {
          this.QueryLogByFORM_SupplierQuote_ID(this.FORM_SupplierQuote_ID);
        }, (fail) => {
        }
      );
  }




}
