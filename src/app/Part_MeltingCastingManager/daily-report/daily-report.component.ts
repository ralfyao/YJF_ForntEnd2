import { Component, OnInit, ViewChild } from '@angular/core';
import { PouringDataService } from 'src/app/Service/PouringData.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService  } from 'src/app/Service/sweet-alert.service'

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.css'],
  providers: [PouringDataService]
})
export class DailyReportComponent implements OnInit {

  constructor(
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private modalService: NgbModal,
    private rest: PouringDataService,
    private sweetAlertService: SweetAlertService
    ) { }

  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
  DailyReport: Array<any> = new Array<any>();
  TodoList: Array<any> = new Array<any>();
  DoingList: Array<any> = new Array<any>();
  GridData: Array<any> = new Array<any>();
  MatchTotal: number = 0;

  TodoSelected: Array<any> = [];
  DoingSelected: Array<any> = [];
  OrderDate: string = DateFormat(new Date());
  //單據日期只能當天或前一天
  MaxDate=DateFormat(new Date());
  MinDate=DateFormat(new Date().setDate(new Date().getDate() -1));


  AsemblingList: Array<string> = [];
  MaterialList: Array<any> = [{
    value: "全部",
    selected: true
  }];

  ReportType:string='';

  AsemblingProductionLine: string = "全部";
  AsemblingStartDate = "";
  AsemblingEndDate = "";
  ngOnInit(): void {
    this.GetDate();
  }
  GetDate() {
    this.spinnerService.show();
    this.rest.API_DailyReportData(this.UserAccount).then(
      (data) => {
        this.DailyReport = data["reportlist"];

        this.AsemblingList = Array.from(new Set(this.DailyReport.filter(f => f.AsemblingLineName != "" && f.AsemblingLineName != null).map(item => item.AsemblingLineName))).sort();
        this.TodoList = this.DailyReport.filter(x => x.AsemblingStatus == "合模完成" && x.PouringStatus == "未澆注");
        this.DoingList = this.DailyReport.filter(x => x.AsemblingStatus == "合模完成" && x.PouringStatus == "澆注中");

        let MaterialTypelist = Array.from(new Set(this.DailyReport.map(item => item.MaterialType)));
        for (let index = 0; index < MaterialTypelist.length; index++) {
          this.MaterialList.push({
            value: MaterialTypelist[index],
            selected: true
          })
        }

        this.FilterData();
      }
    ).finally(() => {
      this.spinnerService.hide();
    });
  }
  FilterData() {
    let MaterialSelectList = this.MaterialList.filter(x => x["selected"] == true && x["value"] != "全部").map(x => x["value"]);
    this.GridData = this.DailyReport.filter(x =>
      (this.AsemblingProductionLine == x.AsemblingLineName || this.AsemblingProductionLine == "全部") &&
      (this.AsemblingStartDate.replace(/-/g, '') <= x.AsemblingFinishDate || this.AsemblingStartDate == '') &&
      (this.AsemblingEndDate.replace(/-/g, '') >= x.AsemblingFinishDate || this.AsemblingEndDate == '') &&
      (MaterialSelectList.includes(x.MaterialType)))

    this.MatchTotal = 0;
    this.GridData.forEach(a => this.MatchTotal += a.Qty * a.UnitWeight);
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
    this.FilterData();
  }
  onSelect({ selected }, selectedlist) {
    selectedlist.splice(0, selectedlist.length);
    selectedlist.push(...selected);
  }
  Transfer(event:any) {
    if (this.OrderDate=="") {
      this.sweetAlertService.alertFail({
        text:"單據日期不可空白!!",
      });
      return;
    } else if(this.OrderDate>this.MaxDate||this.OrderDate<this.MinDate){
      this.sweetAlertService.alertFail({
        text:"單據日期只能當日或前一日!!",
      });
      return;
    }
    let updatelist: Array<any>;
    switch (this.ReportType) {
      case "in":
        updatelist = this.TodoSelected;
        break;
      case "out":
        updatelist = this.DoingSelected;
        break;
      default:
        break;
    }
    if (updatelist.length == 0) {
      this.sweetAlertService.alertFail({
        text: "未選擇製令單!!",
      });
      return;
    }
    event.target.disabled = true;
    this.spinnerService.show();
    let today = this.OrderDate == "" ? DateFormat(new Date()).replace(/-/g, '') : this.OrderDate.replace(/-/g, '');
    this.rest.API_UpdatePouringSFC(this.UserAccount, this.ReportType, today, updatelist).then(
      (data) => {
        if (data["WorkStatus"] == "OK" && data["Result"] == "Success") {
          //更新畫面資料
          switch (this.ReportType) {
            case "in":
              this.TodoSelected.splice(0, this.TodoSelected.length);
              break;
            case "out":
              this.DoingSelected.splice(0, this.DoingSelected.length);
              break;
            default:
              break;
          }
          this.GetDate();
          this.sweetAlertService.alertSuccess({
            text:'成功'
          });
        } else if (data["WorkStatus"] == "Fail" || data["Result"] == "Fail") {
          this.sweetAlertService.alertFail({
            text: data["Message"],
          });
        }
      }
    ).finally(() => {
      this.spinnerService.hide();
    });
  }
  ExportPouringTodo() {
    this.spinnerService.show();
    this.rest.API_ExportPouringTodo(this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        let filepath: string = data['ExcelFilePath'];

        window.open(filepath);
      }
    ).finally(() => {
      this.spinnerService.hide();
    });
  }

  openmodal(modal, size) {
    this.modalService.open(modal, { centered: true, size: size });
  }

  //yyyymmdd=>yyyy-mm-dd
  DateStringFormat(date: string) {
    if (date.length < 8)
      return date

    return date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
  }
}
function DateFormat(date) {
  date = new Date(date);
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();
  return year + '-' + month + '-' + day;
}
