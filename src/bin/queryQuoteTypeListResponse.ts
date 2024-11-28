import { BasicAPIResponse } from "./basicAPIResponse";
import { QueryQuoteTypeListResponseQuoteTypeReps } from "./queryQuoteTypeListResponseQuoteTypeReps";

export interface QueryQuoteTypeListResponse extends BasicAPIResponse {
    QuoteTypeReps: Array<QueryQuoteTypeListResponseQuoteTypeReps>;
    TotalCount: string;
}
