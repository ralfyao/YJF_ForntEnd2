import { Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { CalculateLineProductionResponseResult } from 'src/bin/calculateLineProductionResponseResult';
import { LineProductionScheduleListRequest } from 'src/bin/lineProductionScheduleListRequest';
import { LineProductionScheduleListResponseResult } from 'src/bin/lineProductionScheduleListResponseResult';
import { RecalLineProdScheduleRequest } from 'src/bin/recalLineProdScheduleRequest';

@Component({
  selector: 'app-scheduleTrial',
  templateUrl: './scheduleTrial.component.html',
  styleUrls: ['./scheduleTrial.component.css']
})
export class ScheduleTrialComponent implements OnInit, OnChanges, DoCheck  {
  @Output() backRequest: EventEmitter<any> = new EventEmitter();
  @Output() switchRequest: EventEmitter<CalculateLineProductionResponseResult> = new EventEmitter();
  @Output() getCalculateLineProduction: EventEmitter<string> = new EventEmitter();
  @Input() pouringDateStart: string;
  @Input() pouringDateEnd: string;
  @Input() set tableData(data: Array<CalculateLineProductionResponseResult>) {
    if (!data) return
    this._tableData = data.map((i) => {
      return {
        ...i,
        patternStartDay: i.patternStartDay
      }
    });
    this.dateTable = Object.keys(this._tableData[0]).filter((i) => i.includes('Day'));
    this._tableData.forEach((i) => {
      this.dateTable.forEach((ii) => {
        i[ii] = this.convertDate(i[ii])
      })
    })
    // console.log(this._tableData)
  }
  get tableData() {
    return this._tableData
  }
  _tableData: Array<CalculateLineProductionResponseResult> = [];
  theadList: Array<string> = [];
  dateTable: Array<string> = [];
  workOrder:string;
  partNo:string;
  tasks: LineProductionScheduleListResponseResult;
  cchange:LineProductionScheduleListResponseResult;
  prevDate:string;
  previousValue: any;
  inputValue: any;
  fromVice:boolean;
  constructor(
    private rest: ProdutionService,
    private session: SessionStorageService,
    private spinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    private sessionSt: SessionStorageService
  ) { }
  ngDoCheck(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cchange = changes.tableData.currentValue;
  }

  ngOnInit() {
    console.log("scheduleManagement",this.sessionSt.retrieve("scheduleManagementName"));
    this.fromVice = this.sessionSt.retrieve("scheduleManagementName") == "scheduleManagementVice";
    this.theadList = ['操作', '客戶簡稱', '訂單單別-單號', '預計出貨日', '製令單單別-單號', '單重', '品號', '品名', '預計完成日'//, '鐵斗編號'
      , '木模日期', '造模組別', '造模日期', '合模組別', '合模日期', '澆注日期', '拆箱日期', '退火日期', '去毛邊日期', '後處理3日期', '後處理4日期', '後處理5日期'];
    this.workOrder = this.route.snapshot.queryParams["workOrder"];
    this.partNo = this.route.snapshot.queryParams["partNo"];
  }
  checkDate(workOrder:string, category:string, startDate:string, endDate:string, nextStartDate:string, item:LineProductionScheduleListResponseResult = null){
    var strCategory:string;
    switch(category){
      case 'pattern':
        strCategory = "木模";
        break;
      case 'mold':
        strCategory = "造模";
        break;
      case 'moldClosing':
        strCategory = "合模";
        break;
      case 'pouring':
        strCategory = "澆注";
        // item.pouringEndDay = item.pouringStartDay;
        break;
      case 'unpack':
        strCategory = "拆箱";
        break;
      case 'annel':
        strCategory = "退火";
        break;
      case 'deRough':
        strCategory = "去毛邊";
        break;
      case 'post3':
        strCategory='後處理3';
        break;
      case 'post4':
        strCategory='後處理4';
        break;
      case 'post5':
        strCategory='後處理5';
        break;
    }
    if (parseInt(startDate.split('-').join('')) > parseInt(endDate.split('-').join('')) ||
        parseInt(endDate.split('-').join('')) < parseInt(startDate.split('-').join(''))){
      this.rest.alertWithMessage(workOrder+":"+strCategory+'起始日期：'+startDate+'大於結束日期:'+endDate);
    }
    // alert("nextStartDate:"+nextStartDate+",endDate:"+endDate);
    if (parseInt(nextStartDate.split('-').join('')) < parseInt(endDate.split('-').join('')) ||
        parseInt(endDate.split('-').join('')) > parseInt(nextStartDate.split('-').join(''))){
      this.rest.alertWithMessage(workOrder+":"+strCategory+'下一站起始日期'+nextStartDate+'小於'+strCategory+'結束日期'+endDate);
    }
  }

  seeChange(item:LineProductionScheduleListResponseResult, event:any)
  {
    this.tasks = item;
    while(this.cchange != undefined)
    {
      break;
    }
    // patternStartDay
    if(item.patternStartDay != undefined && parseInt(this.cchange[0].patternStartDay.split('-').join('')) < parseInt(item.patternStartDay.split('-').join('')))
    {
      this.rest.alertWithMessage(item.workOrderNumber+":木模起始日"+item.patternStartDay+"晚於原先的起始日"+this.cchange[0].patternStartDay);
    }
    // moldingStartDay
    if(item.moldingStartDay != undefined &&  parseInt(this.cchange[0].moldingStartDay.split('-').join('')) < parseInt(item.moldingStartDay.split('-').join('')))
    {
      this.rest.alertWithMessage(item.workOrderNumber+":造模起始日"+item.moldingStartDay+"晚於原先的起始日"+this.cchange[0].moldingStartDay);
    }
    // moldClosingStartDay
    if(item.moldClosingStartDay != undefined && parseInt(this.cchange[0].moldClosingStartDay.split('-').join('')) < parseInt(item.moldClosingStartDay.split('-').join('')))
    {
      this.rest.alertWithMessage(item.workOrderNumber+":合模起始日"+item.moldClosingStartDay+"晚於原先的起始日"+this.cchange[0].moldClosingStartDay);
    }
    // pouringStartDay
    if(item.unpackStartDay != undefined && parseInt(this.cchange[0].unpackStartDay.split('-').join('')) < parseInt(item.unpackStartDay.split('-').join('')))
    {
      this.rest.alertWithMessage(item.workOrderNumber+":拆箱起始日"+item.unpackStartDay+"晚於原先的起始日"+this.cchange[0].unpackStartDay);
    }
    // annelProcStartDay
    if(item.annelProcStartDay != undefined && parseInt(this.cchange[0].annelProcStartDay.split('-').join('')) < parseInt(item.annelProcStartDay.split('-').join('')))
    {
      this.rest.alertWithMessage(item.workOrderNumber+":退火起始日"+item.annelProcStartDay+"晚於原先的起始日"+this.cchange[0].annelProcStartDay);
    }
    // deRoughEdgeProcStartDay
    if(item.deRoughEdgeProcStartDay != undefined && parseInt(this.cchange[0].deRoughEdgeProcStartDay.split('-').join('')) < parseInt(item.deRoughEdgeProcStartDay.split('-').join('')))
    {
      this.rest.alertWithMessage(item.workOrderNumber+":磨毛邊起始日"+item.deRoughEdgeProcStartDay+"晚於原先的起始日"+this.cchange[0].deRoughEdgeProcStartDay);
    }
    // post3ProcStartDay
    if(item.post3ProcStartDay != undefined && parseInt(this.cchange[0].post3ProcStartDay.split('-').join('')) < parseInt(item.post3ProcStartDay.split('-').join('')))
    {
      this.rest.alertWithMessage(item.workOrderNumber+":磨毛邊起始日"+item.post3ProcStartDay+"晚於原先的起始日"+this.cchange[0].post3ProcStartDay);
    }
    // post4ProcStartDay
    if(item.post4ProcStartDay != undefined && parseInt(this.cchange[0].post4ProcStartDay.split('-').join('')) < parseInt(item.post4ProcStartDay.split('-').join('')))
    {
      this.rest.alertWithMessage(item.workOrderNumber+":磨毛邊起始日"+item.post4ProcStartDay+"晚於原先的起始日"+this.cchange[0].post4ProcStartDay);
    }
    // post5ProcStartDay
    if(item.post5ProcStartDay != undefined && parseInt(this.cchange[0].post5ProcStartDay.split('-').join('')) < parseInt(item.post5ProcStartDay.split('-').join('')))
    {
      this.rest.alertWithMessage(item.workOrderNumber+":磨毛邊起始日"+item.post5ProcStartDay+"晚於原先的起始日"+this.cchange[0].post5ProcStartDay);
    }
  }

  dateCols(colName: string): boolean {
    return colName.includes('日期')
  }

  convertDate(date: string): string {
    if (!date) return
    date = date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
    return date
  }

  goBack() {
    this.onTrial();
    this.backRequest.emit();
  }

  lock(data: CalculateLineProductionResponseResult) {
    this.switchRequest.emit(data);
  }

  onTrial() {
    this.spinnerService.show();
    const request: RecalLineProdScheduleRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      woStationDates: [],
      WorkOrder:this.workOrder,
      PartNo:this.partNo
    }
    const lineCodes = ['0010', '0020', '0030',
      '0040', '0050', '0060', '0070', '0080', '0085', '0090']
    this.tableData.forEach((i) => {
      lineCodes.forEach((ii) => {
        let temp = this.getEachDate(ii);
        if (i[temp[0]]) {
          request.woStationDates.push({
            workOrder: i.workOrderNumber,
            lineCode: ii,
            startDate: i[temp[0]]?.split('-').join('') ?? '',
            endDate: i[temp[1]]?.split('-').join('') ?? ''
          })
        }
      })
    })

    this.rest.apiRecalLineProdSchedule(request).pipe(
      tap((res) => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.spinnerService.hide();
      }),
      switchMap(() => {
        this.spinnerService.show();
        const request: LineProductionScheduleListRequest = {
          Account: this.session.retrieve(LoginSessionEnum.UserAccount),
          pouringDateStart:( this.pouringDateStart.split('-').join('')),
          pouringDateEnd: this.pouringDateEnd.split('-').join(''),
          WorkOrder:this.workOrder,
          PartNo:this.partNo
        }
        if (this.sessionSt.retrieve("scheduleManagementName") === "scheduleManagement") {
          return this.rest.apiLineProductionScheduleList(request);
        }else if (this.sessionSt.retrieve("scheduleManagementName") === "scheduleManagementVice"){
          return this.rest.apiLineLockedProductionScheduleList(request);
        }
      }),
      tap((res) => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.tableData = res.result.map((i) => {
          return {
            ...i,
            isOverCapacity: (i.isOverCapacity == '1')
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
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `\[${year}${month}${day}]`;
  }
  getEachDate(lineCode: string): Array<string> {
    let result = [];
    switch (lineCode) {
      case '0010':
        result = ['patternStartDay', 'patternEndDay'];
        break
      case '0020':
        result = ['moldingStartDay', 'moldingEndDay'];
        break
      case '0030':
        result = ['moldClosingStartDay', 'moldClosingEndDay'];
        break
      case '0040':
        result = ['pouringStartDay', 'pouringEndDay'];
        break
      case '0050':
        result = ['unpackStartDay', 'unpackEndDay'];
        break
      case '0060':
        result = ['annelProcStartDay', 'annelProcEndDay'];
        break
      case '0070':
        result = ['deRoughEdgeProcStartDay', 'deRoughEdgeProcEndDay'];
        break
      case '0080':
        result = ['post3ProcStartDay', 'post3ProcEndDay'];
        break
      case '0085':
        result = ['post4ProcStartDay', 'post4ProcEndDay'];
        break
      case '0090':
        result = ['post5ProcStartDay', 'post5ProcEndDay'];
        break
    }
    return result
  }
}
