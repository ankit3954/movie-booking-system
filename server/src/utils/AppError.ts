export class AppError extends Error{
    public statusCode : number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500, isOperational: boolean = true){
        super(message)
        this.statusCode = statusCode;
        this.isOperational = isOperational;

         // Set the prototype explicitly
        Object.setPrototypeOf(this, new.target.prototype);

        // Capture stack trace (optional)
        Error.captureStackTrace(this);
    }
}