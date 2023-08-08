import { ChangeStreamOptions, OperationTime, ResumeToken } from "mongodb";

export class StartProduce implements ChangeStreamOptions{
    readonly fullDocument?: 'updateLookup'| 'whenAvailable'| 'required';
    readonly fullDocumentBeforeChange?: 'whenAvailable'| 'required'| 'off';
    readonly maxAwaitTimeMS?: number;
    readonly resumeAfter?: ResumeToken;
    readonly startAfter?: ResumeToken;
    readonly startAtOperationTime?: OperationTime;
    readonly batchSize?: number;
    readonly showExpandedEvents?: boolean = false;

    constructor(startProduce: Partial<StartProduce>) {
        Object.assign(this, startProduce)
    }
}