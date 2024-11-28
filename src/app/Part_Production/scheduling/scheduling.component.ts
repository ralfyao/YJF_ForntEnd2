import { Component, OnInit, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum, QuotationPageEnum, CommonPhrasesEnum } from 'src/app/Enum/session-enum.enum';
import { POstatus, LineLeadTime, LineCode, SchedulingTable, FlaskList, WIPProcess, ProductionLimitJson, QualityRecord } from 'src/app/Model/production';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { TakeScheduleResultRequest } from 'src/bin/takeScheduleResultRequest';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { POStatusListRequest } from 'src/bin/pOStatusListRequest';
import { FlaskListQueryRequest } from 'src/bin/flaskListQueryRequest';
import { POStatusListStockRequest } from 'src/bin/pOStatusListStockRequest';
import { CheckLimitRequest } from 'src/bin/checkLimitRequest';
import { AddLimitRequest } from 'src/bin/addLimitRequest';
import { CommonPhrasesListRequest } from 'src/bin/commonPhrasesListRequest';
import { RemoveFlasksMatchRequest } from 'src/bin/removeFlasksMatchRequest';
import { PoductionLeadTimeCHangeRequest } from 'src/bin/poductionLeadTimeCHangeRequest';
import { ChangePOstatusRequest } from 'src/bin/changePOstatusRequest';
import { QueryProductionLineReqeust } from 'src/bin/queryProductionLineReqeust';
import { SchedulingRequest } from 'src/bin/schedulingRequest';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.css']
})
export class SchedulingComponent implements OnInit {

  POstatusList: Array<POstatus> = new Array<POstatus>();
  CastingOutSouceList: Array<POstatus> = new Array<POstatus>();
  totalProductionWeight: number = 0;
  LineCodeList: Array<LineCode> = new Array<LineCode>();
  moldinglist: LineCode[];
  asemblinglist: LineCode[];
  CurrentPOstatus: POstatus = new POstatus();
  SearchString: string = "";
  ProductionLineList: Array<string> = new Array<string>();
  ShowScheduleTable: Array<POstatus> = new Array<POstatus>();
  ShowCastingOutSouceList: Array<POstatus> = new Array<POstatus>();
  CurrentQualityRecordList: Array<QualityRecord> = new Array<QualityRecord>();
  ShowGroup: string = "全部排程";
  totalorderweight: number = 0;
  FlaskSelectList: Array<FlaskList> = new Array<FlaskList>();
  SearchText: string = "";
  public ScheduleResult: Array<SchedulingTable> = new Array<SchedulingTable>();
  MoldingQTY: number;
  DistinctWIP: Array<WIPProcess> = new Array<WIPProcess>();
  DistinctFinished: Array<WIPProcess> = new Array<WIPProcess>();
  HideStopOrder: boolean = true;
  FlaskLocationList: Array<string> = new Array<string>();
  PatternLocationList: Array<string> = new Array<string>();
  HideStockOrder: boolean = false;
  ProductionLimits: Array<ProductionLimitJson> = new Array<ProductionLimitJson>();
  newlimitrow: ProductionLimitJson = new ProductionLimitJson();

  constructor(
    @Inject(DOCUMENT) public document,
    private router: Router,
    public rest: ProdutionService,
    private inj: Injector,
    public spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
  ) { }

  ngOnInit() {
    this.POStatusListUpdate().pipe(
      switchMap(() => {
        return this.QueryLineCode()
      }),
      switchMap(() => {
        return this.LoadCommonPhrasesList()
      })
    ).subscribe();
  }


  LeadTimeQuery(CurrentPOstatus: POstatus) {
    this.CurrentPOstatus = CurrentPOstatus;
    this.CurrentPOstatus.WIPProcessList = this.CurrentPOstatus.WIPProcessList.sort((a, b) => {
      if (Number(a.WIPProcessCode.substring(0, 2)) >= Number(b.WIPProcessCode.substring(0, 2))) {
        return -1;
      } else {
        return 1;
      }
    });
    this.DistinctWIP = new Array<WIPProcess>();
    this.DistinctFinished = new Array<WIPProcess>();
    this.CurrentPOstatus.WIPProcessList.forEach(x => {
      var newrow = new WIPProcess();
      if (this.DistinctWIP.filter(z => z.WIPProcessName == x.WIPProcessName).length == 0) {
        newrow = JSON.parse(JSON.stringify(x));
        newrow.WIPQTY = this.CurrentPOstatus.WIPQTY
        this.DistinctWIP.push(newrow);
      }
    });
    this.CurrentPOstatus.OutSourceList.forEach(x => {
      var newrow = new WIPProcess();
      if (this.DistinctFinished.filter(z => z.WIPProcessName == x.WIPProcessName).length == 0) {
        newrow = JSON.parse(JSON.stringify(x));
        this.DistinctFinished.push(newrow);
      } else {
        this.DistinctFinished.filter(z => z.WIPProcessName == x.WIPProcessName)[0].WIPQTY += x.WIPQTY;
      }
    });
  }

