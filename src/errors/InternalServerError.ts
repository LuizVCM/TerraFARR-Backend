import { AppError } from "./AppError";
export class InternalServerError extends AppError {
    constructor(message = 'Erro interno do servidor') {
        super(message, 500)
    }
}