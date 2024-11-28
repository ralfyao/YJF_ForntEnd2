import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { ProdutionService } from '../Service/ProdutionService';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SftLineListResponseLineCodeName } from 'src/bin/SftLineListResponseLineCodeName';
import { AddMoldRepairFormRequest } from 'src/bin/addMoldRepairFormRequest';
import { LoginSessionEnum } from '../Enum/session-enum.enum';
import { FormServiceService } from '../Service/formService.service';
import { Observable, of } from 'rxjs';
import { MoldIdListRequest } from 'src/bin/moldIdListRequest';

@Component({
  selector: 'app-mouldMaintainReqeust',
  templateUrl: './mouldMaintainReqeust.component.html',
  styleUrls: ['./mouldMaintainReqeust.component.css']
})
export class MouldMaintainReqeustComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  constructor(
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private production: ProdutionService,
    public fS: FormServiceService
  ) { }
  form: FormGroup = new FormGroup({
    patFlasType: new FormControl('1', [Validators.required]),
    lineCode: new FormControl('', [Validators.required]),
    mouldType: new FormControl('', [Validators.required]),
    patFlasNo: new FormControl('', [Validators.required]),
    workOrder: new FormControl('', [Validators.pattern(/^[A-Za-z0-9\-]{1,11}$/)]),
    description: new FormControl('', [Validators.required]),
    pics: new FormControl('')
  });
  lineList: Array<SftLineListResponseLineCodeName> = [];
  filteredOptions: Observable<string[]>;
  options: string[] = [];
  ngOnInit() {
    this.getLineList();
    const patFlasNoControl = this.form.get('patFlasNo');
    const modulTypeControl = this.form.get('mouldType');
    this.filteredOptions = patFlasNoControl.valueChanges.pipe(
      map((res) => {
        const request: MoldIdListRequest = {
          Account: this.session.retrieve(LoginSessionEnum.UserAccount),
          MoldId: res
        }
        return request
      }),
      switchMap((res) => {
        return this.production.apiMoldIdList(res)
      }),
      map(res => {
        return this.options = res.result.map((i) => i.moldId)
      })
    );
    this.form.get('patFlasType').valueChanges.pipe(
      tap(res => {
        if (res == 2) {
          patFlasNoControl.setValidators([Validators.required, Validators.pattern(/^[A-Za-z0-9\-]{1,20}$/)]);
          modulTypeControl.clearValidators();
          modulTypeControl.setValue('');
        }
        if (res == 1) {
          patFlasNoControl.setValidators([Validators.required, Validators.pattern(/^[0-9]{1,5}$/)]);
          modulTypeControl.setValidators([Validators.required]);
        }
        patFlasNoControl.updateValueAndValidity();
        modulTypeControl.updateValueAndValidity();
      })
    ).subscribe();
    this.form.get('patFlasType').setValue('1')
  }
  /**
   *獲得所有產線別
   *
   * @memberof MouldMaintainReqeustComponent
   */
  getLineList() {
    this.spinnerService.show();
    this.production.apiSftLineList().pipe(
      tap(res => {
        this.lineList = res.lineCodeNames;
      })
    ).subscribe().add(() => { this.spinnerService.hide(); });
  }
  /**
   *將檔案轉入Form中
   *
   * @param {*} event
   * @memberof MouldMaintainReqeustComponent
   */
  getFiles(event: any): void {
    const files = event.target.files;
    const control = this.form.get('pics');
    control.setValue(files);
  }
  /**
   *將表單的數值轉為form-data格式
   *
   * @return {*}  {FormData}
   * @memberof MouldMaintainReqeustComponent
   */
  setRequest(): FormData {
    const request: AddMoldRepairFormRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      type: this.form.get('mouldType').value,
      lineCode: this.form.get('lineCode').value,
      patFlasNo: this.form.get('patFlasNo').value,
      patFlasType: +this.form.get('patFlasType').value,
      description: this.form.get('description').value,
      status: 0,
      workOrder: this.form.get('workOrder').value ?? this.form.get('workOrder').value,
      pics: this.form.get('pics').value
    }
    const formData: FormData = new FormData();
    const keys = Object.keys(request);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] == 'pics') continue
      formData.append(keys[i], request[keys[i]]);
    }
    const fileList = this.form.get('pics').value as FileList;
    if (fileList) {
      const fileListLength = fileList.length;
      for (let i = 0; i < fileListLength; i++) {
        formData.append('pics', fileList.item(i));
      }
    }

    return formData
  }
  /**
   *送出表單
   *
   * @memberof MouldMaintainReqeustComponent
   */
  onDeliver() {
    if (!this.form.valid) {
      this.fS.errorOccur(this.form);
      return
    }
    const formData: FormData = this.setRequest();
    this.spinnerService.show();
    this.production.apiAddMoldRepairForm(formData).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.production.successMessage('報修成功');
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.production.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  /**
   *清除表單
   *
   * @memberof MouldMaintainReqeustComponent
   */
  onClear() {
    this.form.reset();
    this.form.get('lineCode').setValue('');
    this.form.get('mouldType').setValue('');
    this.fileInput.nativeElement.value = '';
  }
}
