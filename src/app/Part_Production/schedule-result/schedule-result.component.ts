import { CancelSFTRequest } from './../../../bin/cancelSFTRequest';
import { ProductionLineCode, WIPProcess } from './../../Model/production';
import { Component, OnInit, Inject, Injector } from '@angular/core';
import { ActivatedRoute, RouterState, Router } from '@angular/router';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import { SchedulingTable, POstatus, FlaskList } from 'src/app/Model/production';
import { DOCUMENT } from '@angular/common';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { SessionStorageService } from 'ngx-webstorage';
import { FlashMessagesService } from 'angular2-flash-messages';
import { QuotationPageEnum, LoginSessionEnum, CommonPhrasesEnum } from 'src/app/Enum/session-enum.enum';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { ChartsModule } from 'ng2-charts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter } from '@angular/material/core';
import * as XLSX from 'xlsx';
import { FlaskListQueryRequest } from 'src/bin/flaskListQueryRequest';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonPhrasesListRequest } from 'src/bin/commonPhrasesListRequest';
import { ChangePOstatusRequest } from 'src/bin/changePOstatusRequest';
import { CMSMWQueryRequest } from 'src/bin/cMSMWQueryRequest';
import { InsertSFTRequest } from 'src/bin/insertSFTRequest';

@Component({
  selector: 'app-schedule-result',
  templateUrl: './schedule-result.component.html',
  styleUrls: ['./schedule-result.component.css']
})
export class ScheduleResultComponent implements OnInit {
  public ScheduleResult: Array<SchedulingTable> = new Array<SchedulingTable>();
  ProductionLineList: Array<string> = new Array<string>();
  ShowGroup: string = "全部排程";
  SearchString: string = "";
  POstatusList: Array<POstatus> = new Array<POstatus>();
  ShowScheduleTable: Array<SchedulingTable> = new Array<SchedulingTable>();
  CurrentScheduleResult: SchedulingTable = new SchedulingTable();
  TotalWeight: Number = 0;
  ShowChart: boolean = false;
  ShowWIP: boolean = false;
  ShowToday: boolean = false;
  FlaskLocationList: Array<string> = new Array<string>();
  PatternLocationList: Array<string> = new Array<string>();
  ProductionLineCodeList: Array<ProductionLineCode> = new Array<ProductionLineCode>();
  HoverIndex: string = '';
  trasnferSFT: string = '';

  SFTDate: Date = new Date();
  settings = {
    format: 'yyyy-MM-dd'
  };
  form: FormGroup;
  StartTime = new Date().getHours().toString() + ":" + new Date().getMinutes().toString();

