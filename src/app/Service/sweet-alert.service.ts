import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }
  alertSuccess(options: SweetAlertOptions)
  {
    return Swal.fire({
      ...options,
      title: 'Success',
      icon: 'success',
      timer:2000,
      showConfirmButton:false
    });
  }
  alertFail(options: SweetAlertOptions){
    return Swal.fire({
      ...options,
      title: 'Fail',
      icon: 'error',
      timer:2000,
      showConfirmButton:false
    });

  }

  alert(options: SweetAlertOptions) {
    return Swal.fire(options);
  }
  confirm(options: SweetAlertOptions) {
    return Swal.fire({
      ...options,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '確定',
      cancelButtonText: '取消'
    });
  }
}
