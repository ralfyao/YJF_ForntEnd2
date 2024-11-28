import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { PROD_ShutDownRecord } from 'src/bin/getShutDownHistoryResponse';
@Component({
  selector: 'app-order-shut-record',
  templateUrl: './order-shut-record.component.html',
  styleUrls: ['./order-shut-record.component.css']
})
export class OrderShutRecordComponent implements OnInit {

  constructor(
    private spinnerService: NgxSpinnerService,
    private rest: ProdutionService) {

   }
  // workOrderHead:string;
  workOrder:string;

  history:Array<PROD_ShutDownRecord>;
  ngOnInit(): void {
  }
  GetData(){
    this.spinnerService.show();
    this.history = [];
    return this.rest.apiGetShutDownHist(this.workOrder).pipe(
      tap(res=>{
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        console.log(JSON.stringify(res));
        this.history = res.history;
        this.spinnerService.hide();
      }),
      catchError((res)=>{
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }
  Query(){
    //alert('Query');
    this.GetData().subscribe();
  }
}
