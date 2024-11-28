import { Component, OnInit, ViewChild } from '@angular/core';
import { PouringDataService } from 'src/app/Service/PouringData.service';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MeltRecordDataRequest } from 'src/bin/meltRecordDataRequest';
import { MeltRecordDataResponse } from 'src/bin/meltRecordDataResponse';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-melting-sales-record',
  templateUrl: './melting-sales-record.component.html',
  styleUrls: ['./melting-sales-record.component.css']
})
export class MeltingSalesRecordComponent implements OnInit {

  constructor(
    public rest: PouringDataService,
    private session: SessionStorageService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal
  ) { }
  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
  MeltRecordData: Array<any> = new Array<any>();
  GridData: Array<any> = new Array<any>();
  timeout: any;
  searchStartDay: string = '';
  searchEndDay: string = '';
  searchTermStartDay: string = '';
  searchTermEndDay: string = '';
  maxDate: string = '';
  patternStatus: string = '';
  patternStatusSearchTerm: string = '';
  patternStatusGroup: Array<string> = ['全部', '外包', '在庫', '銷毀', '歸還'];
  apiRequest: MeltRecordDataRequest;
  apiResponse: MeltRecordDataResponse;
  custName: string = '';
  custNameSearchTerm: string = '';
  noDataMessages = {
    emptyMessage: `
    <div>
      查無資料
    </div>
  `
  };


  ngOnInit(): void {
    this.getInitDate();
    this.setRequest();
    this.GetData();
  }

  /**
   *設定初始搜尋日期
   *
   * @memberof MeltingSalesRecordComponent
   */
  getInitDate(): void {
    const initStartDate = new Date(new Date().setDate(new Date().getDate() - 7));
    let initStartDateMonth = '';
    let initStartDateDate = '';
    initStartDateMonth = initStartDate.getMonth() < 9 ? `0${initStartDate.getMonth() + 1}` : (initStartDate.getMonth() + 1).toString();
    initStartDateDate = initStartDate.getDate() < 10 ? `0${initStartDate.getDate()}` : initStartDate.getDate().toString();
    this.searchTermStartDay = [initStartDate.getFullYear(), initStartDateMonth, initStartDateDate].join('-');
    const initEndDate = new Date();
    let initEndDateMonth = '';
    let initEndDateDate = '';
    initEndDateMonth = initEndDate.getMonth() < 9 ? `0${initEndDate.getMonth() + 1}` : String(initEndDate.getMonth() + 1);
    initEndDateDate = initEndDate.getDate() < 10 ? `0${initEndDate.getDate()}` : String(initEndDate.getDate());
    this.searchTermEndDay = [initEndDate.getFullYear(), initEndDateMonth, initEndDateDate].join('-');
    this.maxDate = this.searchTermEndDay;
  }
  /**
   *設定API的Request
   *
   * @memberof MeltingSalesRecordComponent
   */
  setRequest() {
    this.searchEndDay = this.searchTermEndDay;
    this.searchStartDay = this.searchTermStartDay;
    this.custName = this.custNameSearchTerm;
    this.patternStatus = this.patternStatusSearchTerm;
    this.apiRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      startDate: this.searchStartDay.split('-').join(''),
      custName: this.custName,
      endDate: this.searchEndDay.split('-').join(''),
      patternStatus: this.patternStatus
    }
  }
  /**
   *取得表單資料
   *
   * @memberof MeltingSalesRecordComponent
   */
  GetData() {
    this.rest.API_meltRecordData(this.apiRequest).pipe(
      tap(res => {
        this.spinnerService.show();
        this.apiResponse = res;
        this.MeltRecordData = res.reportlist;
      }),
      tap(() => {
        this.spinnerService.hide();
      })
    ).subscribe();
  }
  /**
   *下載Excel檔案
   *
   * @memberof MeltingSalesRecordComponent
   */
  ExportData() {
    this.spinnerService.show();
    this.rest.API_meltRecordExcelFile(this.apiRequest).subscribe(() => this.spinnerService.hide());
  }
  /**
   *換頁
   *
   * @param {*} event
   * @memberof MeltingSalesRecordComponent
   */
  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
    }, 100);
  }
  /**
   *打開搜尋popup
   *
   * @param {*} modal
   * @memberof MeltingSalesRecordComponent
   */
  openmodal(modal: any) {
    this.modalService.open(modal, { centered: true, size: 'large' });
  }
  /**
   *執行搜尋
   *
   * @memberof MeltingSalesRecordComponent
   */
  onSearch() {
    this.setRequest();
    this.modalService.dismissAll();
    this.GetData();
  }
  /**
   *清除搜尋條件
   *
   * @memberof MeltingSalesRecordComponent
   */
  onClear() {
    this.searchTermEndDay = '';
    this.searchTermStartDay = '';
    this.custNameSearchTerm = '';
    this.patternStatusSearchTerm = '';
    this.setRequest();
  }

}
