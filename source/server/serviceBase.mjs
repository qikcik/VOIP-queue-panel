/* macro: logger */
import logger from '../logger.mjs';
let log = logger.getInstance("ServiceBase");
/* macro-end: logger */


export default class serviceBase
{
    constructor(module)
    {
        this.module = module;
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