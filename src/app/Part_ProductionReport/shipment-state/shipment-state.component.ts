import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { ProdutionReportService } from 'src/app/Service/ProductionReport.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
@Component({
  selector: 'app-shipment-state',
  templateUrl: './shipment-state.component.html',
  styleUrls: ['./shipment-state.component.css']
})
export class ShipmentStateComponent implements OnInit {

  constructor(
    public rest: ProdutionReportService,
    private session: SessionStorageService,
    private spinnerService: NgxSpinnerService
  ) { }

  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
  ngOnInit(): void {
    this.GetData();
  }

  ETDEndDate: string = '';
  ETDStartDate: string = '';
  GridData: Array<any> = new Array<any>();
  GetData() {
    this.spinnerService.show();

    this.rest.API_ShipmentData(this.UserAccount, this.ETDStartDate.replace(/-/g, ''), this.ETDEndDate.replace(/-/g, '')).then(
      (data) => {
        this.GridData = data['shipmentlist'];
        this.spinnerService.hide();
      }
    ).catch((error) => {
      console.log(error);
      this.spinnerService.hide();
    })
  }
}
