export interface PostProcEstiProd{
  unpackOutDate:string;
  postProcEstiProdElem:Array<PostProcEstiProdElem>;
}

export interface PostProcEstiProdElem{
  PartNo:string;
  PartDesc:string;
  UnitWeight:number;
  Quantity:number;
  UnpackOutDate:string;
  WorkOrder:string;
}
