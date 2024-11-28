import { Directive, ViewContainerRef } from '@angular/core';
/**動態元件產生埠
 * @export DynamicComponentHostDirective
 * @class DynamicComponentHostDirective
 */
@Directive({
  selector: '[appDynamicComponentHost]'
})
export class DynamicComponentHostDirective {
  public viewContainerRef = this._viewContainerRef;
  constructor(private _viewContainerRef: ViewContainerRef) {

  }
}
