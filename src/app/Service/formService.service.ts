import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  constructor() { }
  /**
   *檢查欄位是否錯誤
   *
   * @param {FormGroup} formGroupName
   * @param {string} formControlName
   * @return {*}  {boolean}
   * @memberof FormServiceService
   */
  isControlError(formGroupName: FormGroup, formControlName: string): boolean {
    return (!formGroupName.get(formControlName).valid && formGroupName.get(formControlName).dirty)
  }
  /**
   *將表單所有欄位加上dirty
   *
   * @param {FormGroup} formGroupName
   * @memberof FormServiceService
   */
  errorOccur(formGroupName: FormGroup) {
    const keys = Object.keys(formGroupName.controls);
    keys.forEach((i) => {
      formGroupName.get(i).markAsDirty();
    });
    for (const aa of keys) {
      if (!formGroupName.get(aa).valid) {
        const target = document.querySelector(`[formControlName="${aa}"]`)
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break
      }
    }
  }
  /**
   *取得欄位的錯誤類型
   *
   * @param {FormGroup} formGroupName
   * @param {string} formControlName
   * @param {string} errorName
   * @return {*} 
   * @memberof FormServiceService
   */
  getErrorType(formGroupName: FormGroup, formControlName: string, errorName: string): boolean {
    return formGroupName.get(formControlName)?.errors[errorName]
  }
}
