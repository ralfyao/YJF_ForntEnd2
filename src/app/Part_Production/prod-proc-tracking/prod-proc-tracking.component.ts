import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { ProductProcessTracking, ProductProcessTrackingResponse } from 'src/bin/productProcessTrackingResponse';
import { SftLineListResponseLineCodeName } from 'src/bin/SftLineListResponseLineCodeName';

@Component({
  selector: 'app-prod-proc-tracking',
  templateUrl: './prod-proc-tracking.component.html',
  styleUrls: ['./prod-proc-tracking.component.css']
})
export class ProdProcTrackingComponent implements OnInit {

  constructor(public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private production: ProdutionService,
    private session: SessionStorageService) { }
  WorkOrder:string = '';
  startDate:string='';
  endDate:string='';
  type:string='';
  lineList: Array<SftLineListResponseLineCodeName> = [];
  lineGroupNames:string[];
  lineId:string = '';
  supplementReportWorkingCount:number;
  supplementWoArray:string[] = [];
  supplementRate:number;
  totalDataCount:number;
  InChecked:boolean;
  OutChecked:boolean;
  GridData:Array<ProductProcessTracking> = [];
  supplementByGroup:Map<string, number> = new Map<string, number>();
  supplementByGroupList:Array<string> = [];
  supplementWorkOrderList:string[] = [];
  ngOnInit(): void {
    this.getLineList();
    // var date = new Date();
    // this.startDate = this.formatDate(date);
    // this.endDate = this.formatDate(date);
  }
  MaterialSelectChange(){
    if ((!this.InChecked && !this.OutChecked) ||
        (this.InChecked && this.OutChecked))
    {
      this.type = "InOut";
    }
    if (this.InChecked){
      this.type = "In";
    }
    if (this.OutChecked){
      this.type = "Out";
    }
  }
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  /**
   *獲得所有產線別
   *
   * @memberof MouldMaintainReqeustComponent
   */
  getLineList() {
    this.spinnerService.show();
    this.production.apiSftLineList().pipe(
      tap(res => {
        this.lineList = res.lineCodeNames;
      })
    ).subscribe().add(() => { this.spinnerService.hide(); });
  }
  onStartDateChange(){

  }
  onEndDateChange(){

  }
  query():void{
    console.log('WorkOrder:'+this.WorkOrder);
    console.log('lineId:'+this.lineId);
    console.log('startDate:'+this.startDate);
    console.log('endDate:'+this.endDate);
    console.log('type:'+this.type);
    if(this.WorkOrder.trim() == ''
     && this.lineId == ''
     && this.startDate == ''
     && this.endDate == ''
     && this.type == ''){
      this.rest.errorWithErrorMsg('請至少輸入一查詢條件');
      return;
    }
    this.GridData =[];
    this.supplementWoArray = [];
    this.spinnerService.show();
    var workOrder:string = "";
    this.totalDataCount = 0;
    this.supplementReportWorkingCount = 0;
    this.rest.apiQueryProductProcessTracking(
      this.WorkOrder,
      this.lineId,
      this.startDate,
      this.endDate,
      this.type
    ).pipe(
      tap(res =>{
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            throw (res.ErrorMsg);
          }
          res.result.forEach((i) => {
            this.GridData.push(i);
          });
          this.GridData.forEach((i) =>{
            if (workOrder != i.WorkOrder){
              workOrder = i.WorkOrder;
              this.totalDataCount ++;
            }
          });
          this.supplementByGroup = new Map<string, number>();
          this.supplementWorkOrderList = [];
          this.supplementByGroupList = [];
          var dataSupplement = this.GridData.filter(x => x.Comment == '補報工');
          dataSupplement.forEach(x =>{
            if (!this.supplementByGroup.has(x.ProdGroup)){
              let supplementCnt = 0;
              if (this.supplementWorkOrderList.indexOf(x.WorkOrder) == -1)
              {
                supplementCnt++;
                this.supplementWorkOrderList.push(x.WorkOrder);
              }
              this.supplementByGroup.set(x.ProdGroup, supplementCnt);
            } else {
              let supplementCnt = this.supplementByGroup.get(x.ProdGroup);
              if (supplementCnt == null || supplementCnt == undefined)
              {
                supplementCnt = 0;
              }
              if (this.supplementWorkOrderList.indexOf(x.WorkOrder) == -1)
              {
                supplementCnt++;
                this.supplementWorkOrderList.push(x.WorkOrder);
              }
              this.supplementByGroup.set(x.ProdGroup, supplementCnt);
            }
          });
          // this.supplementByGroupList = this.supplementByGroup;
          console.log('supplementByGroup:',this.supplementByGroup);
          var array = dataSupplement.reduce((item, item2)=>{
            let found = item.find(i => i.WorkOrder === item2.WorkOrder);
            if (!found){
              item.push(item2);
            }
            return item;
          }, []);
          this.supplementWoArray = array.map(x => x.WorkOrder);
          this.supplementRate = this.setval(this.supplementWoArray.length, this.totalDataCount );
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
  setval(currentValue: number, maxValue: number) {
    return parseFloat((currentValue / maxValue * 100).toString());
  }
}
