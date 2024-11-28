export class PurchaseHR{
  HRCode:string="";
  HRName:string="";
  PurchaseMonth:string="";
  UnitPrice:number=0;
  TotalQuantity:number=0;
  TotalPrice:number=0
  PurchaseList:Array<Purchase>=new Array<Purchase>();
  SupplierList:Array<Supplier>=new Array<Supplier>();
}
export class Supplier{
  SupplierName:string="";
  SupplierCode:string="";
  TotalQuantity:number=0
  TotalPrice:number=0
}
export class Purchase{
  ItemCode:string="";
  ItemName:string="";
  PurchaseDate:string="";
  SupplierCode:string="";
  SupplierName:string="";
  Quantity:number=0
  UnitPrice:number=0
  TotalPrice:number=0
}
