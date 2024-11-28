import { POstatus } from '../app/Model/production'
export interface FlaskListQueryRequest {
    Account: string;
    POStatus: POstatus;
    SearchText: string;
}
