import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class UtilityService{
  parseFloat(val:string, fixed:number = 2):string{
    return Number.parseFloat(val).toFixed(fixed);
  }
  DateStringFormat(date: string):string {
    if (!date) return date
    if (date.length < 8) return date

    return date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
  }
}
