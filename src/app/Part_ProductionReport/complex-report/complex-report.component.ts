import { Component, OnInit } from '@angular/core';
import { ProdutionReportService } from 'src/app/Service/ProductionReport.service';
import { ReportInfo, ReportField, FilterData, ReportSource } from 'src/app/Model/ProductionReport'
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService  } from 'src/app/Service/sweet-alert.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-complex-report',
  templateUrl: './complex-report.component.html',
  styleUrls: ['./complex-report.component.css']
})

export class ComplexReportComponent implements OnInit {

  constructor(
    public rest: ProdutionReportService,
    private session: SessionStorageService,
    private spinnerService: NgxSpinnerService,
    private sweetAlertService: SweetAlertService,
    private modalService: NgbModal
  ) { }


  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);


  ReportList: Array<ReportInfo> = new Array<ReportInfo>();

  SelectedReportId: number = 0;
  SelectReportInfo: ReportInfo = new ReportInfo();
  Filters: Array<FilterData> = new Array<FilterData>();

  //計算欄位
  CalWeight: number = 0;
  CalAchievementRate = 0;
  HasFinishdate = false;//Filter有完工日才可以計算達成率

  alldata: any;
  tabledata: Array<any>;

  ModalReportInfo: ReportInfo = new ReportInfo();
  SourceList: Array<ReportSource> = new Array<ReportSource>();

  ngOnInit(): void {
    this.GetData();

  }
  GetData() {
    this.spinnerService.show();
    this.rest.API_ReportData(this.UserAccount).then(
      (data) => {
        this.ReportList = data["reportlist"];
        if (this.ReportList.length > 0 && this.SelectedReportId == 0) {
          this.SelectedReportId = data["reportlist"].slice(0, 1)[0].ReportId;
        }
        this.GetReportInfo(this.SelectedReportId);
        this.SourceList = data["sourcelist"];

      }
    ).catch((error) => {
      console.log(error);
      this.spinnerService.hide();
    })
  }
  GetReportInfo(ReportId: number) {
    this.spinnerService.show();
    this.rest.API_ReportInfo(ReportId).then(
      (data) => {
        this.SelectReportInfo = data["report"];

        this.rest.API_ReportSource(data["report"].SourceAPI).then(
          (data) => {
            this.alldata = data;
            console.log(this.alldata);
            this.tabledata = JSON.parse(JSON.stringify(this.alldata));
            this.SetFilter();
          }
        ).catch((error) => {
          console.log(error);
        })
          .finally(() => {
            this.spinnerService.hide();
          });
      }
    ).catch((error) => {
      console.log(error);
      this.spinnerService.hide();
    })
  }
  SetFilter() {
    arrayremove(this.Filters)
    this.HasFinishdate = false;
    this.SelectReportInfo.FieldList.filter(x => x.IsFilter == true).forEach(each => {
      let filter: FilterData = new FilterData();
      filter.Label = each.FieldName;
      filter.Type = each.FieldType;
      filter.FieldCode = each.FieldCode;
      if (filter.Type == 'select') {
        filter.Value = '全部';
        filter.DataList = Array.from(new Set(this.alldata.map(x => x[each.FieldCode])));
        filter.DataList.sort();
      }
      if (each.FieldCode == 'FinishDate') {
        this.HasFinishdate = true;
      }
      this.Filters.push(filter);
    })
  }
  DataFilter() {
    this.tabledata = JSON.parse(JSON.stringify(this.alldata));
    this.CalWeight = 0;
    this.CalAchievementRate = 0;
    for (let index = 0; index < this.Filters.length; index++) {
      let item: FilterData = this.Filters[index];
      switch (item.Type) {
        case 'date':
          this.tabledata = this.tabledata.filter(x => (x[item.FieldCode] >= item.StartDate.replace(/-/g, '') || item.StartDate == '') &&
            (x[item.FieldCode] <= item.EndDate.replace(/-/g, '') || item.EndDate == ''))
          break;
        case 'text':
          this.tabledata = this.tabledata.filter(x => x[item.FieldCode].includes(item.Value))
          break;
        case 'number':
          this.tabledata = this.tabledata.filter(x => x[item.FieldCode] == item.Value || item.Value == '')
          break;
        case 'select':
          this.tabledata = this.tabledata.filter(x => x[item.FieldCode] == item.Value || item.Value == '全部')
        default:
          break;
      }
    }
  }
  //yyyymmdd=>yyyy-mm-dd
  DateStringFormat(date: string) {
    if (!date)
      return date
    if (date.length < 8)
      return date

    return date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
  }
  SourceChange() {
    this.ModalReportInfo.FieldList = new Array<ReportField>();
    let selectsource = this.SourceList.filter(x => x.ReportSourceId == this.ModalReportInfo.ReportSourceId);
    if (selectsource.length > 0) {
      selectsource[0].SourceFieldList.forEach(field => {
        let newfield = new ReportField();
        newfield.SourceFieldId = field.SourceFieldId;
        newfield.FieldCode = field.SourceFieldCode;
        newfield.FieldName = field.SourceFieldName;
        newfield.FieldType = field.SourceFieldType;
        newfield.Sequence = field.Sequence;
        newfield.IsFilter = false;
        newfield.IsHidden = false;
        this.ModalReportInfo.FieldList.push(newfield);
      })
    }
  }
  EditReport(modal, report) {
    if (report == null) {
      this.ModalReportInfo = new ReportInfo();
      this.ModalReportInfo.SourceAPI = this.SelectReportInfo.SourceAPI;
      this.ModalReportInfo.ReportSourceId = this.SelectReportInfo.ReportSourceId;
      this.ModalReportInfo.ReportType = '2';//只能新增個人報表
      arrayremove(this.ModalReportInfo.FieldList);
      this.SelectReportInfo.FieldList.forEach(field => {
        let newfield = new ReportField();
        newfield = JSON.parse(JSON.stringify(field));
        newfield.FieldId = 0;
        this.ModalReportInfo.FieldList.push(newfield);
      })
    }
    else {
      this.ModalReportInfo = JSON.parse(JSON.stringify(report));
    }
    this.openmodal(modal, 'lg')
  }

  SaveReport() {
    if (this.ModalReportInfo.ReportName == "") {
      this.sweetAlertService.alertFail({
        text:"報表名稱不可空白"
      });
      return;
    }
    this.spinnerService.show();
    this.rest.API_ReportSave(this.UserAccount, this.ModalReportInfo).then(
      (data) => {
        if (data['WorkStatus'] == "Fail") {
          this.spinnerService.hide();
          this.sweetAlertService.alertFail({
            text: data["ErrorMsg"]
          });
          return;
        } else {
          this.spinnerService.hide();
          this.sweetAlertService.alertSuccess({
            text:'儲存成功'
          });

          if (this.ReportList.filter(x => x.ReportId == data['Report'].ReportId).length == 0) {
            this.ReportList.push(data['Report']);
          }
          this.SelectReportInfo = data['Report'];
          this.SelectedReportId = data['Report'].ReportId;
          this.SetFilter()//更新篩選條件

          this.modalService.dismissAll();
        }
      }
    ).catch((error) => {
      console.log(error);
    })
      .finally(() => {
        this.spinnerService.hide();
      });
  }
  Calculator() {
    this.CalWeight = 0;
    this.CalAchievementRate = 0;
    this.tabledata.forEach(item => {
      this.CalWeight += item.TotalWeight;
    })
    this.CalWeight = Math.floor(this.CalWeight);
    //計算達成率
    if (this.HasFinishdate == true) {
      let finishfilter: FilterData = this.Filters.filter(x => x.FieldCode == 'FinishDate')[0];

      let planfinishdate = JSON.parse(JSON.stringify(this.alldata));
      for (let index = 0; index < this.Filters.length; index++) {
        let item: FilterData = this.Filters[index];
        switch (item.Type) {
          case 'date':
            if (item.FieldCode != 'FinishDate') {
              planfinishdate = planfinishdate.filter(x => (x[item.FieldCode] >= item.StartDate.replace(/-/g, '') || item.StartDate == '') &&
                (x[item.FieldCode] <= item.EndDate.replace(/-/g, '') || item.EndDate == ''))
            }
            break;
          case 'text':
            planfinishdate = planfinishdate.filter(x => x[item.FieldCode].includes(item.Value))
            break;
          case 'number':
            planfinishdate = planfinishdate.filter(x => x[item.FieldCode] == item.Value || item.Value == '')
            break;
          case 'select':
            planfinishdate = planfinishdate.filter(x => x[item.FieldCode] == item.Value || item.Value == '全部')
          default:
            break;
        }
      }
      let Allcount = planfinishdate.filter(x => (x.PlanEndDate >= finishfilter.StartDate.replace(/-/g, '') || finishfilter.StartDate == '') &&
        (x.PlanEndDate <= finishfilter.EndDate.replace(/-/g, '') || finishfilter.EndDate == '')).length;
      let Finishcount = this.tabledata.filter(x => (x.PlanEndDate >= finishfilter.StartDate.replace(/-/g, '') || finishfilter.StartDate == '') &&
        (x.PlanEndDate <= finishfilter.EndDate.replace(/-/g, '') || finishfilter.EndDate == '') &&
        x.ProductionStatus == '已完工').length;

      if (Allcount == 0) {
        this.CalAchievementRate = 0;
      } else {
        this.CalAchievementRate = Math.round(Finishcount / Allcount * 10000) / 100;
      }

    }
  }

  openmodal(modal, size) {
    this.modalService.open(modal, { centered: true, size: size });
  }
  exportToExcel(): void {
    // 重新建構資料
    const newArray = this.tabledata.map(item=>{
      const newItem: { [key: string]: any } = {};
      this.SelectReportInfo['FieldList'].forEach(x=>{
        if (x.FieldCode in item){
          newItem[x.FieldName] = item[x.FieldCode];
        }
      });
      return newItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newArray);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    const reportName = this.ReportList.filter(x => x.ReportId === this.SelectedReportId);
    // 將資料匯出成 Excel 檔
    XLSX.writeFile(wb, reportName[0].ReportName+'.xlsx');
    // this.spinnerService.hide();
  }
}
function arrayremove(array) {
  let length = array.length;
  for (let index = 0; index < length; index++) {
    array.splice(0, 1);
  }
}
