import { Type } from "class-transformer";
import { Communication } from "./Communication";

/**
 * A class representing the data of an operation request.
 *
 * @export
 * @class OperationRequestData
 * @typedef {OperationRequestData}
 */
export class OperationRequestData{
    private operationName: string;
    @Type(() => Communication)
    private communication: Communication;
    private operationArguments: object;

    constructor(operationName: string, communication: Communication, operationArguments: object){
        this.operationName = operationName;
        this.communication = communication;
        this.operationArguments = operationArguments;
    }

    /**
     * Retrieves the name of the operation.
     *
     * @public
     * @returns {string} The name of the operation to be performed.
     */
    public getOperationName(): string{
        return this.operationName;
    }

    /**
     * Retrieves the communication instance associated with the operation.
     *
     * @public
     * @returns {Communication} The communication instance associated with the operation.
     */
    public getCommunication(): Communication{
        return this.communication;
    }

    /**
     * Retrieves the arguments of the operation.
     *
     * @public
     * @returns {object} The arguments of the operation.
     */
    public getOperationArguments(): object{
        return this.operationArguments;
    }
}