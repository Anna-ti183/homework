export class BadRequestException extends Error {
    constructor(
        public errorsMessages: { field: string; message: string }[],
    ) {
        super('Bad Request');
    }
}