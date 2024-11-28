import { Component, OnInit } from '@angular/core';
import { PouringDataService } from 'src/app/Service/PouringData.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
@Component({
  selector: 'app-picking-abnormal',
  templateUrl: './picking-abnormal.component.html',
  styleUrls: ['./picking-abnormal.component.css']
})
export class PickingAbnormalComponent implements OnInit {

  constructor(
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private rest: PouringDataService,
  ) { }

  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
  NoPickingList: Array<any> = []

  ngOnInit(): void {
    this.GetData();
  }

  GetData() {
    this.spinnerService.show();
    this.rest.API_NoPickingList(this.UserAccount).then(
      (data) => {
        this.NoPickingList = data["TodoPickingList"];
      }
    ).finally(() => {
      this.spinnerService.hide();
    });
  }
  //yyyymmdd=>yyyy-mm-dd
  DateStringFormat(date: string) {
    if (date.length < 8)
      return date

    return date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
  }
}
