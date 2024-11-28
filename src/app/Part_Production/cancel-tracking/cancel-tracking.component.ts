import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { CancelTrackingRequest } from 'src/bin/cancelTrackingRequest';
import { ProductProcessTracking } from 'src/bin/productProcessTrackingResponse';
import { SftLineListResponseLineCodeName } from 'src/bin/SftLineListResponseLineCodeName';

@Component({
  selector: 'app-cancel-tracking',
  templateUrl: './cancel-tracking.component.html',
  styleUrls: ['./cancel-tracking.component.css']
})
export class CancelTrackingComponent implements OnInit {

  constructor(public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private production: ProdutionService) { }

  lineList: Array<SftLineListResponseLineCodeName> = [];
  GridData:Array<ProductProcessTracking> = [];
  lineId:string = '';
  WorkOrder:string = '';
  startDate:string='';
  endDate:string='';
  request:CancelTrackingRequest;

  ngOnInit(): void {
    this.getLineList();
  }
  /**
   * 取消進出站
   * @param workOrder 工單
   * @param serial 站點
   * @param status 進/出站
   */
  cancelTracking(workOrder:string, serial:string, status:string){
    console.log(`workOrder:${workOrder}, serial:${serial}, status:${status}`);
    this.request = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      workOrder: workOrder,
      serial:serial,
      status:status
    } as CancelTrackingRequest;
    this.spinnerService.show();
    this.rest.apiCancelTracking(this.request).pipe(
      tap(
        res =>{
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            if (res.WorkStatus == 'NG'){
              this.spinnerService.hide();
              this.rest.errorWithErrorMsg(res.ErrorMsg);
            }
            else{
              throw (res.ErrorMsg);
            }
          }
          else
          {
            this.spinnerService.hide();
            this.rest.successMessage("執行成功");
          }
        }
      ),
      catchError((res)=>{
        this.rest.alertWithMessage(res.ErrorMsg);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  query():void{
    console.log('WorkOrder:'+this.WorkOrder);
    console.log('lineId:'+this.lineId);
    console.log('startDate:'+this.startDate);
    console.log('endDate:'+this.endDate);
    // console.log('type:'+this.type);
    if(this.WorkOrder.trim() == ''
     && this.lineId == ''
     && this.startDate == ''
     && this.endDate == ''
    //  && this.type == ''
    ){
      this.rest.errorWithErrorMsg('請至少輸入一查詢條件');
      return;
    }
    this.GridData =[];
    // this.supplementWoArray = [];
    this.spinnerService.show();
    var workOrder:string = "";

    // this.totalDataCount = 0;
    // this.supplementReportWorkingCount = 0;
    this.rest.apiQueryProductProcessTracking(
      this.WorkOrder,
      this.lineId,
      this.startDate,
      this.endDate,
      '',
      true
    ).pipe(
      tap(res =>{
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            throw (res.ErrorMsg);
          }
          res.result.forEach((i) => {
            this.GridData.push(i);
          });
          // this.GridData.forEach((i) =>{
          //   if (workOrder != i.WorkOrder){
          //     workOrder = i.WorkOrder;
          //     this.totalDataCount ++;
          //   }
          // });
          var dataSupplement = this.GridData.filter(x => x.Comment == '補報工');
          var array = dataSupplement.reduce((item, item2)=>{
            let found = item.find(i => i.WorkOrder === item2.WorkOrder);
            if (!found){
              item.push(item2);
            }
            return item;
          }, []);
          // this.supplementWoArray = array.map(x => x.WorkOrder);
          // this.supplementRate = this.setval(this.supplementWoArray.length, this.totalDataCount );
          this.spinnerService.hide();
        }
      ),
      catchError((res)=>{
        this.rest.alertWithMessage(res.ErrorMsg);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  queryNoSubscribe(){
    console.log('WorkOrder:'+this.WorkOrder);
    console.log('lineId:'+this.lineId);
    console.log('startDate:'+this.startDate);
    console.log('endDate:'+this.endDate);
    // console.log('type:'+this.type);
    if(this.WorkOrder.trim() == ''
     && this.lineId == ''
     && this.startDate == ''
     && this.endDate == ''
    //  && this.type == ''
    ){
      this.rest.errorWithErrorMsg('請至少輸入一查詢條件');
      return;
    }
    this.GridData =[];
    // this.supplementWoArray = [];
    this.spinnerService.show();
    var workOrder:string = "";

    // this.totalDataCount = 0;
    // this.supplementReportWorkingCount = 0;
    return this.rest.apiQueryProductProcessTracking(
      this.WorkOrder,
      this.lineId,
      this.startDate,
      this.endDate,
      '',
      true
    ).pipe(
      tap(res =>{
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            throw (res.ErrorMsg);
          }
          res.result.forEach((i) => {
            this.GridData.push(i);
          });
          // this.GridData.forEach((i) =>{
          //   if (workOrder != i.WorkOrder){
          //     workOrder = i.WorkOrder;
          //     this.totalDataCount ++;
          //   }
          // });
          var dataSupplement = this.GridData.filter(x => x.Comment == '補報工');
          var array = dataSupplement.reduce((item, item2)=>{
            let found = item.find(i => i.WorkOrder === item2.WorkOrder);
            if (!found){
              item.push(item2);
            }
            return item;
          }, []);
          // this.supplementWoArray = array.map(x => x.WorkOrder);
          // this.supplementRate = this.setval(this.supplementWoArray.length, this.totalDataCount );
          this.spinnerService.hide();
        }
      ),
      catchError((res)=>{
        this.rest.alertWithMessage(res.ErrorMsg);
        this.spinnerService.hide();
        return of()
      })
    );
  }
  getLineList() {
    this.spinnerService.show();
    this.production.apiSftLineList().pipe(
      tap(res => {
        this.lineList = res.lineCodeNames;
      })
    ).subscribe().add(() => { this.spinnerService.hide(); });
  }
}
