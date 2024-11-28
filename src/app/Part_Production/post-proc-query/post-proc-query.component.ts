import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { catchError, tap } from 'rxjs/operators';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { PostProcQueryRequest } from 'src/bin/postProcQueryRequest';
import { of } from 'rxjs';
import { PostProcQuery } from 'src/bin/postProcQueryResponse';
import * as XLSX from 'xlsx';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
@Component({
  selector: 'app-post-proc-query',
  templateUrl: './post-proc-query.component.html',
  styleUrls: ['./post-proc-query.component.css']
})
export class PostProcQueryComponent implements OnInit {
  fileName = 'ExcelSheet.xlsx';

  constructor(public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService) { }
    ProdcSelected:string;
    Type:string = "0";
    Date:string = new Date().toISOString().split('T')[0];
    prodCnt:number = 0;
    prodCntOn:number = 0;
    prodCntOnKg:number = 0;
    prodCntNotOn:number = 0;
    prodCntNotOnKg:number = 0;
    GridData:Array<PostProcQuery>;// 報工紀錄

    GridDataOn:Array<PostProcQuery> = [];// 未出站
    GridDataNotOn:Array<PostProcQuery> = [];// 未進站
    ngOnInit(): void {

    }

    exportexcel(tabId:string) {
      /* table id is passed over here */
      let element = document.getElementById(tabId);
      console.log(element);
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, this.fileName,);
    }
    query()
    {
      if (this.ProdcSelected === '' || this.ProdcSelected === undefined)
      {
        this.rest.alertWithMessage("生產線別尚未選取");
        return;
      }
      if (this.Type === '' || this.Type === undefined)
      {
        this.rest.alertWithMessage("進/出站尚未選取");
        return;
      }
      if (this.Date === '' || this.Date === undefined)
      {
        this.rest.alertWithMessage("日期尚未選取");
        return;
      }
      console.log("ProductionSelected:"+this.ProdcSelected+',Type:'+this.Type+',Date:'+this.Date);
      const request:PostProcQueryRequest = {
        Account:this.session.retrieve(LoginSessionEnum.UserAccount),
        Name:this.session.retrieve(LoginSessionEnum.Name),
        prodcSelected:this.ProdcSelected,
        type:this.Type,
        date:this.Date
      };
      this.prodCnt = 0;
      this.PostProcQuery(request).subscribe();

    }

    PostProcQuery(request:PostProcQueryRequest){
      this.spinnerService.show();
      return this.rest.apiPostProcQuery(request).pipe(
        tap(res =>{
            if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
              throw (res.ErrorMsg);
            }
            this.GridData = res.result;
            this.GridData.forEach(x => {
              if (this.Type == "0")
                this.prodCnt += x.InStationQty;
              else if (this.Type == "1")
                this.prodCnt += x.OutStationQty;
            });
            this.PostProcQueryOn(request).subscribe();
            this.spinnerService.hide();
          }
        ),
        catchError((res)=>{
          this.spinnerService.hide();
          return of()
        })
      );
    }

    PostProcQueryOn(request:PostProcQueryRequest){
      // this.spinnerService.show();
      return this.rest.apiPostProcQueryOn(request).pipe(
        tap(res =>{
            if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
              throw (res.ErrorMsg);
            }
            this.prodCntOn = 0;
            this.prodCntNotOn = 0;
            this.prodCntOnKg = 0;
            this.prodCntNotOnKg = 0;
            console.log('result:', res.result );
            localStorage.setItem('Token', res.Token);
            this.GridDataOn = res.result.filter(x => x.Category == '未出站');
            this.GridDataNotOn = res.result.filter(x => x.Category == '未進站');
            this.GridDataOn.forEach(x =>{
              this.prodCntOn += x.WorkOrderQty;
              this.prodCntOnKg += x.WorkOrderQty * x.UnitWeight;
            });
            this.GridDataNotOn.forEach(x =>{
              this.prodCntNotOn += x.WorkOrderQty;
              this.prodCntNotOnKg += x.WorkOrderQty * x.UnitWeight;
            });
            // console.log(this.GridDataOn);
            this.spinnerService.hide();
          }
        ),
        catchError((res)=>{
          this.spinnerService.hide();
          return of()
        })
      );
    }
}
