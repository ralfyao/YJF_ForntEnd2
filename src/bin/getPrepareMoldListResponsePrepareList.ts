export interface GetPrepareMoldListResponsePrepareList {
    SchedulingDate: string;
    ItemCode: string;
    PartDesc: string;
    MaterialType: string;
    ProductWeight: number;
    CustomerName: string;
    MoldItemCode: string;
    MoldQty: number;
    MoldingWIPProcessCode: string;
    MoldingWIPProcessName: string;
    MoldingLineCode: string;
    MoldingLineName: string;
    CoreItemCode: string;
    CoreQty: number;
    CoreWIPProcessCode: string;
    CoreWIPProcessName: string;
    CoreLineCode: string;
    CoreLineName: string;
    PatternLength: number;
    PatternWidth: number;
    PatternUHeight: number;
    PatternDHeight: number;
    OuterPatternRemark: string;
    SandCoreRemark: string;
    CoreHouse: string;
    MoldHouse: string;

}
