import { BasicAPIResponse } from "./basicAPIResponse";

export interface FlaskHistory{
  ProdOrderHead			:string;
  ProdOrder				:string;
  ItemCode				:string;
  ItemDesc				:string;
  IsDisappearModel		:string;
  MoldTrackinTime			:string;
  MoldTrackoutTime		:string;
  MoldingTopInFlask		:string;
  MoldingTopOutFlask		:string;
  MoldingBottomInFlask	:string;
  MoldingBottomOutFlask	:string;
  AssemTrackinTime		:string;
  AssemTrackoutTime		:string;
  AssemTopInFlask			:string;
  AssemTopOutFlask		:string;
  AssemBottomInFlask		:string;
  AssemBottomOutFlask		:string;
  PouringTrackinTime		:string;
  PouringTrackoutTime		:string;
  PouringTopInFlask		:string;
  PouringTopOutFlask		:string;
  PouringBottomInFlask	:string;
  PouringBottomOutFlask	:string;
  UnBoxingTrackinTime		:string;
  UnBoxingTrackoutTime	:string;
  UnnelingTrackinTime		:string;
  UnnelingTrackoutTime	:string;
  RemoveFurTrackinTime	:string;
  RemoveFurTrackoutTime	:string;
  SprayTrackinTime		:string;
  SprayTrackoutTime		:string;
  TempTrackinTime			:string;
  TempTrackoutTime		:string;
  OutsourcingTrackinTime	:string;
  OutsourcingTrackoutTime	:string;
  IsDiffFlask:boolean;
}

export interface FlaskHistoryRep extends BasicAPIResponse {
  result:FlaskHistory[];
}