  OutsourceSum(item: POstatus) {
    if (item.OutSourceList.length > 0) {
      return item.OutSourceList.map(x => x.WIPQTY).reduce((a, b) => a + b);
    } else {
      return 0;
    }
  }

  CaculatePurQty(item: POstatus) {
    if (item.CastingPurchaseList.length > 0) {
      return item.CastingPurchaseList.map(x => x.PurQTY - x.FinQTY).reduce((a, b) => a + b);
    } else {
      return 0;
    }
  }

  POStatusListUpdate() {
    this.spinnerService.show();
    const request: POStatusListRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    return this.rest.apiPOStatusList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.POstatusList = res.POstatusList;
        this.CastingOutSouceList = res.CastingOutSouceList;
        this.POstatusList = this.POstatusList.sort((a, b) => {
          if (
            new Date(Number(a.OrderFinDate.substr(0, 4)), Number(a.OrderFinDate.substr(4, 2)) - 1, Number(a.OrderFinDate.substr(6, 2)))
            >=
            new Date(Number(b.OrderFinDate.substr(0, 4)), Number(b.OrderFinDate.substr(4, 2)) - 1, Number(b.OrderFinDate.substr(6, 2))))
            return 1;
          else
            return -1;
        });
        var newlist: Array<POstatus> = new Array<POstatus>();
        this.POstatusList.forEach(x => {
          var newrow = new POstatus();
          if (newlist.filter(y => y.PartNO == x.PartNO).length == 0) {
            newrow = JSON.parse(JSON.stringify(x));
            //把08的ERP紀錄排除在外，利用28的伺服器來記錄所有移動，除了09的外包之外。
            // 20240215 ralfyao debug x.OutSourceList did not really filter after judging x.OutSourceList.filter(z => z.WIPProcessCode.substring(0, 2) != '08').length > 0
            newrow.runnungqty = x.WIPQTY + x.StockQTY + (x.OutSourceList.filter(z => z.WIPProcessCode.substring(0, 2) != '08').length > 0 ? x.OutSourceList.filter(z => z.WIPProcessCode.substring(0, 2) != '08').map(x => x.WIPQTY).reduce((a, b) => a + b) : 0);
            newlist.push(newrow);
          } else {
            newrow = newlist.filter(y => y.PartNO == x.PartNO)[0];
          }

          if ((x.OrderQTY - newrow.runnungqty) / x.BatchQTY > 0) {
            x.PlanProductionQTY = (x.OrderQTY - newrow.runnungqty) / x.BatchQTY;
            newrow.runnungqty = 0;
          } else {
            x.PlanProductionQTY = 0;
            newrow.runnungqty = newrow.runnungqty - x.OrderQTY;
          }


          if (this.ProductionLineList.filter(y => y == x.MoldingLine).length == 0 && x.MoldingLine != '' && x.PlanProductionQTY > 0) {
            this.ProductionLineList.push(x.MoldingLine);
          }
          if (this.ProductionLineList.filter(y => y == x.AsemblingLine).length == 0 && x.AsemblingLine != '' && x.PlanProductionQTY > 0) {
            this.ProductionLineList.push(x.AsemblingLine);
          }
        });
        this.ProductionLineList = this.ProductionLineList.sort((a, b) => a.localeCompare(b));
        this.totalorderweight = Math.round(this.POstatusList.map(a => (a.OrderQTY - a.WIPProcessList.filter(x => Number(x.WIPProcessCode.substring(0, 2)) > 5).map(z => z.WIPQTY).reduce((l, p) => l + p, 0)) * a.Weight).reduce((a, b) => a + b, 0) / 1000);
        this.filtertable(this.ShowGroup, this.SearchString);
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }

