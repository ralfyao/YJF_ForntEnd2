import { FlaskList, FlaskListSearch, FlaskUsageList, POstatus } from './../../Model/production';
import { Component, OnInit } from '@angular/core';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum, QuotationPageEnum } from 'src/app/Enum/session-enum.enum';
import { SchedulingTable } from 'src/app/Model/production';
import { NgxSpinnerService } from 'ngx-spinner';
import { TakeScheduleResultRequest } from 'src/bin/takeScheduleResultRequest';
import { QueryFlaskListRequest } from 'src/bin/queryFlaskListRequest';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { POStatusListRequest } from 'src/bin/pOStatusListRequest';
import { FlaskListQueryRequest } from 'src/bin/flaskListQueryRequest';
import { FlaskDataChangeRequest } from 'src/bin/flaskDataChangeRequest';


@Component({
  selector: 'app-shop-floor',
  templateUrl: './shop-floor.component.html',
  styleUrls: ['./shop-floor.component.css']
})

export class ShopFloorComponent implements OnInit {
  public ScheduleResult: Array<SchedulingTable> = new Array<SchedulingTable>();
  FlaskList: Array<FlaskListSearch> = new Array<FlaskListSearch>();
  POstatusList: Array<POstatus> = new Array<POstatus>();
  ProductionLineList: Array<string> = new Array<string>();
  FlaskUsageList: Array<FlaskUsageList> = new Array<FlaskUsageList>();
  SelectFlask: FlaskListSearch = new FlaskListSearch();
  PartList: Array<string> = new Array<string>();
  SearchText: string = '';
  selectedPartNo: string = '';
  flaskAvailableCount:number = 0;
  currpo: POstatus = new POstatus();
  constructor(
    public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService) { }

  ngOnInit() {
    this.QueryFlaskList().pipe(
      switchMap(() => {
        return this.POStatusListUpdate()
      })
    ).subscribe();
  }

