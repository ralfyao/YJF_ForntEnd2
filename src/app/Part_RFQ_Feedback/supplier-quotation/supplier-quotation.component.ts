import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { Router, RouterState, ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { CustomService } from 'src/app/Service/Custom.service';
import { RFQService } from 'src/app/Service/rfq.service';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { QuotationDetail, SupplierQuotationDetail, QuotationDetailAnnexRep, YJFQuotationAttachRep, SupplierQuotationRecord } from 'src/app/Model/vo';
import { HttpEventType } from '@angular/common/http';
import { PermissionService } from 'src/app/Service/permission.service';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RFQAttachListRequest } from 'src/bin/rFQAttachListRequest';
import { catchError, tap } from 'rxjs/operators';
import { SweetAlertService } from 'src/app/Service/sweet-alert.service';
import { QuerySingleQuotationDetailRequest } from 'src/bin/querySingleQuotationDetailRequest';
import { SupplierAttachAllListReqeust } from 'src/bin/supplierAttachAllListReqeust';
import { of } from 'rxjs';


@Component({
  selector: 'app-supplier-quotation',
  templateUrl: './supplier-quotation.component.html',
  styleUrls: ['./supplier-quotation.component.css']
})
export class SupplierQuotationComponent implements OnInit {
  SupplierQuotation: SupplierQuotationDetail;
  SupplierQuotationList: Array<SupplierQuotationRecord>;
  newdetail: SupplierQuotationRecord = new SupplierQuotationRecord();
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
        this.SupplierQuotation = new SupplierQuotationDetail();
      }
      else {
        this.SupplierQuotation = JSON.parse(data);
      }
    });
  }

  ngOnInit() {
    this.reportDialog(this.SupplierQuotation);
    this.YJFttachLevelShow = new Array<number>();
    this.queryQuotationAttachList();
    this.querySupplierAttachList();
    this.UserName = this.session.retrieve(LoginSessionEnum.Name);
    this.querySupplierQuoteLogList();
  }

  backPage() {
    this.router.navigate(['login_success/RFQFeedback']);
  }
  reportDialog(SupplierQuotationDetail: SupplierQuotationDetail) {
    this.spinnerService.show();
    const request: QuerySingleQuotationDetailRequest = {
      FORM_QuotationDetail_ID: SupplierQuotationDetail.FORM_QuotationDetail_ID,
      FORM_SupplierQuote_ID: this.session.retrieve(LoginSessionEnum.UserAccount)
    };
    this.rest.apiQuerySingleQuotationDetail(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.QuotationDetail = res.quotationDetail;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  querySupplierAttachList() {
    this.spinnerService.show();
    const request: SupplierAttachAllListReqeust = {
      FORM_QuotationDetail_ID: this.SupplierQuotation.FORM_QuotationDetail_ID,
      USR_Supplier_ID: this.session.retrieve(LoginSessionEnum.SupplierID),
      FORM_SupplierQuote_ID: this.SupplierQuotation.FORM_SupplierQuote_ID.toString()
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



  EditQuotation(SupplierQuotationRecord: SupplierQuotationRecord) {
    let s = JSON.stringify(SupplierQuotationRecord);
    console.log("S:", this.crypt.AESEncrypt(s));
    this.router.navigate(['login_success/SupplierMutipleQuoteComponentv=${' + new Date(Date.now()).toDateString() + '}'], { queryParams: { Q: this.crypt.AESEncrypt(s) } });
  }

  queryQuotationAttachList() {
    this.spinnerService.show();
    const request: RFQAttachListRequest = {
      FORM_Quotation_ID: this.SupplierQuotation.FORM_Quotation_ID,
      FORM_QuotationDetail_ID: this.SupplierQuotation.FORM_QuotationDetail_ID,
      ListCount: '10',
      PageNumber: '1'
    }
    this.rest.apiRFQAttachList(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.YJFttachLevelShow = [0];
        this.QuotationAttachList = res.QuotationAnnexReps;
        this.QuotationAttachList.forEach(x => {
          if (x.TextPage > 0) {
            this.YJFttachLevelShow.push(x.TextPage)
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
  querySupplierQuoteLogList() {
    this.rest.API_Query_FeedbackLogList(this.SupplierQuotation.FORM_QuotationDetail_ID, this.session.retrieve(LoginSessionEnum.SupplierID))
      .then(
        (list) => {
          this.SupplierQuotationList = list['supplierQuotationRecordList'];
        }, (fail) => {

        }
      )
  }
  AddSupplierQuotationDetail(newdetail: SupplierQuotationRecord) {
    newdetail.FORM_QuotationDetail_ID = this.QuotationDetail.FORM_QuotationDetail_ID;
    newdetail.UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
    newdetail.USR_Supplier_ID = this.session.retrieve(LoginSessionEnum.SupplierID);
    this.rest.API_InsertSupplierQuotationRecord(newdetail).then(
      (data) => {
        this.querySupplierQuoteLogList();
      }, (fail) => {

      }
    )
    this.newdetail = new SupplierQuotationRecord();
    this.document.getElementById('newdetailQuoteItem').focus();
  }

  DeleteSupplierRecord(Log: SupplierQuotationRecord) {
    this.rest.API_Delete_SupplierRecord(Log.LOG_SupplierQuotationRecord_ID)
      .then(
        (list) => {
          this.querySupplierQuoteLogList();
        }, (fail) => {
        }
      )
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
  SupplierAttachSelect(Attach: QuotationDetailAnnexRep) {
    this.SupplierAttach = Attach;
  }

  selectAddQuoteItem() {
    this.newdetail = new SupplierQuotationRecord();
    this.newdetail.QuotePrice = 0;
    this.newdetail.QuoteQty = 1;
    this.newdetail.QuoteUnitPrice = 0;
    this.newdetail.QuoteWeightPrice = 0;
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
    this.formData.append('FORM_QuotationDetail_ID', this.SupplierQuotation.FORM_QuotationDetail_ID);
    this.formData.append('FORM_QuotationDetailSupplierMap_ID', this.SupplierQuotation.FORM_QuotationDetailSupplierMap_ID);
    this.formData.append('FORM_SupplierQuote_ID', this.SupplierQuotation.FORM_SupplierQuote_ID.toString());
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



}