  CheckOrderStatus() {
    return this.POstatusList
      .filter(x => x.TD016.toLowerCase() == 'y' || x.TC027.toLowerCase() == 'n' || x.TC027.toLowerCase() == 'v').length;
  }

  QualityCheck(item: POstatus) {
    var nowdate = new Date(Date.now());
    var count = item.QualityRecordList.map(x => yyyymmddtodate(x.QualityIssuseDate)).filter(x => (nowdate.getTime() - x.getTime()) / (1000 * 3600 * 24) <= 90).length;
    if (count > 0) {
      return 'Red';
    } else if (item.Weight == 0) {
      return 'deepskyblue'
    }
    else {
      return 'orange'
    }
  }

  W3close() {
    this.document.getElementById("mySidebar").setAttribute('style', 'display:none');
  }

  w3open() {
    this.document.getElementById("mySidebar").setAttribute('style', 'display:block;width:30%');
  }

  Scheduling() {
    this.spinnerService.show();
    this.session.store(QuotationPageEnum.POstatusList, this.POstatusList);
    const request: TakeScheduleResultRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    const requestScheduling: SchedulingRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      POstatusList: this.POstatusList.filter(x => x.OrderStop == 'N')
    }
    this.rest.apiTakeScheduleResult(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.ScheduleResult = res.SchedulingList;
        this.session.store(QuotationPageEnum.ScheduleResult, this.ScheduleResult);
        this.router.navigate(['login_success/ScheduleResult']);
      }),
      switchMap(() => {
        return this.rest.apiScheduling(requestScheduling)
      }),
      tap((res) => {
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

  checkLimit() {
    this.spinnerService.show();
    const request: CheckLimitRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    this.rest.apiCheckLimit(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.ProductionLimits = res.ProductionLimits;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  AddLimit(newlimitrow: ProductionLimitJson) {
    const request: AddLimitRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      productionLimitJson: newlimitrow
    }
    this.rest.apiAddLimit(request).subscribe();
  }

  LoadCommonPhrasesList() {
    this.spinnerService.show();
    const request: CommonPhrasesListRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    return this.rest.apiCommonPhrasesList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.FlaskLocationList = res.FlaskLocationList;
        this.PatternLocationList = res.PatternLocationList;
        this.session.store(CommonPhrasesEnum.FlaskLocationList, this.FlaskLocationList);
        this.session.store(CommonPhrasesEnum.PatternLocationList, this.PatternLocationList);
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }

  togglediv(i: string) {
    if (i != undefined) {
      let width = this.document.getElementById("Locationid" + i).offsetWidth;
      let index = 0;
      this.CurrentPOstatus.flaskMatches.forEach(x => {
        this.document.getElementById("FlaskList" + index).setAttribute('style', 'display:none;z-index: 1;');
        index++;
      });
      this.document.getElementById("FlaskList" + i).setAttribute('style', 'width:' + width + 'px;display:block;z-index: 999999;');
    } else {
      let index = 0;
      this.CurrentPOstatus.flaskMatches.forEach(x => {
        this.document.getElementById("FlaskList" + index).setAttribute('style', 'display: none;z-index: 1;');
        index++;
      });
    }
  }
  setflasklocation(item: FlaskList, flaskloc: string) {
    item.FlaskLocation = flaskloc;
    let index = 0;
    this.CurrentPOstatus.flaskMatches.forEach(x => {
      this.document.getElementById("FlaskList" + index).setAttribute('style', 'display: none;z-index: 1;');
      index++;
    });
  }

  flaskremove(item: FlaskList) {
    this.spinnerService.show();
    this.CurrentPOstatus.flaskMatches.filter(x => x.FlaskId == item.FlaskId).pop();
    const request: RemoveFlasksMatchRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      Flask: item
    }
    this.rest.apiRemoveFlasksMatch(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.spinnerService.hide();
        this.CurrentPOstatus.flaskMatches = this.CurrentPOstatus.flaskMatches.filter(x => x.FlaskId != item.FlaskId);
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }


  filtertable(item: string, searchtext: string) {
    this.ShowGroup = item;
    this.ShowScheduleTable = new Array<POstatus>();
    if (this.ShowGroup == '全部排程') {
      this.ShowScheduleTable = this.POstatusList;
      this.ShowCastingOutSouceList = this.CastingOutSouceList;
    }
    else if (this.ShowGroup == '訂單問題') {
      this.ShowScheduleTable = this.POstatusList.filter(x => x.PlanProductionQTY > 0)
        .filter(x => x.TD016.toLowerCase() == 'y' || x.TC027.toLowerCase() == 'n' || x.TC027.toLowerCase() == 'v');
      this.ShowCastingOutSouceList = new Array<POstatus>();
    }
    else if (this.ShowGroup == '問題排除') {
      this.ShowScheduleTable = this.POstatusList.filter(x => x.PlanProductionQTY > 0)
        .filter(x => x.OrderStop == 'Y' ||
          x.flaskMatches.length == 0 ||
          (x.MoldingLine != '' &&
            (x.Weight <= 0 || x.MoldingTime <= 0 || x.AsemblingTime <= 0 || x.PouringTime <= 0 || x.DeflaskTime <= 0 || x.StressFuranceTime <= 0 || x.DeburringTime <= 0)))
        .sort((a, b) => a.OrderStop.localeCompare(b.OrderStop));
      this.ShowCastingOutSouceList = new Array<POstatus>();
    } else if (this.ShowGroup == '木模問題') {
      this.ShowScheduleTable = this.POstatusList.filter(x => x.PlanProductionQTY > 0)
        .filter(x => x.PatternDHeight + x.PatternLength + x.PatternUHeight + x.PatternWidth == 0)
        .sort((a, b) => a.OrderStop.localeCompare(b.OrderStop));
      this.ShowCastingOutSouceList = new Array<POstatus>();
    }
    else {
      this.ShowScheduleTable = this.POstatusList.filter(x => x.PlanProductionQTY > 0).filter(x => x.OrderStop == 'N' && (x.MoldingLine == this.ShowGroup || x.AsemblingLine == this.ShowGroup));
      this.ShowCastingOutSouceList = this.CastingOutSouceList;
    }
    if (this.SearchString.length > 0) {
      this.ShowScheduleTable = this.POstatusList.filter(x => true);
      this.ShowCastingOutSouceList = this.CastingOutSouceList?.filter(x => true);
      var searchlist = new Array<string>();
      if (this.SearchString.includes(' ')) {
        searchlist = this.SearchString.trim().split(' ');
      } else {
        searchlist.push(this.SearchString);
      }

      for (var i = 0; i < searchlist.length; i++) {
        this.ShowScheduleTable = this.ShowScheduleTable.filter(x =>
          x.PartNO.toLocaleLowerCase().includes(searchlist[i].toLocaleLowerCase()) ||
          x.CusName.toLocaleLowerCase().includes(searchlist[i].toLocaleLowerCase()) ||
          x.PartDesc.toLocaleLowerCase().includes(searchlist[i].toLocaleLowerCase()) ||
          x.CusOrder.toLocaleLowerCase().includes(searchlist[i].toLocaleLowerCase()) ||
          x.ShipLoc.toLocaleLowerCase().includes(searchlist[i].toLocaleLowerCase()) ||
          x.AsemblingLine.toLocaleLowerCase().includes(searchlist[i].toLocaleLowerCase()) ||
          x.MoldingLine.toLocaleLowerCase().includes(searchlist[i].toLocaleLowerCase()) ||
          x.TA002.toLocaleLowerCase().includes(searchlist[i].toLocaleLowerCase())
        );
        if (this.ShowCastingOutSouceList.length) {
          this.ShowCastingOutSouceList = this.ShowCastingOutSouceList.filter(x =>
            x.PartNO.toLocaleLowerCase().includes(searchlist[i].toLocaleLowerCase()) ||
            x.CusName.toLocaleLowerCase().includes(searchlist[i].toLocaleLowerCase()) ||
            x.PartDesc.toLocaleLowerCase().includes(searchlist[i].toLocaleLowerCase()) ||
            x.CusOrder.toLocaleLowerCase().includes(searchlist[i].toLocaleLowerCase()) ||
            x.ShipLoc.toLocaleLowerCase().includes(searchlist[i].toLocaleLowerCase())
          );
        }

      }

    }
    if (this.HideStopOrder) {
      this.ShowScheduleTable = this.ShowScheduleTable.filter(x => x.OrderStop == 'N');
      if (this.ShowCastingOutSouceList?.length) {
        this.ShowCastingOutSouceList = this.ShowCastingOutSouceList.filter(x => x.OrderStop == 'N');
      }

    }
    if (this.HideStockOrder) {
      this.ShowScheduleTable = this.ShowScheduleTable.filter(x => x.CusOrder != '');
      this.ShowCastingOutSouceList = this.ShowCastingOutSouceList.filter(x => x.CusOrder != '');
    }
    if (this.ShowScheduleTable.length == 0) {
      this.spinnerService.show();
      const request: POStatusListStockRequest = {
        Account: this.session.retrieve(LoginSessionEnum.UserAccount),
        SearchText: searchtext
      }
      this.rest.apiPOStatusListStock(request).pipe(
        tap(res => {
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            throw (res.ErrorMsg)
          }
          this.ShowScheduleTable = res.POstatusList;
          this.spinnerService.hide();
        }),
        catchError((res) => {
          this.rest.errorWithErrorMsg(res);
          this.spinnerService.hide();
          return of()
        })
      )
    }

  }
  patternProblem() {
    return this.POstatusList.filter(x => x.PlanProductionQTY > 0)
      .filter(x => x.OrderStop == 'Y' ||
        x.flaskMatches.length == 0 ||
        (x.MoldingLine != '' &&
          (x.Weight <= 0 || x.MoldingTime <= 0 || x.AsemblingTime <= 0 || x.PouringTime <= 0 || x.DeflaskTime <= 0 || x.StressFuranceTime <= 0 || x.DeburringTime <= 0)))
      .sort((a, b) => a.OrderStop.localeCompare(b.OrderStop)).filter(
        (thing, i, arr) => arr.findIndex(t => t.PartNO === thing.PartNO) === i
      ).length;
  }
  problemcheck() {
    return this.POstatusList.filter(x => x.flaskMatches.length == 0 || x.MoldingLine == '' || x.OrderStop == 'Y' || (x.Weight <= 0 || x.MoldingTime <= 0 || x.AsemblingTime <= 0 || x.PouringTime <= 0 || x.DeflaskTime <= 0 || x.StressFuranceTime <= 0 || x.DeburringTime <= 0)).length;
  }

  TableRowColorChange(tablename: string, List: any, row: number) {
    var i = 0;
    List.forEach(x => {
      this.document.getElementById(tablename + i.toString()).setAttribute('style', 'height:65px;');
      i++
    });
    this.document.getElementById(tablename + row.toString()).setAttribute('style', 'height:65px;background-color:deepskyblue;');
  }
  CaculateFlask(CurrentPOstatus: POstatus) {

    return CurrentPOstatus.PatternLength * CurrentPOstatus.PatternWidth * (CurrentPOstatus.PatternUHeight + CurrentPOstatus.PatternDHeight) / 100000000
  }

  FlaskListQuery(item: POstatus, search: string) {
    this.spinnerService.show();
    this.CurrentPOstatus = item;
    this.FlaskSelectList = new Array<FlaskList>();
    if ((item.PatternLength + item.PatternWidth + item.PatternUHeight + item.PatternDHeight > 0) || search.length > 0) {
      const request: FlaskListQueryRequest = {
        Account: this.session.retrieve(LoginSessionEnum.UserAccount),
        POStatus: item,
        SearchText: search
      }
      this.rest.apiFlaskListQuery(request).pipe(
        tap(res => {
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {

            throw res.ErrorMsg
          }
          this.FlaskSelectList = res.FlaskSelectList.filter(x => !item.flaskMatches.map(z => z.FlaskId).includes(x.FlaskId));
          this.FlaskSelectList.sort((a, b) => {
            if (a.FLength * a.FWidth * (a.FDHeight + a.FMHeight + a.FUpHeight) >= b.FLength * b.FWidth * (b.FDHeight + b.FMHeight + b.FUpHeight)) {
              return 1;
            } else {
              return -1
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
  }



  LeadTimeChange(item: POstatus) {
    this.spinnerService.show();
    var newrow = new LineLeadTime();
    newrow.PartNO = item.PartNO;
    newrow.Molding = item.MoldingTime;
    newrow.Asembling = item.AsemblingTime;
    newrow.Pouring = item.PouringTime;
    newrow.Deflask = item.DeflaskTime;
    newrow.StressFurance = item.StressFuranceTime;
    newrow.Deburring = item.DeburringTime;
    const request: PoductionLeadTimeCHangeRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      ProductionLineList: newrow
    };
    this.rest.apiProductionLeadTimeCHange(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.filtertable(this.ShowGroup, this.SearchString);
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  CheckTotlaWeight() {
    if (this.ShowScheduleTable != null && this.ShowScheduleTable.length > 0) {
      this.totalProductionWeight = Math.round(this.ShowScheduleTable.filter(x => x.OrderStop == 'N' && x.MoldingLine != '').map(a => (a.PlanProductionQTY) * a.Weight).reduce((a, b) => a + b, 0) / 1000);
      return this.totalProductionWeight;
    } else {
      return 0
    }


  }
  CheckDeliveryPerWeight() {
    var newdate =
      this.POstatusList.map(x =>
        new Date(Number(x.OrderFinDate.substr(0, 4)), Number(x.OrderFinDate.substr(4, 2)) - 1, Number(x.OrderFinDate.substr(6, 2))));
    newdate = newdate.sort((a, b) => {
      if (a >= b)
        return -1;
      else
        return 1;
    });
    var Difference_In_Time = newdate[0].getTime() - new Date(Date.now()).getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Math.round(Difference_In_Days);
  }

  ChangePOstatus(item: POstatus) {
    this.spinnerService.show();
    const request: ChangePOstatusRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      POstatusList: item
    }
    this.rest.apiChangePOstatus(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.session.store(QuotationPageEnum.POstatusList, this.POstatusList);
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  FlaskAddList(item: POstatus, flasks: Array<FlaskList>) {
    flasks.forEach(x => {
      if (x.Choice) {
        item.flaskMatches.push(x);
      }
    });
    this.ChangePOstatus(item);
  }

  FlaskMatch(item: POstatus) {
    this.CurrentPOstatus = item;
    this.SearchText = "";
  }

  QueryLineCode() {
    this.spinnerService.show();
    const request: QueryProductionLineReqeust = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      WorkOrder:undefined
    }
    return this.rest.apiQueryProductionLine(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.moldinglist = this.LineCodeList.filter(x => x.ProductiongLineName.substring(0, 2) == '造模');
        this.asemblinglist = this.LineCodeList.filter(x => x.ProductiongLineName.substring(0, 2) == '合模');
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }

  getGreenToRedGradientByValue(currentValue: number, maxValue: number) {
    var r = ((255 * currentValue) / maxValue);
    var g = (255 * (maxValue - currentValue)) / maxValue;
    var b = 0;
    return { 'color': 'rgb( ' + r + ',' + g + ',' + b + ')' }
  }

  SetColor(currentValue: FlaskList, maxValue: POstatus) {
    var currsize = currentValue.FLength * currentValue.FWidth * (currentValue.FUpHeight + currentValue.FMHeight + currentValue.FDHeight);
    var patternsize = (maxValue.PatternLength + 500) * (maxValue.PatternWidth + 500) * (maxValue.PatternUHeight + maxValue.PatternDHeight + 1000);
    var newval = this.getGreenToRedGradientByValue(currsize / patternsize, 1);
    return newval;
  }
  setval(currentValue: FlaskList, maxValue: POstatus) {
    var currsize = currentValue.FLength * currentValue.FWidth * (currentValue.FUpHeight + currentValue.FMHeight + currentValue.FDHeight);
    var patternsize = (maxValue.PatternLength + 500) * (maxValue.PatternWidth + 500) * (maxValue.PatternUHeight + maxValue.PatternDHeight + 1000);
    return Math.floor(currsize / patternsize * 100) + '%';
  }

}

function DatetoyyyyMMdd(newdate: Date) {

  var formatedate = new Date(newdate);
  if (formatedate != null) {
    var year = formatedate.getFullYear().toString();
    var month = (formatedate.getMonth() + 1).toString();
    while (month.length < 2) {
      month = "0" + month;
    }
    var odate = formatedate.getDate().toString();
    while (odate.length < 2) {
      odate = "0" + odate;
    }
    var yyyyMMdd = year + month + odate;
  }
  return yyyyMMdd;
}

function yyyymmddtodate(newdate: string) {

  var formatedate = new Date();
  formatedate.setFullYear(Number(newdate.substring(0, 4)));
  formatedate.setMonth(Number(newdate.substring(4, 6)));
  formatedate.setDate(Number(newdate.substring(6, 8)))
  return formatedate;
}
