import { Component, ChangeDetectorRef } from '@angular/core';
import { MainProductionOrder } from 'src/app/Model/production';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductionChartDataRequest } from 'src/bin/productionChartDataRequest';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-production-chart',
  templateUrl: './production-chart.component.html',
  styleUrls: ['./production-chart.component.css']
})

export class ProductionChartComponent {
  constructor(
    public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private modalService: NgbModal,
    private changeDetectorRef: ChangeDetectorRef
  ) { }
  public AllScheleList: Array<MainProductionOrder>;

  public modaltitle: string;
  public modaltabledata: Array<MainProductionOrder>;

  public barChartOptions1: any = {
    scales: {
      yAxes: [{
        id: 'A',
        type: 'linear',
        position: 'left',
        responsive: true,
        barThickness: 10
      }, {
        id: 'B',
        type: 'linear',
        position: 'right',
        ticks: {
          beginAtZero: true,   // minimum value will be 0.
          steps: 10,
          stepValue: 5,
          max: 100
        },
        gridLines: {
          display: false
        }
      }]
    }
  }
  public barChartOptions2: any = {
    scales: {
      yAxes: [{
        id: 'A',
        type: 'linear',
        position: 'left',
        responsive: true,
        barThickness: 10
      }]
    }
  }
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartColors1: Array<any> = [
    { backgroundColor: 'rgba(221, 179, 75, 0.2)', borderColor: 'rgba(255, 206, 86, 1)', borderWidth: 2 },
    { backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 2 },
    { backgroundColor: 'rgba(255,99,132,0.2)', borderColor: 'rgba(255,99,132,1)', borderWidth: 2 },
    { backgroundColor: 'rgba(153, 102, 255, 0.2)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 2 },
  ];
  public barChartColors2: Array<any> = [
    { backgroundColor: 'rgba(255,99,132,0.2)', borderColor: 'rgba(255,99,132,1)', borderWidth: 2 }
  ];

  GroupScheduleData: Array<MainProductionOrder>;
  public MoldingbarChartLabels: string[] = [];
  SelectMoldingsGroup: string = '全部';
  MoldingsGroups: Array<string> = [];
  allMoldings: number[] = [];
  finishMoldings: number[] = [];
  undoMoldings: number[] = [];
  completionrates: number[] = [];
  public MoldingbarChartData: any[] = [
    { data: this.allMoldings, label: '全部', yAxisID: 'A' },
    { data: this.finishMoldings, label: '已完成', yAxisID: 'A' },
    { data: this.undoMoldings, label: '未完成', yAxisID: 'A' },
    { data: this.completionrates, label: '完成率', yAxisID: 'B', type: 'line', fill: false }
  ];

  public AsemblingbarChartLabels: string[] = [];
  undoAsemblings: number[] = [];
  public AsemblingbarChartData: any[] = [
    { data: this.undoAsemblings, label: '未完成' }
  ];

  public PouringbarChartLabels: string[] = [];
  undoPourings: number[] = [];
  public PouringbarChartData: any[] = [
    { data: this.undoPourings, label: '未完成' }
  ];
  ngOnInit(): void {
    this.GetData();
  }

  // events
  public MoldingchartClicked(e: any, modal) {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      this.modaltitle = '造模' + activePoints[0]._model.label + activePoints[0]._model.datasetLabel
      switch (activePoints[0]._model.datasetLabel) {
        case '全部': {
          this.modaltabledata = this.GroupScheduleData.filter(x => this.DateStringFormat(x.SchedulingDate) == activePoints[0]._model.label);
          break;
        }
        case '已完成': {
          this.modaltabledata = this.GroupScheduleData.filter(x => this.DateStringFormat(x.SchedulingDate) == activePoints[0]._model.label && (x.MoldingFinishCode == "Y" || x.MoldingFinishCode == "y" || x.ProductionOrderStatus == 'y' || x.ProductionOrderStatus != 'Y'));
          break;
        }
        case '未完成': {
          this.modaltabledata = this.GroupScheduleData.filter(x => this.DateStringFormat(x.SchedulingDate) == activePoints[0]._model.label && x.MoldingFinishCode != "Y" && x.MoldingFinishCode != "y" && x.ProductionOrderStatus != 'y' && x.ProductionOrderStatus != 'Y');
          break;
        }
        default:
          return;
      }
      this.OpenModal(modal);
    }
  }
  public AsemblingchartClicked(e: any, modal): void {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      this.modaltitle = '合模' + activePoints[0]._model.label + activePoints[0]._model.datasetLabel
      let finishdate = new Date(activePoints[0]._model.label);
      finishdate = this.UnGetLebleDate(finishdate);
      this.modaltabledata = [];
      this.AllScheleList.filter(x => x.MoldingFinishDate == DateFormat(finishdate).replace(/\//g, '')
        && (x.AsemblingFinishDate == "" || x.AsemblingFinishDate == null)).forEach(item => {
          this.AllScheleList.filter(x => x.ProductionOrderCode == item.ProductionOrderCode).forEach(Schele => {

            this.modaltabledata.push(Schele);

          })
        })
      this.OpenModal(modal);
    }
  }
  public PouringchartClicked(e: any, modal): void {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      this.modaltitle = '澆注' + activePoints[0]._model.label + activePoints[0]._model.datasetLabel
      this.modaltabledata = [];
      let finishdate = new Date(activePoints[0]._model.label);
      finishdate = this.UnGetLebleDate(finishdate);
      this.AllScheleList.filter(x => x.AsemblingFinishDate == DateFormat(finishdate).replace(/\//g, '')
        && (x.PouringFinishDate == "" || x.PouringFinishDate == null)).forEach(item => {
          this.AllScheleList.filter(x => x.ProductionOrderCode == item.ProductionOrderCode).forEach(Schele => {
            this.modaltabledata.push(Schele);
          })
        })
      this.OpenModal(modal);
    }
  }


