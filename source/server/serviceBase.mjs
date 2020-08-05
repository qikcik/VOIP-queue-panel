/* macro: logger */
import logger from '../logger.mjs';
let log = logger.getInstance("ServiceBase");
/* macro-end: logger */
import {  EventEmitter } from 'events';

export default class serviceBase
{
    constructor(module)
    {
        this.module = module;
        this.handler = new EventEmitter();
    }

    async aInit()
    {
        log.debug(`aInit service ${this.module}`);
    }

    async aCleanup()
    {
        log.debug(`aCleanup service ${this.module}`);
    }
}