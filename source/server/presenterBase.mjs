/* macro: logger */
import logger from '../logger.mjs';
let log = logger.getInstance("PresenterBase");
/* macro-end: logger */


export default class PresenterBase
{
    constructor(module)
    {
        this.module = module;
    }

    // required
    async aInit(service,session)
    {
        this.service = service;
        this.session = session;

        log.debug(`aInit presenter ${this.module} in ${this.session.id}`);
        

    }

    // required
    async aSendHello()
    {
        return "hello";
    }

    // required
    async aReceiveHello(hello)
    {

    }

    // required
    async aReceiveEvent(event)
    {
        log.debug(`aReceiveEvent in ${this.session.id}`,event);
    }

    // required
    async aCleanup()
    {
        log.debug(`aCleanup presenter ${this.module} in ${this.session.id}`);
        this.service = null;
        this.session = null;
    }

    // don't touch in inherited cladd , only use
    sendEvent(event)
    {
        this.session.sendEvent(this,event);
    }
}