  FlaskQuery() {
    const request: FlaskListQueryRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      POStatus: this.currpo,
      SearchText: this.SearchText
    }
    this.rest.apiFlaskListQuery(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.FlaskList = res.FlaskSelectList;
        this.flaskAvailableCount = 0;//計算可用鐵斗數
        this.FlaskList.forEach(x => {
          x.Usage = this.ScheduleResult.filter(z => z.FlaskNo == x.FlaskId).length;
          if (x.Status === '可用'){
            this.flaskAvailableCount++;
          }
        });
        this.FlaskList = this.FlaskList.sort((a, b) => {
          if (a.Usage > b.Usage)
            return -1;
          else
            return 1;
        })
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  onselectedOutProduce(item: string) {
    this.spinnerService.show();
    this.currpo = new POstatus();
    this.currpo.PartNO = item;
    const request: FlaskListQueryRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      POStatus: this.currpo,
      SearchText: ''
    }
    this.rest.apiFlaskListQuery(request).pipe(
      tap(res => {
        this.FlaskList = res.FlaskSelectList;
        this.flaskAvailableCount = 0;//計算可用鐵斗數
        this.FlaskList.forEach(x => {
          x.Usage = this.ScheduleResult.filter(z => z.FlaskNo == x.FlaskId).length;
          if (x.Status === '可用'){
            this.flaskAvailableCount++;
          }
        });
        this.FlaskList = this.FlaskList.sort((a, b) => {
          if (a.Usage > b.Usage)
            return -1;
          else
            return 1;
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

  QueryFlaskList() {
    this.spinnerService.show();
    const account: string = this.session.retrieve(LoginSessionEnum.UserAccount);
    const queryRequest: QueryFlaskListRequest = {
      Account: account
    }
    const takeRequest: TakeScheduleResultRequest = {
      Account: account
    }
    return this.rest.apiQueryFlaskList(queryRequest).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.flaskAvailableCount = 0;//計算可用鐵斗數
        this.FlaskList = res.FlaskLists.map((i) => {
          if (i.Status === '可用'){
            this.flaskAvailableCount++;
          }
          return {
            ...i,
            Choice: false
          }
        });
      }),
      switchMap(() => {
        return this.rest.apiTakeScheduleResult(takeRequest)
      }),
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.ScheduleResult = res.SchedulingList;
        this.PartList = [];
        if (this.ScheduleResult) {
          this.PartList = this.ScheduleResult.map(x => x.PartNo).filter(
            (thing, i, arr) => arr.findIndex(t => t === thing) === i
          );
          this.FlaskList.forEach(x => {
            x.Usage = this.ScheduleResult.filter(z => z.FlaskNo == x.FlaskId).length;
          });
        }
        this.PartList.push(' 選擇品號');
        this.PartList = this.PartList.sort((a, b) => a.localeCompare(b));

        this.FlaskList = this.FlaskList.sort((a, b) => {
          if (a.Usage > b.Usage)
            return -1;
          else
            return 1;
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
  FlaskDataChange(item: FlaskList) {
    this.spinnerService.show();
    const request: FlaskDataChangeRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      flask: item
    }
    this.rest.apiFlaskDataChange(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
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
  ChoiceFlask(item: FlaskList) {
    item.Choice = !item.Choice;
    this.FlaskList.forEach(x => {
      if (item.FlaskId != x.FlaskId) {
        x.Choice = false;
      }
    });
  }

  UsageListQuery() {
    this.spinnerService.show();
    this.POstatusList = JSON.parse(JSON.stringify(this.session.retrieve(QuotationPageEnum.POstatusList)));
    this.ScheduleResult = this.session.retrieve(QuotationPageEnum.ScheduleResult);
    if (this.POstatusList.length == 0) {
      this.POStatusListUpdate().subscribe();
    }
    if (this.ScheduleResult.length == 0) {
      this.Scheduling();
    }
    this.FlaskList.forEach(x => {
      x.Usage = this.ScheduleResult.filter(z => z.FlaskNo == x.FlaskId).length;
    });
    this.FlaskList = this.FlaskList.sort((a, b) => {
      if (a.Usage > b.Usage)
        return -1;
      else
        return 1;
    })
    this.spinnerService.hide();
  }

  POStatusListUpdate() {
    const request: POStatusListRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    return this.rest.apiPOStatusList(request).pipe(
      tap((res) => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.POstatusList = this.POstatusList.sort((a, b) => {
          if (
            new Date(Number(a.OrderFinDate.substr(0, 4)), Number(a.OrderFinDate.substr(4, 2)) - 1, Number(a.OrderFinDate.substr(6, 2)))
            >=
            new Date(Number(b.OrderFinDate.substr(0, 4)), Number(b.OrderFinDate.substr(4, 2)) - 1, Number(b.OrderFinDate.substr(6, 2))))
            return 1;
          else
            return -1;
        });
        this.POstatusList.forEach(x => {
          x.PlanProductionQTY = x.OrderQTY - x.WIPQTY > 0 ? x.OrderQTY - x.WIPQTY : 0;

          if (this.ProductionLineList.filter(y => y == x.MoldingLine).length == 0 && x.MoldingLine != '' && x.PlanProductionQTY > 0) {
            this.ProductionLineList.push(x.MoldingLine);
          }
          if (this.ProductionLineList.filter(y => y == x.AsemblingLine).length == 0 && x.AsemblingLine != '' && x.PlanProductionQTY > 0) {
            this.ProductionLineList.push(x.AsemblingLine);
          }
        });
        this.ProductionLineList = this.ProductionLineList.sort((a, b) => a.localeCompare(b));
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    )

  }

  Scheduling() {
    const request: TakeScheduleResultRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    this.rest.apiTakeScheduleResult(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.ScheduleResult = res.SchedulingList;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  QueryFlaskUsage(FlaskID: string) {
    this.FlaskUsageList = new Array<FlaskUsageList>();
    this.FlaskUsageList = this.ScheduleResult.filter(x => x.FlaskNo === FlaskID).filter(
      (thing, i, arr) => arr.findIndex(t => t.PartNo === thing.PartNo) === i
    ).map(x => {
      var newrow = new FlaskUsageList();
      newrow.PartNO = x.PartNo;
      newrow.FlaskUse = this.ScheduleResult.filter(y => y.FlaskNo == FlaskID && y.PartNo == x.PartNo).length;
      newrow.Weight = this.ScheduleResult.filter(y => y.FlaskNo == FlaskID && y.PartNo == x.PartNo).map(y => y.Weight).reduce((a, b) => a + b);
      return newrow;
    });
    this.FlaskUsageList = this.FlaskUsageList.sort((a, b) => b.FlaskUse - a.FlaskUse);
  }
}
