import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { ProdutionReportService } from 'src/app/Service/ProductionReport.service';
import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { PostProcEstiProd } from 'src/bin/postProcEstiProd';
import { UtilityService } from 'src/app/Service/utility.service';
import { PostProcEstiProdResult } from 'src/bin/queryPostProcEstiProdResult';
@Component({
  selector: 'app-post-proc-esti-prod-rpt',
  templateUrl: './post-proc-esti-prod-rpt.component.html',
  styleUrls: ['./post-proc-esti-prod-rpt.component.css']
})
export class PostProcEstiProdRptComponent implements OnInit {


  constructor(public rest: ProdutionReportService,
    private session: SessionStorageService,
    private spinnerService: NgxSpinnerService,
    private utilityService:UtilityService) { }
  @ViewChild(DatatableComponent)
  datatable: DatatableComponent;
  selectedRow: any = {};
  ngOnInit(): void {
    this.GetData().subscribe();
  }
  gridData:Array<PostProcEstiProd>;
  total: number[] = [];
  WorkOrderParm:string = '';
  PartNoParm:string = '';
  PartDescParm:string = '';
  InStationDateParm:string = '';
  SignDateParm:string = '';
  param:any;
  queryResult:PostProcEstiProdResult[];
  GetData(){
    this.spinnerService.show();
    return this.rest.API_PostProcEstiProd().pipe(
      tap(res=>{
        this.gridData = res.result;
        var index = 0;
        this.gridData.forEach(x=>{
          this.total.push(0);
          x.postProcEstiProdElem.forEach(y=>{
            if (this.total[index] === undefined)
              this.total[index] = 0;
            this.total[index] += y.Quantity * y.UnitWeight;
          });
          index++;
        });
        index = 0;
        this.total.forEach(x=>{
          console.log('total'+index+':'+x);
          index++;
        });
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }
  getValueForColumn(rowData: any, column: any, index: number): number {
    // 返回當前單元格的值
    return rowData[column.prop];
  }

  submit(datatable: DatatableComponent, row: any){
    console.log('datatable:', datatable.rows[row]);
    // console.log('row:', datatable.rows[row]);
    // alert(row);

    this.spinnerService.show();
    return this.rest.API_PostProcProdSign(datatable.rows[row].WorkOrder).pipe(
      tap(res=>{
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.rest.successMessage("執行成功");
        this.gridData = [];
        this.spinnerService.hide();
      }),
      catchError((res)=>{
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }),
      switchMap(() => {
        return this.rest.API_PostProcEstiProd().pipe(
          tap(res=>{
            // const data = res;
            // const data = JSON.stringify(res.result);
            // console.log(JSON.parse(data));
            this.gridData = res.result;
            // console.log("gridData:"+this.gridData);
            var index = 0;
            this.gridData.forEach(x=>{
              this.total.push(0);
              //console.log(x.unpackOutDate);
              x.postProcEstiProdElem.forEach(y=>{
                if (this.total[index] === undefined)
                  this.total[index] = 0;
                this.total[index] += y.Quantity * y.UnitWeight;
              });
              index++;
            });
            index = 0;
            this.total.forEach(x=>{
              console.log('total'+index+':'+x);
              index++;
            });
            // this.GridData.forEach(x =>{
            //   this.TotalWeightSum += x.TotalWeight;
            // });
            this.spinnerService.hide();
          }),
          catchError((res) => {
            this.rest.errorWithErrorMsg(res);
            this.spinnerService.hide();
            return of()
          })
        );
      })
    ).subscribe();
  }

  updateTotal(index: number, value: string) {
    const num = parseFloat(value);
    if (isNaN(num)) {
      this.total[index] = 0;
    } else {
      this.total[index] = num;
    }
  }

  getTotalValue(): number {
    return this.total.reduce((acc, cur) => acc + cur, 0);
  }
  query(){
    this.queryResult = [];
    if (this.WorkOrderParm === '' &&
      this.PartNoParm === '' &&
      this.PartDescParm === '' &&
      this.InStationDateParm === '' &&
      this.SignDateParm === ''
    )
    {
      this.rest.errorWithErrorMsg('請輸入查詢條件!');
      return;
    }
    this.param = {
      workOrder: this.WorkOrderParm,
      partNo: this.PartNoParm,
      partDesc: this.PartDescParm,
      inStationDate: this.InStationDateParm,
      signDate: this.SignDateParm
    }
    this.spinnerService.show();
    this.rest.apiQueryProdProcEstProd(this.param).pipe(
      tap((res) =>{
        console.log(res);
        this.queryResult = res.result;
        this.spinnerService.hide();
      }),
      catchError(res => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
}
