import { Component, OnInit } from '@angular/core';
import { ProdutionReportService } from 'src/app/Service/ProductionReport.service';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProcessData } from 'src/app/Model/production';

@Component({
  selector: 'app-molding-core-report',
  templateUrl: './molding-core-report.component.html',
  styleUrls: ['./molding-core-report.component.css']
})
export class MoldingCoreReportComponent implements OnInit {

  constructor(
    public rest: ProdutionReportService,
    private session: SessionStorageService,
    private spinnerService: NgxSpinnerService
  ) { }

  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);

  DoingList: Array<any> = [];
  MatchData: Array<any> = [];
  CoreUndoData: Array<any> = [];
  MoldingUndoData: Array<any> = [];

  CoreList: Array<string> = [];
  MoldingList: Array<string> = [];
  AsemblingList: Array<string> = [];
  MaterialList: Array<any> = [{
    value: "全部",
    selected: true
  }];

  AsemblingProductionLine: string = "全部";
  MoldingProductionLine: string = "全部";
  CoreProductionLine: string = "全部";

  MatchTotal: number = 0;
  ngOnInit(): void {
    this.GetData();
  }
  GetData() {
    this.spinnerService.show();
    this.rest.API_GetDoingList(this.UserAccount).then(
      (data) => {
        this.DoingList = data["processInfos"];

        this.CoreList = Array.from(new Set(this.DoingList.filter(f => f.CoreLineName != "" && f.CoreLineName != null).map(item => item.CoreLineName)));
        this.MoldingList = Array.from(new Set(this.DoingList.filter(f => f.MoldingLineName != "" && f.MoldingLineName != null).map(item => item.MoldingLineName)));
        this.AsemblingList = Array.from(new Set(this.DoingList.filter(f => f.AsemblingLineName != "" && f.AsemblingLineName != null).map(item => item.AsemblingLineName)));

        let MaterialTypelist = Array.from(new Set(this.DoingList.map(item => item.MaterialType)));
        for (let index = 0; index < MaterialTypelist.length; index++) {
          this.MaterialList.push({
            value: MaterialTypelist[index],
            selected: true
          })
        }

        this.FilterCoreData();
        this.FilterMoldingData();
        this.FilterAsemblingData();
      }
    ).finally(() => {
      this.spinnerService.hide();
    });
  }
  FilterCoreData() {
    this.CoreUndoData = this.DoingList.filter(x => (x.MoldingFinishCode != "N" && x.MoldingFinishCode != "" && x.MoldingLineCode != "" && x.CoreFinishCode == "N") &&
      (this.CoreProductionLine == x.CoreLineName || this.CoreProductionLine == "全部"));
    this.CoreUndoData.sort(function (x, y) {
      if (x.CoreLineName > y.CoreLineName)
        return 1;
      if (x.CoreLineName < y.CoreLineName)
        return -1;
      return 0;
    })
  }
  FilterMoldingData() {
    this.MoldingUndoData = this.DoingList.filter(x => (x.MoldingFinishCode == "N" && (x.CoreFinishCode != "N" || x.CoreFinishCode == "")) &&
      (this.MoldingProductionLine == x.MoldingLineName || this.MoldingProductionLine == "全部"));
    this.MoldingUndoData.sort(function (x, y) {
      if (x.MoldingLineName > y.MoldingLineName)
        return 1;
      if (x.MoldingLineName < y.MoldingLineName)
        return -1;
      return 0;
    })
  }
  FilterAsemblingData() {
    let MaterialSelectList = this.MaterialList.filter(x => x["selected"] == true && x["value"] != "全部").map(x => x["value"]);

    this.MatchData = this.DoingList.filter(x => (x.MoldingFinishCode == "Y" || x.MoldingFinishCode == "y") &&
      (x.CoreFinishCode == "Y" || x.CoreFinishCode == "y" || x.CoreLineCode == "") &&
      (this.AsemblingProductionLine == x.AsemblingLineName || this.AsemblingProductionLine == "全部") &&
      (MaterialSelectList.includes(x.MaterialType))
    )
    this.MatchTotal = 0;
    this.MatchData.forEach(a => this.MatchTotal += a.Qty * a.UnitWeight);
  }

  MaterialSelectChange(event, item) {
    if (item.value == '全部') {
      this.MaterialList.forEach(element => {
        element.selected = event;
      });
    } else {
      item.selected = event;
      if (event == true) {
        let IsAllCheck = true;
        for (let index = 1; index < this.MaterialList.length; index++) {
          if (this.MaterialList[index].selected == false && this.MaterialList[index].value != item.value) {
            IsAllCheck = false;
          }
        }
        this.MaterialList[0].selected = IsAllCheck;
      } else {
        this.MaterialList[0].selected = false;
      }
    }
    this.FilterAsemblingData();
  }



  ExportAsemblingTodo() {
    this.spinnerService.show();
    this.rest.API_ExportAsemblingTodo(this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        let filepath: string = data['ExcelFilePath'];

        window.open(filepath);
      }
    ).finally(() => {
      this.spinnerService.hide();
    });
  }
  ExportCoreExcel() {
    this.spinnerService.show();
    this.rest.API_ExportCoreUndo(this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        let filepath: string = data['ExcelFilePath'];

        window.open(filepath);
      }
    ).finally(() => {
      this.spinnerService.hide();
    });
  }
  ExportMoldingUndo() {
    this.spinnerService.show();
    this.rest.API_ExportMoldingUndo(this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        let filepath: string = data['ExcelFilePath'];

        window.open(filepath);
      }
    ).finally(() => {
      this.spinnerService.hide();
    });
  }

  //yyyymmdd=>yyyy-mm-dd
  DateStringFormat(date: string) {
    if (!date)
      return date
    if (date.length < 8)
      return date

    return date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
  }
}
