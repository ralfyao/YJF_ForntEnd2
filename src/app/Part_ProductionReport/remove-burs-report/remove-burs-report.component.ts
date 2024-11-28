import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, tap, filter } from 'rxjs/operators';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { RemoveBursReport } from 'src/bin/removeBursReport';
import { of } from 'rxjs';
@Component({
  selector: 'app-remove-burs-report',
  templateUrl: './remove-burs-report.component.html',
  styleUrls: ['./remove-burs-report.component.css']
})
export class RemoveBursReportComponent implements OnInit {

  constructor(public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,) { }
  InStationDateStart:string;
  InStationDateEnd:string;
  TotalGrandWeightSum:number = 0;//總重加總
  GridData:Map<string,any[]> = new Map<string, any[]>();
  posWorkerNames:string[] = [];
  ngOnInit(): void {
    this.InStationDateStart = new Date().toISOString().slice(0, 7);
    let InStationDateStartDT = new Date(this.InStationDateStart+"-01");
    this.InStationDateEnd = new Date(InStationDateStartDT.setMonth(InStationDateStartDT.getMonth()+1)).toISOString().slice(0, 7);//new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 7);
    this.GetData();
  }
  GetData(){
    this.spinnerService.show();
    let InStationDateStartDT = new Date(this.InStationDateStart+"-01");
    this.InStationDateEnd = new Date(InStationDateStartDT.setMonth(InStationDateStartDT.getMonth()+1)).toISOString().slice(0, 7);//new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 7);
    return this.rest.apiRemoveBursReport(this.InStationDateStart, this.InStationDateEnd).pipe(
      tap(res=>{
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        console.log(res.resultDict);
        this.GridData = res.resultDict;
        this.posWorkerNames = Object.keys(this.GridData);
        console.log('posWorkerNames',this.posWorkerNames);
        this.posWorkerNames.forEach(x =>{
          // if(this.GridData.has(x)){
            let list = this.GridData[x];
            list.forEach(element => {
              this.TotalGrandWeightSum += element.TotalWeight;
            });
            // console.log(list);
          // }
        //   console.log('x', x);
        //   // list.forEach(y =>{
        //   //   this.TotalGrandWeightSum += y.TotalWeight;
        //   // });
        });
        // console.log(this.GridData);
        this.spinnerService.hide();
      }),
      catchError((res) => {
        console.log(res);
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  exportExcel()
  {
    this.spinnerService.show();
    // const request: ExportWoodenReportRequest = {
    //   Account: this.session.retrieve(LoginSessionEnum.UserAccount),
    //   StartDate: this.WoodenStartday,
    //   EndDate: this.WoodenEndday
    // }
    this.rest.apiExportRemoveBursReport(this.InStationDateStart, this.InStationDateEnd).pipe(
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
}
