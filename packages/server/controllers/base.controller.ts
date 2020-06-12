
import express from 'express';

export abstract class BaseController {
    protected path: string;
    public router: express.Router;

    constructor(path: string) {
        this.path = path;
        this.router = express.Router();
    }

    protected abstract initilizeRoutes(): void
}