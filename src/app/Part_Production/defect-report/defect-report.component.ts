import { Component, OnInit } from '@angular/core';
import { ProductionLineGroup } from 'src/app/Model/production';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { DefectReportRequest } from 'src/bin/defectReportRequest';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ExportDefectReportRequest } from 'src/bin/exportDefectReportRequest';

@Component({
  selector: 'app-defect-report',
  templateUrl: './defect-report.component.html',
  styleUrls: ['./defect-report.component.css']
})
export class DefectReportComponent implements OnInit {

  constructor(
    public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
  ) { }

  ProductionGroupList: ProductionLineGroup[];

  ActiveGroup: string = "";//當Tab群組
  date: Date = new Date();
  StartDate: string = this.DateFormat(new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1));
  EndDate: string = this.DateFormat(new Date(this.date.getFullYear(), this.date.getMonth(), 0));
  AllProductWeight: number = 0;
  AllDefectTotalWeight: number = 0;
  AllDefectiveRate: number = 0;
  AllSuccessRate: number = 0;
  ngOnInit(): void {
    this.updateDefectReport();
  }
  startdatechange() {
    this.EndDate = this.DateFormat(new Date(new Date(this.StartDate).getFullYear(), new Date(this.StartDate).getMonth() + 1, 0));
  }

  tabclick(item: ProductionLineGroup) {
    this.ActiveGroup = item.ProductionLineName;
  }
  ExportExcel() {
    this.spinnerService.show();
    const request: ExportDefectReportRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      StartDate: this.StartDate,
      EndDate: this.EndDate
    };
    this.rest.apiExportDefectReport(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        const dataPath = `${this.rest.APserver}${res.ExcelFilePath}`;
        window.open(dataPath);
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  updateDefectReport() {
    this.spinnerService.show();
    const request: DefectReportRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      StartDate: this.StartDate,
      EndDate: this.EndDate
    };
    this.rest.apiDefectReport(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.ProductionGroupList = res.ProductionGroupList;
        this.AllProductWeight = res.AllProductWeight;
        this.AllDefectTotalWeight = res.AllDefectTotalWeight;
        this.AllDefectiveRate = res.AllDefectiveRate;
        this.AllSuccessRate = res.AllSuccessRate;
        if (this.ProductionGroupList.length > 0) {
          this.ActiveGroup = this.ProductionGroupList[0].ProductionLineName;
        }
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  DateFormat(date) {
    date = new Date(date);

    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    return year + '-' + month + '-' + day;
  }

}
