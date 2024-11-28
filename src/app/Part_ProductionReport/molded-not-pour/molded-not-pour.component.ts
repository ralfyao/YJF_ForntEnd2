import { Component, OnInit } from '@angular/core';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
// import { NgxSpinnerService } from 'ngx-spinner/lib/ngx-spinner.service';
// import { SessionStorageService } from 'ngx-webstorage/lib/services/sessionStorage';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MoldedNotPour } from 'src/bin/moldNotPour';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { SessionStorageService } from 'ngx-webstorage';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import {NgxDatatableModule} from
@Component({
  selector: 'app-molded-not-pour',
  templateUrl: './molded-not-pour.component.html',
  styleUrls: ['./molded-not-pour.component.css']
})
export class MoldedNotPourComponent implements OnInit {

  constructor( public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private modalService: NgbModal
  ) { }
  timeout: any;
  TotalWeightSum:number;//可合模總重
  TotalWeightSumPour:number;//可澆注總重
  moldableData:Map<string, Array<any>>;
  moldableGroupSummary:Map<string, Array<any>>;
  pourableData:Map<string, Array<any>>;
  pourableGroupSummary:Map<string, Array<any>>;
  keyMoldable:string[] = [];
  keyPourable:string[] = [];
  asemPrevNotPourSum:number;// 前日未澆注總噸數
  asemCurrentNotPourSum:number;// 當日未澆注總噸數
  asemInQtySum:number;// 當日合模進站總噸數
  achieveRate:number;// 總達成率
  moldableWeightTotal:number;// 當日可合模公斤數
  moldableQtyTotal:number;// 當日可合模台數
  GridData:Array<MoldedNotPour>;
  ngOnInit(): void {
    this.queryMoldableData();
    this.queryPourableData();
    //this.GetMoldedNotPourData().subscribe();
  }
  GetMoldedNotPourData() {

    this.spinnerService.show();
    this.TotalWeightSum = 0;
    return this.rest.apiMoldedNotPourList().pipe(
      tap(res=>{
        this.GridData = res.resultList;
        this.GridData.forEach(x =>{
          this.TotalWeightSum += x.TotalWeight;
        });
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
    //throw new Error('Method not implemented.');
  }
  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
    }, 100);
  }

  ExportData() {
    this.spinnerService.show();
    this.rest.apiExportMoldNotPourData().pipe(
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
  ExportPourableData(){
    this.spinnerService.show();
    this.rest.apiExportPourableData().pipe(
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
  ExportMoldableData(){
    this.spinnerService.show();
    this.rest.apiExportMoldableData().pipe(
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
  queryMoldableData(){
    this.spinnerService.show();
    return this.rest.apiQueryMoldableData().pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.moldableData = res.result;
        this.moldableGroupSummary = res.groupSummary;
        console.log(this.moldableData);
        this.moldableQtyTotal = 0;
        this.moldableWeightTotal = 0;
        Object.keys(this.moldableData).forEach(key=>{
          console.log(key);
          this.keyMoldable.push(key);
          this.moldableQtyTotal += this.moldableGroupSummary[key].summaryTotalQuantity;
          this.moldableWeightTotal += this.moldableGroupSummary[key].summaryTotalWeight;
          // for(let i = 0 ; i < this.moldableData[key].length; i ++)
          // {
          //   this.moldableQtyTotal += this.moldableData[key][i].Quantity;
          //   this.moldableWeightTotal += this.moldableData[key][i].TotalWeight;
          // }
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
  strip(number) {
    return (parseFloat(number).toPrecision(3));
  }
  queryPourableData(){
    this.spinnerService.show();
    return this.rest.apiQueryPourableData().pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.pourableData = res.result;
        this.pourableGroupSummary = res.groupSummary;
        console.log(this.pourableGroupSummary);
        this.asemPrevNotPourSum = 0;
        this.asemCurrentNotPourSum = 0;
        this.TotalWeightSumPour = 0;
        this.asemInQtySum = 0;
        this.achieveRate =0;
        Object.keys(this.pourableData).forEach(key=>{
          this.keyPourable.push(key);
          console.log(this.pourableGroupSummary[key]);
          this.asemPrevNotPourSum += this.pourableGroupSummary[key].asemPrevNotPourSum;
          this.asemCurrentNotPourSum += this.pourableGroupSummary[key].totalWeightSum;
          this.asemInQtySum += this.pourableGroupSummary[key].asemInQtySum;
          this.achieveRate += this.pourableGroupSummary[key].achieveRate;
          this.pourableData[key].forEach(element => {
            this.TotalWeightSumPour += element.TotalWeight;
          });
        });
        console.log(this.keyPourable.length);
        this.achieveRate /= this.keyPourable.length;
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
