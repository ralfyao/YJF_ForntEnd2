import { BasicAPIResponse } from "./basicAPIResponse";
import { PostMemberListResponseAccountManagements } from "./postMemberListResponseAccountManagements";

export interface PostMemberListResponse extends BasicAPIResponse {
    TotalCount: string;
    RepAccountManagements: Array<PostMemberListResponseAccountManagements>;
}
