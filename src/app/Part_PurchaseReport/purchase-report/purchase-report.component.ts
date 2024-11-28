import { Component, OnInit } from '@angular/core';
import { PurchaseHR } from 'src/app/Model/PurchaseReport';
import { PurchaseReportService } from 'src/app/Service/purchase-report.service';
import { SweetAlertService } from 'src/app/Service/sweet-alert.service'
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css']
})
export class PurchaseReportComponent implements OnInit {

  constructor(
    public rest: PurchaseReportService,
    private session: SessionStorageService,
    private spinnerService: NgxSpinnerService,
    private sweetAlertService: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.Search();
  }
  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount)

  Type: string = '5';
  StartMonth: string =GetLastMonth();
    EndMonth: string =GetLastMonth();

  HRGroup: Array<string> = new Array<string>();
  PurchaseList: Array<PurchaseHR> = new Array<PurchaseHR>();

  Search() {
    this.spinnerService.show();
    this.rest.API_GetPurchaseData(this.UserAccount, this.StartMonth.replace(/-/g, ""), this.EndMonth.replace(/-/g, ""), this.Type).then((data) => {
      this.PurchaseList = data["PurchaseList"];
      this.HRGroup = Array.from(new Set(this.PurchaseList.map(x => x.HRName)));
    }).finally(()=>{
      this.spinnerService.hide();
    })
  }
  ExportExcel() {
    this.spinnerService.show();
    this.rest.API_ExportPurchaseReport(this.UserAccount, this.StartMonth.replace(/-/g, ""), this.EndMonth.replace(/-/g, ""), this.Type).then(
      (data) => {
        let filepath: string = data['ExcelFilePath'];
        window.open(filepath);
      }
    ).finally(() => {
      this.spinnerService.hide();
    });
  }
}
function GetLastMonth() {
  const currentDate = new Date();  // 獲取當前日期
  // 將當前日期減去一個月
  currentDate.setMonth(currentDate.getMonth() - 1);
  return currentDate.toLocaleDateString('en-CA').substring(0, 7);
}
