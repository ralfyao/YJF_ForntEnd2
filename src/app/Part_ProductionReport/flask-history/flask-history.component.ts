import { ProductProcessTracking } from 'src/bin/productProcessTrackingResponse';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { FlaskHistory } from 'src/bin/flaskHistoryResponse';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-flask-history',
  templateUrl: './flask-history.component.html',
  styleUrls: ['./flask-history.component.css']
})
export class FlaskHistoryComponent implements OnInit {

  constructor(public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private modalService: NgbModal) { }
  workOrder:string = '';
  flaskId:string = '';
  flaskType:string = '';
  GridData:FlaskHistory[];
  fileName = 'ExcelSheet.xlsx';
  ngOnInit(): void {
  }
  // showValue(){
  //   alert(this.flaskType);
  // }
  setValue(flaskType:string){
    this.flaskType = flaskType;
    // this.showValue();
  }
  query(){
    this.spinnerService.show();
    this.GridData = [];
    this.rest.apiFlaskUsageHistory(this.workOrder, this.flaskId, this.flaskType).pipe(
      tap(res=>{
        this.GridData = res.result;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  exportexcel() {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    console.log(element);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName,);
  }
}