  public chartHovered(e: any): void {
    // console.log(e);
  }

  public randomize(): void {
  }

  public GetData() {
    this.spinnerService.show()
    const request: ProductionChartDataRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    this.rest.apiProductionChartData(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.AllScheleList = res.allscheles;
        this.MoldingsGroups = Array.from(new Set(this.AllScheleList.filter(x => x.MoldingLineName !== "").map(item => item.MoldingLineName)));
        this.MoldingsGroups.sort();
        this.setMoldingData();
        this.setAsemblingData();
        this.setPouringData();
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  public setMoldingData() {
    this.GroupScheduleData = this.AllScheleList.filter(x => (this.SelectMoldingsGroup == '全部' || this.SelectMoldingsGroup == x.MoldingLineName) && x.MoldingFinishCode != '');
    arrayremove(this.MoldingbarChartLabels);
    arrayremove(this.allMoldings);
    arrayremove(this.undoMoldings);
    arrayremove(this.finishMoldings);
    arrayremove(this.completionrates);
    this.changeDetectorRef.detectChanges();//先更新清空畫面才不會錯亂
    //放下方label
    this.MoldingbarChartLabels = Array.from(new Set(this.GroupScheduleData.filter(x => x.MoldingFinishCode != "Y"
      && x.MoldingFinishCode != "y"
      && x.ProductionOrderStatus != "y"
      && x.ProductionOrderStatus != "Y"
      && x.SchedulingDate != null).map(x => this.DateStringFormat(x.SchedulingDate))));
    //
    this.MoldingbarChartLabels.sort();
    this.MoldingbarChartLabels.forEach(label => {
      let allMolding: number = 0;
      let finishMolding: number = 0;
      let undoMolding: number = 0;
      this.GroupScheduleData.filter(x => x.SchedulingDate == label.replace(/\//g, '')).forEach(item => {
        allMolding += item.ProductWeight * item.PlanQTY;
        if (item.MoldingFinishCode == "Y" || item.MoldingFinishCode == "y" || item.ProductionOrderStatus == "y" || item.ProductionOrderStatus == "Y") {
          finishMolding += item.ProductWeight * item.PlanQTY;
        } else {
          undoMolding += item.ProductWeight * item.PlanQTY;
        }
      })

      this.allMoldings.push(allMolding);
      this.undoMoldings.push(undoMolding);
      this.finishMoldings.push(finishMolding);
      this.completionrates.push(Math.round(finishMolding / allMolding * 10000) / 100);
    })

  }
  public setAsemblingData() {
    this.AllScheleList.filter(x => x.MoldingFinishDate != "" && (x.AsemblingFinishDate == "" || x.AsemblingFinishDate == null)).forEach(item => {
      let finishdate = new Date(this.DateStringFormat(item.MoldingFinishDate))
      finishdate = this.GetLebleDate(finishdate);
      if (!this.AsemblingbarChartLabels.includes(DateFormat(finishdate))) {
        this.AsemblingbarChartLabels.push(DateFormat(finishdate));
      }
    })
    this.AsemblingbarChartLabels.sort();
    this.AsemblingbarChartLabels.forEach(label => {
      let undoAsembling: number = 0;
      let finishdate = this.UnGetLebleDate(new Date(label));
      this.AllScheleList.filter(x => x.MoldingFinishDate == DateFormat(finishdate).replace(/\//g, '')
        && (x.AsemblingFinishDate == "" || x.AsemblingFinishDate == null)).forEach(item => {
          this.AllScheleList.filter(x => x.ProductionOrderCode == item.ProductionOrderCode).forEach(Schele => {
            undoAsembling += Schele.ProductWeight;
          })
        })

      this.undoAsemblings.push(undoAsembling);

    })
  }


  public setPouringData() {
    this.AllScheleList.filter(x => x.AsemblingFinishDate != "" && (x.PouringFinishDate == "" || x.PouringFinishDate == null)).forEach(item => {
      let finishdate = new Date(this.DateStringFormat(item.AsemblingFinishDate))
      finishdate = this.GetLebleDate(finishdate);
      if (!this.PouringbarChartLabels.includes(DateFormat(finishdate))) {
        this.PouringbarChartLabels.push(DateFormat(finishdate));
      }
    })
    this.PouringbarChartLabels.sort();
    this.PouringbarChartLabels.forEach(label => {
      let undoPouring: number = 0;
      let finishdate = this.UnGetLebleDate(new Date(label));
      this.AllScheleList.filter(x => x.AsemblingFinishDate == DateFormat(finishdate).replace(/\//g, '')
        && (x.PouringFinishDate == "" || x.PouringFinishDate == null)).forEach(item => {
          this.AllScheleList.filter(x => x.ProductionOrderCode == item.ProductionOrderCode).forEach(Schele => {
            undoPouring += Schele.ProductWeight;
          })
        })

      this.undoPourings.push(undoPouring);

    })
  }

  MoldingGroupBtnClick(group) {
    this.SelectMoldingsGroup = group;
    this.setMoldingData();
  }


  OpenModal(modal) {

    this.modalService.open(modal, { centered: true, size: 'xl' });
  }
  GetLebleDate(date: Date) {
    let week = date.getDay();
    if (week == 6) {
      date.setDate(date.getDate() + 2)
    } else {
      date.setDate(date.getDate() + 1)
    }
    return date;
  }
  UnGetLebleDate(date: Date) {
    let week = date.getDay();
    if (week == 1) {
      date.setDate(date.getDate() - 2)
    } else {
      date.setDate(date.getDate() - 1)
    }
    return date
  }

  DateStringFormat(date) {
    return date.substring(0, 4) + '/' + date.substring(4, 6) + '/' + date.substring(6, 8)
  }

}


function DateFormat(date) {
  date = new Date(date);

  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();
  return year + '/' + month + '/' + day;
}

function arrayremove(array) {
  let length = array.length;
  for (let index = 0; index < length; index++) {
    array.splice(0, 1);
  }
}