  public lineChartData: ChartDataSets[] = [
    { data: [], label: '' },
  ];
  public lineChartLabels: Label[] = new Array<string>();
  public lineChartOptions: (ChartOptions) = {

    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          fontSize: 18
        }
      }],
      xAxes: [{
        ticks: {
          fontSize: 18
        }
      }]
    },
    legend: {
      labels: {
        fontSize: 20
      },
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  CurrentPOstatus: POstatus = new POstatus();
  PreviewPOstatus: POstatus = new POstatus();
  SearchText: string;
  FlaskSelectList: Array<FlaskList> = new Array<FlaskList>();
  fileName = 'ExcelSheet.xlsx';
  constructor(
    @Inject(DOCUMENT) public document,
    private router: Router,
    public rest: ProdutionService,
    private inj: Injector,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private flashMessage: FlashMessagesService,
    private crypt: CustomValidateService,
    private _adapter: DateAdapter<any>,
    private formBuilder: FormBuilder,
    private chart: ChartsModule
  ) {
    const state: RouterState = this.router.routerState;
    const root: ActivatedRoute = state.root;
    root.queryParams.subscribe(params => {
      let data = this.crypt.AESDecrypt(params['Q'])
      if (data == undefined) {

      }
      else {


      };
    });

  }

  ngOnInit() {
    this._adapter.setLocale('zh-tw');
    this.QueryShowGroup().pipe(
      switchMap(() => {
        return this.LoadCommonPhrasesList()
      })
    ).subscribe();
    this.form = this.formBuilder.group({
      StartTime: [this.StartTime, Validators.required]
    });
  }

  backPage() {
    this.router.navigate(['login_success/Scheduling']);
  }

  TableRowColorChange(tablename: string, List: any, row: number) {
    var i = 0;
    List.forEach(x => {
      this.document.getElementById(tablename + i.toString()).setAttribute('style', 'height:65px;');
      i++
    });
    this.document.getElementById(tablename + row.toString()).setAttribute('style', 'height:65px;background-color:deepskyblue;');
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
    )
  }



  QueryShowGroup() {
    this.spinnerService.show();
    this.ScheduleResult = this.session.retrieve(QuotationPageEnum.ScheduleResult);
    this.POstatusList = JSON.parse(JSON.stringify(this.session.retrieve(QuotationPageEnum.POstatusList)));
    this.ProductionLineList.push("木模線");
    this.ScheduleResult.filter(x => x.AsemblingLine.length > 0 && x.MoldingLine.length > 0).forEach(x => {
      if (!this.ProductionLineList.includes(x.AsemblingLine)) {
        this.ProductionLineList.push(x.AsemblingLine);
      }
      if (!this.ProductionLineList.includes(x.MoldingLine)) {
        this.ProductionLineList.push(x.MoldingLine);
      }
    });
    this.ProductionLineList.sort((a, b) => a.localeCompare(b));
    this.ProductionLineList.push("澆注");
    this.ProductionLineList.push("拆箱");
    // this.ProductionLineList.push("退火");
    // this.ProductionLineList.push("毛邊");
    this.filtertable("全部排程");
    const request: CMSMWQueryRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    return this.rest.apiCMSMWQuery(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.ProductionLineCodeList = res.ProductionLineCode;
        this.spinnerService.hide();
      }), catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    )

  }

  FlaskMatch(item: SchedulingTable) {
    this.CurrentPOstatus = this.POstatusList.filter(x => x.PartNO == item.PartNo && x.TA002 == item.ProductionOrder)[0];
    this.CurrentScheduleResult = item;
    if (item.FlaskNo.length > 0) {
      this.CurrentPOstatus.flaskMatches.filter(x => x.FlaskId == item.FlaskNo)[0].Choice = true;
    }
    this.SearchText = "";
  }

  WIPcheck(CurrentRow: SchedulingTable) {
    if (CurrentRow.Pattern.includes('F') || CurrentRow.Molding.includes('F') || CurrentRow.AsemblingLine.includes('F')
      || CurrentRow.Pouring.includes('F') || CurrentRow.DeFlask.includes('F') || CurrentRow.StressRelease.includes('F')
      || CurrentRow.DeBurring.includes('F') || CurrentRow.OutSourcing.includes('F')) {
      return true;
    } else {
      return false;
    }
  }
  mousein(item: string) {
    this.HoverIndex = item;
  }
  mouseout(item: string) {
    this.HoverIndex = '';
  }

  CheckCanCancelSFT(CurrentRow: SchedulingTable, showstring: string) {
    switch (this.ShowGroup.substr(0, 2)) {
      case '全部':
        return false;
        break;
      case '木模':
        if (CurrentRow.Pattern.includes('F') && !CurrentRow.Molding.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
      case '造模':
        if (CurrentRow.Molding.includes('F') && !CurrentRow.Asembling.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
      case '合模':
        if (CurrentRow.Asembling.includes('F') && !CurrentRow.Pouring.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
      case '澆注':
        if (CurrentRow.Pouring.includes('F') && !CurrentRow.DeFlask.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
      case '拆箱':
        if (CurrentRow.DeFlask.includes('F') && !CurrentRow.StressRelease.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
      case '退火':
        if (CurrentRow.StressRelease.includes('F') && !CurrentRow.DeBurring.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
      case '毛邊':
        if (CurrentRow.DeBurring.includes('F') && !CurrentRow.OutSourcing.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
      case '外包':
        if (CurrentRow.OutSourcing.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
    }
  }

  checkCanSFT(CurrentRow: SchedulingTable) {
    switch (this.ShowGroup.substr(0, 2)) {
      case '全部':
        return false;
        break;
      case '木模':
        if (!CurrentRow.Pattern.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
      case '造模':
        if (CurrentRow.Pattern.includes('F') && !CurrentRow.Molding.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
      case '合模':
        if (CurrentRow.Molding.includes('F') && !CurrentRow.Asembling.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
      case '澆注':
        if (CurrentRow.Asembling.includes('F') && !CurrentRow.Pouring.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
      case '拆箱':
        if (CurrentRow.Pouring.includes('F') && !CurrentRow.DeFlask.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
      case '退火':
        if (CurrentRow.DeFlask.includes('F') && !CurrentRow.StressRelease.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
      case '毛邊':
        if (CurrentRow.StressRelease.includes('F') && !CurrentRow.DeBurring.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
      case '外包':
        if (CurrentRow.DeBurring.includes('F') && !CurrentRow.OutSourcing.includes('F')) {
          return true;
        } else {
          return false;
        }
        break;
    }
  }

  insertSFT(CurrentProcess: string, CurrentRow: SchedulingTable) {
    this.spinnerService.show();
    const newwip = new WIPProcess();
    newwip.PartNo = CurrentRow.PartNo;
    newwip.Flask = CurrentRow.FlaskNo;
    newwip.TA002 = CurrentRow.ProductionOrder;
    newwip.WIPProcessCode = this.ProductionLineCodeList.filter(x => x.WIPProcessName.includes(CurrentProcess))[0].WIPProcessCode;
    newwip.WIPProcessName = CurrentProcess;
    let dnow: Date = new Date(this.SFTDate);
    if (this.CheckFlaskUsage(CurrentRow)) {
      newwip.Flask += '(重複)';
    }
    newwip.WIPProcessStartDate = dnow.getFullYear().toString() +
      ((dnow.getMonth() + 1).toString().length < 2 ? '0' + (dnow.getMonth() + 1).toString() : (dnow.getMonth() + 1).toString()) +
      (dnow.getDate().toString().length < 2 ? '0' + dnow.getDate().toString() : dnow.getDate().toString())
      + ' ' + this.StartTime;
    newwip.WIPQTY = 1;
    const request: InsertSFTRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      WIPProcess: newwip
    }
    this.rest.apiInsertSFT(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        switch (newwip.WIPProcessCode.substr(0, 2)) {
          case '01':
            CurrentRow.Pattern = newwip.WIPProcessStartDate.substring(0, 8) + 'F';
            break;
          case '02':
            CurrentRow.Molding = newwip.WIPProcessStartDate.substring(0, 8) + 'F';
            break;
          case '03':
            CurrentRow.Asembling = newwip.WIPProcessStartDate.substring(0, 8) + 'F';
            break;
          case '05':
            CurrentRow.Pouring = newwip.WIPProcessStartDate.substring(0, 8) + 'F';
            break;
          case '06':
            CurrentRow.DeFlask = newwip.WIPProcessStartDate.substring(0, 8) + 'F';
            break;
          case '07':
            CurrentRow.StressRelease = newwip.WIPProcessStartDate.substring(0, 8) + 'F';
            break;
          case '08':
            CurrentRow.DeBurring = newwip.WIPProcessStartDate.substring(0, 8) + 'F';
            break;
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
  CheckFlaskUsage(CurrentRow: SchedulingTable) {
    if (this.ScheduleResult.filter(x => x.FlaskNo == CurrentRow.FlaskNo && (
      x.Pattern.includes('F') || x.Molding.includes('F') || x.Asembling.includes('F') || x.Pouring.includes('F') ||
      x.DeFlask.includes('F')) && x.scheduleindex != CurrentRow.scheduleindex
    ).length > 0) {
      alert("鐵斗重複使用");
      return true;
    } else {
      return false;
    }
  }
  CancelSFT(CurrentProcess: string, CurrentRow: SchedulingTable) {
    this.spinnerService.show();
    const newwip = new WIPProcess();
    newwip.PartNo = CurrentRow.PartNo;
    newwip.Flask = CurrentRow.FlaskNo;
    newwip.TA002 = CurrentRow.ProductionOrder;
    newwip.WIPProcessCode = this.ProductionLineCodeList.filter(x => x.WIPProcessName.includes(CurrentProcess))[0].WIPProcessCode;
    newwip.WIPProcessName = CurrentProcess;
    const request: CancelSFTRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      WIPProcess: newwip
    }
    this.rest.apiCancelSFT(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        switch (newwip.WIPProcessCode.substr(0, 2)) {
          case '01':
            CurrentRow.Pattern = CurrentRow.Pattern.replace('F', '');
            break;
          case '02':
            CurrentRow.Molding = CurrentRow.Molding.replace('F', '');
            break;
          case '03':
            CurrentRow.Asembling = CurrentRow.Asembling.replace('F', '');
            break;
          case '05':
            CurrentRow.Pouring = CurrentRow.Pouring.replace('F', '');
            break;
          case '06':
            CurrentRow.DeFlask = CurrentRow.DeFlask.replace('F', '');
            break;
          case '07':
            CurrentRow.StressRelease = CurrentRow.StressRelease.replace('F', '');
            break;
          case '08':
            CurrentRow.DeBurring = CurrentRow.DeBurring.replace('F', '');
            break;
          case '09':
            CurrentRow.OutSourcing = CurrentRow.OutSourcing.replace('F', '');
            break;
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


  FlaskListQuery(item: POstatus, search: string) {
    this.spinnerService.show();

    this.FlaskSelectList = new Array<FlaskList>();
    if ((item.PatternLength + item.PatternWidth + item.PatternUHeight + item.PatternDHeight > 0) || search.length > 0) {
      const request: FlaskListQueryRequest = {
        Account: this.session.retrieve(LoginSessionEnum.UserAccount),
        POStatus: item,
        SearchText: search
      }
      this.rest.apiFlaskListQuery(request).pipe(
        tap(res => {
          if (res.WorkStatus != 'OK' && !res.WorkStatus) {
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

  getGreenToRedGradientByValue(currentValue: number, maxValue: number) {
    var r = ((255 * currentValue) / maxValue);
    var g = (255 * (maxValue - currentValue)) / maxValue;
    var b = 0;
    return { 'color': 'rgb( ' + r + ',' + g + ',' + b + ')' }
  }


  FlaskAddList(item: POstatus, flasks: Array<FlaskList>) {
    flasks.forEach(x => {
      if (x.Choice) {
        item.flaskMatches.push(x);
      }
    });
    this.CurrentPOstatus.flaskMatches.forEach(x => {
      if (x.Choice) {
        this.ShowScheduleTable.filter(y => y.scheduleindex == this.CurrentScheduleResult.scheduleindex)[0].FlaskNo = x.FlaskId;
      }
    });
    this.ChangePOstatus(item);
  }

  CancelChange() {
    this.POstatusList = JSON.parse(JSON.stringify(this.session.retrieve(QuotationPageEnum.POstatusList)));
  }

  ChangePOstatus(item: POstatus) {
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
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  filtertable(item: string) {
    this.ShowGroup = item;
    if (item.substring(0, 2) == "造模" || item.substring(0, 2) == "合模") {
      this.ShowScheduleTable = this.ScheduleResult
        .filter(x => x.AsemblingLine == item || x.MoldingLine == item);
    } else {
      this.ShowScheduleTable = this.ScheduleResult;
    }
    this.ShowScheduleTable = this.ShowScheduleTable.filter(x =>
      x.PartNo.toLocaleLowerCase().includes(this.SearchString.toLocaleLowerCase()) ||
      x.AsemblingLine.toLocaleLowerCase().includes(this.SearchString.toLocaleLowerCase()) ||
      x.MoldingLine.toLocaleLowerCase().includes(this.SearchString.toLocaleLowerCase())
    );
    if (!this.ShowWIP) {
      this.ShowScheduleTable = this.ShowScheduleTable.filter(x =>
        !x.Pattern.includes('F') &&
        !x.Molding.includes('F') &&
        !x.Asembling.includes('F') &&
        !x.Pouring.includes('F') &&
        !x.DeFlask.includes('F') &&
        !x.StressRelease.includes('F') &&
        !x.DeBurring.includes('F') &&
        !x.OutSourcing.includes('F')
      );
    } else {
      this.ShowScheduleTable = this.ShowScheduleTable.filter(x =>
        x.Pattern.includes('F') ||
        x.Molding.includes('F') ||
        x.Asembling.includes('F') ||
        x.Pouring.includes('F') ||
        x.DeFlask.includes('F') ||
        x.StressRelease.includes('F') ||
        x.DeBurring.includes('F') ||
        x.OutSourcing.includes('F')
      );
    }

    switch (this.ShowGroup.substring(0, 2)) {
      case '木模':
        this.ShowScheduleTable = this.ShowScheduleTable.filter(x => !x.Molding.includes('F')).sort((a, b) => a.Pattern.localeCompare(b.Pattern));
        if (this.ShowToday) {
          this.ShowScheduleTable = this.ShowScheduleTable.filter(x => Number(x.Pattern.replace('F', '')) <= Number(this.yyyymmdd()));
        }
        this.ShowScheduleTable = this.ShowScheduleTable.filter(
          (thing, i, arr) => arr.findIndex(t => t.PartNo === thing.PartNo) === i
        );
        break;

      case '造模':
        this.ShowScheduleTable = this.ShowScheduleTable.filter(x => !x.Asembling.includes('F')).sort((a, b) => a.Molding.localeCompare(b.Molding));
        if (this.ShowToday) {
          this.ShowScheduleTable = this.ShowScheduleTable.filter(x => Number(x.Molding.replace('F', '')) <= Number(this.yyyymmdd()));
        }
        break;
      case '合模':
        this.ShowScheduleTable = this.ShowScheduleTable.filter(x => !x.Pouring.includes('F')).sort((a, b) => a.Asembling.localeCompare(b.Asembling));
        if (this.ShowToday) {
          this.ShowScheduleTable = this.ShowScheduleTable.filter(x => Number(x.Asembling.replace('F', '')) <= Number(this.yyyymmdd()));
        }
        break;
      case '澆注':
        this.ShowScheduleTable = this.ShowScheduleTable.filter(x => !x.DeFlask.includes('F')).sort((a, b) => a.Pouring.localeCompare(b.Pouring));
        if (this.ShowToday) {
          this.ShowScheduleTable = this.ShowScheduleTable.filter(x => Number(x.Pouring.replace('F', '')) <= Number(this.yyyymmdd()));
        }
        break;
      case '拆箱':
        this.ShowScheduleTable = this.ShowScheduleTable.filter(x => !x.StressRelease.includes('F')).sort((a, b) => a.DeFlask.localeCompare(b.DeFlask));
        if (this.ShowToday) {
          this.ShowScheduleTable = this.ShowScheduleTable.filter(x => Number(x.DeFlask.replace('F', '')) <= Number(this.yyyymmdd()));
        }
        break;
      case '退火':
        this.ShowScheduleTable = this.ShowScheduleTable.filter(x => !x.DeBurring.includes('F')).sort((a, b) => a.StressRelease.localeCompare(b.StressRelease));
        if (this.ShowToday) {
          this.ShowScheduleTable = this.ShowScheduleTable.filter(x => Number(x.StressRelease.replace('F', '')) <= Number(this.yyyymmdd()));
        }
        break;
      case '毛邊':
        this.ShowScheduleTable = this.ShowScheduleTable.filter(x => !x.OutSourcing.includes('F')).sort((a, b) => a.DeBurring.localeCompare(b.DeBurring));
        if (this.ShowToday) {
          this.ShowScheduleTable = this.ShowScheduleTable.filter(x => Number(x.DeBurring.replace('F', '')) <= Number(this.yyyymmdd()));
        }
        break;
      case '外包':
        break;
    }
    this.TotalWeight = Math.round(this.ShowScheduleTable.map(x => x.Weight).reduce((a, b) => a + b, 0) / 1000);
    var i = 1;
    this.inintialChart();

  }

  yyyymmdd() {
    var y = new Date().getFullYear().toString();
    var m = (new Date().getMonth() + 1).toString();
    var d = new Date().getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    var yyyymmdd = y + m + d;
    return yyyymmdd;
  }

  checkResult(item: string) {
    if (item == 'F') {
      return { 'background-color': 'darkgrey' };

    } else if (item == " ") {
      return { 'background-color': 'transparent' };
    }
    else if (item.length > 1 && item.includes('F')) {
      return { 'background-color': 'darkorange' };
    } else {
      return { 'background-color': 'transparent' };
    }

  }

  FlaskMatchChange(item: FlaskList) {
    if (this.ShowScheduleTable.filter(x => {
      return this.CheckDate(StringToDate(x.Pattern), StringToDate(x.DeFlask),
        StringToDate(this.CurrentScheduleResult.Pattern), StringToDate(this.CurrentScheduleResult.DeFlask));
    }).length > 0) {
      this.flashMessage.show()
    }
    this.CurrentPOstatus.flaskMatches.forEach(x => {
      if (item.FlaskId == x.FlaskId) {
        x.Choice = true;
      } else {
        x.Choice = false;
      }
    });

  }
  CheckDate(a: Date, b: Date, x: Date, y: Date) {

    if ((b < x) || (y < a)) {
      return false;
    }

    if ((a < x) && (x <= b)) {
      return true;
    }
    if ((a <= y) && (y < b)) {
      return true;
    }
    if ((a < y) && (b == x)) {
      return true;
    }
    return false;
  }

  inintialChart() {
    this.lineChartLabels = [];
    this.ShowScheduleTable.forEach(x => {
      switch (this.ShowGroup.substring(0, 2)) {
        case '木模':
          if (!x.Pattern.includes('F') && !this.lineChartLabels.includes(x.Pattern)) {
            this.lineChartLabels.push(x.Pattern);
          }
          break;
        case '造模':
          if (x.MoldingLine == this.ShowGroup && !x.Molding.includes('F') && !this.lineChartLabels.includes(x.Molding)) {
            this.lineChartLabels.push(x.Molding);
          }
          break;
        case '合模':
          if (x.AsemblingLine == this.ShowGroup && !x.Asembling.includes('F') && !this.lineChartLabels.includes(x.Asembling)) {
            this.lineChartLabels.push(x.Asembling);
          }
          break;
        case '澆注':
          if (!x.Pouring.includes('F') && !this.lineChartLabels.includes(x.Pouring)) {
            this.lineChartLabels.push(x.Pouring);
          }
          break;
        case '拆箱':
          if (!x.DeFlask.includes('F') && !this.lineChartLabels.includes(x.DeFlask)) {
            this.lineChartLabels.push(x.DeFlask);
          }
          break;
        case '退火':
          if (!x.StressRelease.includes('F') && !this.lineChartLabels.includes(x.StressRelease)) {
            this.lineChartLabels.push(x.StressRelease);
          }
          break;
        case '毛邊':
          if (!x.DeBurring.includes('F') && !this.lineChartLabels.includes(x.DeBurring)) {
            this.lineChartLabels.push(x.DeBurring);
          }
          break;
      }
    });

    var newdata = Array<number>();
    this.lineChartLabels = this.lineChartLabels.sort((a, b) => {
      if (b > a) {
        return -1;
      }
      else {
        return 1
      }
    });

    this.lineChartLabels.forEach(x => {
      switch (this.ShowGroup.substring(0, 2)) {
        case '木模':
          newdata.push(Math.round(this.ShowScheduleTable.filter(z => z.Pattern == x).map(z => z.Weight).reduce((a, b) => a + b) / 1000));
          break;
        case '造模':
          newdata.push(Math.round(this.ShowScheduleTable.filter(z => z.MoldingLine == this.ShowGroup && z.Molding == x).map(z => z.Weight).reduce((a, b) => a + b) / 1000));
          break;
        case '合模':
          newdata.push(Math.round(this.ShowScheduleTable.filter(z => z.AsemblingLine == this.ShowGroup && z.Asembling == x).map(z => z.Weight).reduce((a, b) => a + b) / 1000));
          break;
        case '澆注':
          newdata.push(Math.round(this.ShowScheduleTable.filter(z => z.Pouring == x).map(z => z.Weight).reduce((a, b) => a + b) / 1000));
          break;
        case '拆箱':
          newdata.push(Math.round(this.ShowScheduleTable.filter(z => z.DeFlask == x).map(z => z.Weight).reduce((a, b) => a + b) / 1000));
          break;
        case '退火':
          newdata.push(Math.round(this.ShowScheduleTable.filter(z => z.StressRelease == x).map(z => z.Weight).reduce((a, b) => a + b) / 1000));
          break;
        case '毛邊':
          newdata.push(Math.round(this.ShowScheduleTable.filter(z => z.DeBurring == x).map(z => z.Weight).reduce((a, b) => a + b) / 1000));
          break;
      }

    });
    this.lineChartData = [
      { data: newdata, label: this.ShowGroup },
    ];

  }

  exportexcel() {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */

    XLSX.writeFile(wb, this.fileName, { bookType: 'xlsx' });
  }


}

function StringToDate(Text: string) {
  var newdate = new Date();
  newdate.setFullYear(Number(Text.substr(0, 4)));
  newdate.setMonth(Number(Text.substr(4, 2)) - 1);
  newdate.setDate(Number(Text.substr(6, 2)));
  return newdate;
}
