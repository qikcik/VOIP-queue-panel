/* macro: logger */
import logger from '../../logger.mjs';
let log = logger.getInstance("ChatService");
/* macro-end: logger */

import PresenterBase from '../../server/presenterBase.mjs';

//class
export default class ChatPresenter extends PresenterBase
{
    constructor(module)
    {
        super(module);
    }

    async aInit(service,session)
    {
        await super.aInit(service,session);

        this.who = "undefined";
        this.onWrite = (msg) => this.sendEvent({type: "update", msgs: [msg]})
        this.service.handler.on("writed", this.onWrite )
    }

    async aSendHello()
    {
        return "";
    }

    async aReceiveHello(hello)
    {
        this.who = hello;
        this.sendEvent({type: "update", msgs: this.service.messages });
    }

    // required
    async aReceiveEvent(event)
    {
        log.debug(`aReceiveEvent in ${this.session.id}`,event);

        if(event.type == "new")
            this.service.write( {who: this.who, msg: event.msg} );
    }

    async aCleanup()
    {
        this.service.handler.removeListener("writed", this.onWrite);
        await super.aCleanup();
    }
}