export interface ProductionStateListDataRequest {
    Account: string;
    MoldTrackingState?       :string;
    MoldTrackInOutDate?      :string;
    AssemblingTrackingState? :string;
    AssemblingTrackInOutDate?:string;
    PouringTrackingState?    :string;
    PouringTrackInOutDate?   :string;
}
