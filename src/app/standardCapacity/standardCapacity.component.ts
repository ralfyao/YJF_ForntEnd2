import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProdutionService } from '../Service/ProdutionService';
import { of } from 'rxjs';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from '../Enum/session-enum.enum';
import { LineProdCapacityRequest } from 'src/bin/lineProdCapacityRequest';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { LineProdCapacityResponseResult } from 'src/bin/lineProdCapacityResponseResult';
import { SftLineListResponseLineCodeName } from 'src/bin/SftLineListResponseLineCodeName';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddLineStandardCapacityRequest } from 'src/bin/addLineStandardCapacityRequest';
import { FormServiceService } from '../Service/formService.service';
import { EditLineStandardCapacityRequest } from 'src/bin/editLineStandardCapacityRequest';
import { DelLineStandardCapacityRequest } from 'src/bin/delLineStandardCapacityRequest';

type popupType = 'add' | 'edit';
@Component({
  selector: 'app-standardCapacity',
  templateUrl: './standardCapacity.component.html',
  styleUrls: ['./standardCapacity.component.css']
})
export class StandardCapacityComponent implements OnInit {
  @ViewChild('confirmDelete') confirmDelete: ElementRef;
  userName: string = this.session.retrieve(LoginSessionEnum.Name);;
  userAccount: string = this.session.retrieve(LoginSessionEnum.UserAccount);
  column: Array<string> = ['線別', '標準產能', '影響天數', '修改日期', '維護人員', '操作']
  lineCodes: Array<SftLineListResponseLineCodeName> = [];
  lineCapacityDatas: Array<LineProdCapacityResponseResult> = [];
  editItem: LineProdCapacityResponseResult;
  popupType: popupType = 'add';
  confirmMessage: string = '';
  itemSelected: LineProdCapacityResponseResult;
  form: FormGroup = new FormGroup({
    lineCode: new FormControl('', [Validators.required]),
    capacity: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]),
    affectDays: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)])
  });

  searchForm: FormGroup = new FormGroup({
    lineCodesSearch: new FormControl('')
  })
  constructor(
    private rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private modalService: NgbModal,
    private fS: FormServiceService
  ) { }

  ngOnInit() {
    this.getLineCodes().pipe(
      switchMap(() => {
        return this.getLineProdCapacity()
      })
    ).subscribe();
    this.searchForm.get('lineCodesSearch').valueChanges.pipe(
      switchMap((res) => {
        return this.getLineProdCapacity(res)
      })
    ).subscribe()
  }
  /**
   *獲取所有產線資料
   *
   * @return {*}
   * @memberof StandardCapacityComponent
   */
  getLineCodes() {
    this.spinnerService.show();
    return this.rest.apiSftLineList().pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.lineCodes = res.lineCodeNames;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    )
  }

  getLineName(lineCode: string) {
    if (!this.lineCodes) return ''
    const a = this.lineCodes.find(i => i.lineCode == lineCode);
    return a ? a.lineName : ''
  }

  getLineProdCapacity(lineCode?: string) {
    this.spinnerService.show();
    const request: LineProdCapacityRequest = {
      Account: this.userAccount
    }
    if (lineCode) request.lineCode = lineCode
    return this.rest.apiLineProdCapacity(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.lineCapacityDatas = res.result;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    )
  }

  openmodal(model: any, popupType: popupType, edit?: LineProdCapacityResponseResult): void {
    this.modalService.open(model, { size: 'lg' });
    this.form.reset();
    this.form.get('lineCode').setValue('');
    this.form.get('lineCode').enable();
    this.popupType = popupType;
    if (edit) {
      this.editItem = edit;
      this.form.get('lineCode').setValue(this.editItem.LineCode);
      this.form.get('lineCode').disable();
      this.form.get('capacity').setValue(this.editItem.Capacity);
      this.form.get('affectDays').setValue(this.editItem.AffectDays);
    } else {
      this.editItem = null;
    }
  }

  submit() {
    if (!this.form.valid) {
      this.fS.errorOccur(this.form);
      return
    }
    this.spinnerService.show();

    if (this.popupType == 'edit') {
      const requestEdit: EditLineStandardCapacityRequest = {
        Account: this.userAccount,
        standardCapacity: {
          lineCode: this.form.get('lineCode').value,
          capacity: this.form.get('capacity').value,
          affectDays: this.form.get('affectDays').value,
          id: this.editItem.ID,
          workStation: this.editItem.WorkSite
        }
      }
      this.rest.apiEditLineStandardCapacity(requestEdit).pipe(
        tap(res => {
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            throw (res.ErrorMsg)
          }
          this.rest.successMessage('修改成功');
          this.modalService.dismissAll();
          this.spinnerService.hide();
        }),
        catchError((res) => {
          this.rest.errorWithErrorMsg(res);
          this.spinnerService.hide();
          return of()
        }),
        switchMap(() => {
          return this.getLineProdCapacity()
        })
      ).subscribe();
    }

  }

  cancel() {
    this.modalService.dismissAll();
    this.itemSelected = null;
  }

  onDelete(item: LineProdCapacityResponseResult) {
    this.modalService.open(this.confirmDelete, { size: 'lg' })
    this.confirmMessage = `是否要刪除${item.CreateUser}建立的${this.getLineName(item.LineCode)}`;
    this.itemSelected = item;
  }
  deleteItem() {
    const request: DelLineStandardCapacityRequest = {
      Account: this.userAccount,
      standardCapacity: {
        id: this.itemSelected.ID
      }
    }
    this.rest.apiDelLineStandardCapacity(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.rest.successMessage('刪除成功');
        this.modalService.dismissAll();
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }),
      switchMap(() => {
        return this.getLineProdCapacity()
      })
    ).subscribe();
  }
}

