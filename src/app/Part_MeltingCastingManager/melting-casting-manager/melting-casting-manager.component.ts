import { Component, OnInit, Inject } from '@angular/core';
import { PermissionService } from 'src/app/Service/permission.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PouringDataService } from 'src/app/Service/PouringData.service';
import { Model_PouringDataListItem } from 'src/app/Model/PouringData';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { SinglePermissionPerson } from 'src/app/Model/vo';
import { Router } from '@angular/router';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({

  selector: 'app-melting-casting-manager',
  templateUrl: './melting-casting-manager.component.html',
  styleUrls: ['./melting-casting-manager.component.css'],
  providers: [PouringDataService]
})

export class MeltingCastingManagerComponent implements OnInit {
  //#region 列表翻頁的參數跟API抓取參數
  public PageCount: number = 12;
  public TotalCount: number = 0;
  public Page: number = 1;
  public LoginUserPermission: Array<SinglePermissionPerson> = this.session.retrieve(LoginSessionEnum.Permission);
  public LoginUserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
  //#endregion

  //#region UI參數
  private sdate: string;
  private edate: string;
  public StartDate: Date = new Date(new Date().getTime() - (7 * 24 * 3600000));
  public EndDate: Date = new Date();
  public settings = {
    bigBanner: true,
    timePicker: false,
    format: 'yyyy-MM-dd',
    defaultOpen: false
  }
  public PDID: string = "";
  public EngName: string = "";
  public PouringContainer: string = "";
  public PouringDataList: Array<Model_PouringDataListItem>;
  SearchText: string = "";


  constructor(
    @Inject(DOCUMENT) private document,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    public premanager: PermissionService,
    private rest: PouringDataService,
    private router: Router,
    private crypt: CustomValidateService) { }
  //#endregion


  ngOnInit() {
    this.LoginUserPermission = this.session.retrieve(LoginSessionEnum.Permission);
    this.sdate = new Date(new Date().getTime() - (7 * 24 * 3600000)).getFullYear().toString() + "/" + (new Date(new Date().getTime() - (7 * 24 * 3600000)).getMonth() + 1).toString() + "/" + new Date(new Date().getTime() - (7 * 24 * 3600000)).getDate().toString();
    this.edate = new Date().getFullYear().toString() + "/" + (new Date().getMonth() + 1).toString() + "/" + new Date().getDate().toString();
    this.SmartSearch(1);
  }
  SmartSearch(Page: number) {
    this.spinnerService.show();
    this.Page = Page;
    this.rest.API_SmartSearchPouringDataList(this.SearchText, this.LoginUserAccount,Page,this.PageCount).then(
      (data) => {
        this.PouringDataList = data['PouringDataReps'];
        this.TotalCount = Number(data['TotalCount']);
        this.spinnerService.hide();
      }, (error) => {
        this.spinnerService.hide();
      }
    )

  }
  TableRowColorChange(tablename:string,List:any,row:number){
    var i = 0;
    List.forEach(x=>{
      this.document.getElementById(tablename+i.toString()).setAttribute('style', '');
      i++
    });
    this.document.getElementById(tablename+row.toString()).setAttribute('style', 'background-color:deepskyblue;');
  }

  queryList() {
    this.spinnerService.show();

    this.rest.API_Query_PouringDataList(
      this.PDID,
      this.EngName,
      this.sdate,
      this.edate,
      this.PouringContainer,
      this.PageCount.toString(),
      this.Page.toString()
    ).then(
      (data) => {
        if (data['WorkStatus'] === "Fail") {

        }
        else {
          this.PouringDataList = data['PouringDataReps'];
          this.TotalCount = Number(data['TotalCount']);
        }
        this.spinnerService.hide();
      }, (error) => {
        this.spinnerService.hide();
      }
    )
  }

  querySinglePouringData(POU_PouringData_ID: string) {
    this.rest.API_Query_SinglePouringData(POU_PouringData_ID).then(
      (data) => {
        let s: string = JSON.stringify(data);
        this.router.navigate(['login_success/MeltingCastingManagerDetail'], { queryParams: { Melting: this.crypt.AESEncrypt(s) } });
      }, () => {

      })
  }

  addCastingLog() {
    this.router.navigate(['login_success/MeltingCastingManagerDetail'], { queryParams: { Melting: null } });
  }

  loadPage(page: number) {
    this.Page = page;
    this.SmartSearch(page);
  }

  onStartDateSelect(value: Date) {
    this.sdate = value.getFullYear().toString() + "/" + (value.getMonth() + 1).toString() + "/" + value.getDate().toString();

  }
  onEndDateSelect(value: Date) {
    this.edate = value.getFullYear().toString() + "/" + (value.getMonth() + 1).toString() + "/" + value.getDate().toString();

  }
}
