import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { MainProductionOrder, ProcessData } from 'src/app/Model/production';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductionOrderListRequest } from 'src/bin/productionOrderListRequest';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ExportWoodenReportRequest } from 'src/bin/exportWoodenReportRequest';

@Component({
  selector: 'app-delivery',
  templateUrl: './ProductionStatus.component.html',
  styleUrls: ['./ProductionStatus.component.css']
})
export class ProductionStatusComponent implements OnInit {


  done: Array<MainProductionOrder> = new Array<MainProductionOrder>();
  LineList: Array<string> = new Array<string>();
  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
  PlanDate: Array<string> = new Array<string>();

  SearchStartday: string = "";
  SearchEndday: string = "";

  ProcessList: Array<string> = ['造模', '造模(砂心)', '合模'];
  ProductionList: Array<ProcessData> = [];

  printdata: Array<MainProductionOrder> = new Array<MainProductionOrder>();

  fileName = 'ExcelSheet.xlsx';
  //木模匯出時間區間
  WoodenStartday: string = "";
  WoodenEndday: string = "";
  constructor(
    private router: Router,
    public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private modalService: NgbModal,

  ) { }

  ngOnInit() {
    this.GetMOCTAList();

  }

  backPage() {
    if (confirm("確定要回列表嗎？")) {
      this.router.navigate(['login_success/']);
    }
  }
  GetMOCTAList() {
    this.spinnerService.show();
    const request: ProductionOrderListRequest = {
      Account: this.UserAccount,
      QueryFlaskInfo:true,
      QueryScheduleDate:true
    }
    this.rest.apiProductionOrderList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        console.log("res:"+JSON.stringify(res.ScheduleTableList));
        this.done = res.ScheduleTableList;
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }),
      tap(() => {
        this.SetData();
        this.spinnerService.hide();
      })
    ).subscribe();
  }

  SetData() {
    this.LineList = new Array<string>();
    this.PlanDate = new Array<string>();
    this.done.filter(x => (this.SearchStartday == '' || x.SchedulingDate >= this.SearchStartday.replace(/\-/g, ''))
      && (this.SearchEndday == '' || x.SchedulingDate <= this.SearchEndday.replace(/\-/g, ''))).forEach(x => {
        if (!this.LineList.includes(x.MoldingLineName)) {
          this.LineList.push(x.MoldingLineName);
        }
        if (!this.PlanDate.includes(x.SchedulingDate)) {
          this.PlanDate.push(x.SchedulingDate);
        }
      });
    if (this.LineList.includes('')) {
      this.LineList[this.LineList.indexOf('')] = '空白';
    }
    this.LineList = this.LineList.sort((a, b) => a.localeCompare(b));
    this.PlanDate = this.PlanDate.sort((a, b) => a.localeCompare(b));
  }
  FilterDate(sdate: string, line: string, list: Array<MainProductionOrder>) {
    var ret = list.filter(x => x.SchedulingDate == sdate && x.MoldingLineName == line).sort((a, b) =>
      a.AsemblingLineName?.localeCompare(b.AsemblingLineName) || a.PlanFinDate?.localeCompare(b.PlanFinDate)
    );
    return ret;
  }

  exportexcel() {
    /* table id is passed over here */
    let element = document.getElementById('excel-table-hidden');
    console.log(element);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName,);
  }
  ExportWoodenExcel() {
    this.spinnerService.show();
    const request: ExportWoodenReportRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      StartDate: this.WoodenStartday,
      EndDate: this.WoodenEndday
    }
    this.rest.apiExportWoodenReport(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        const filePath = `${this.rest.APserver}${res.ExcelFilePath}`;
        window.open(filePath);
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  openmodal(modal, size) {
    this.modalService.open(modal, { centered: true, size: size });
  }

  //yyyymmdd=>yyyy-mm-dd
  DateStringFormat(date: string) {
    if (date.length < 8)
      return date

    return date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
  }
}

