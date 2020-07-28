/* macro: logger */
import logger from '../../logger.mjs';
let log = logger.getInstance("DefaultPresenter");
/* macro-end: logger */

import PresenterBase from '../../server/presenterBase.mjs';

//class
export default class DefaultPresenter extends PresenterBase
{
    constructor(module)
    {
        super(module);
    }

    async aInit(service,session)
    {
        await super.aInit(service,session);
        /* ToDelete */
        //session.addPresenter("chat");
    }

    async aSendHello()
    {
        log.debug(`aSendHello`,`id: ${this.session.id}`);
        return "hello default";
    }

    async aReceiveHello(hello)
    {
        this.session.addPresenter(hello);
        log.debug(`aReceiveHello`,`id: ${this.session.id}, hello: ${hello}`);
    }

    // required
    async aReceiveEvent(event)
    {
        
    }

    async aCleanup()
    {
        await super.aCleanup();
    }
}