import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router  } from '@angular/router';
import { Observable } from 'rxjs';
import { SweetAlertService  } from 'src/app/Service/sweet-alert.service'
import { SessionStorageService } from 'ngx-webstorage';
@Injectable({
  providedIn: 'root'
})
export class ChildrenauthGuard implements CanActivateChild {
  constructor(private router: Router,
    private session: SessionStorageService,
    private sweetAlertService: SweetAlertService
    ) {}
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    //throw new Error('Method not implemented.');

    let childpath=childRoute.url[0].path;
    let PermissionPage:Array<any>=this.session.retrieve('PermissionPage')
    if (PermissionPage==null) {
      this.sweetAlertService.alertFail({
        text:'請先登入!!'
      })
        this.router.navigate(['/login'])
    }else if(PermissionPage.indexOf(childpath)<0 && childpath!='Index'){
      this.sweetAlertService.alertFail({
        text:'無該頁面無權限!!'
      })
      this.router.navigate(['/login_success/Index'])
    }

    return true;
  }


}
