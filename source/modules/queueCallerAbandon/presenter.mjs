/* macro: logger */
import logger from '../../logger.mjs';
let log = logger.getInstance("QueueCallerAbandonPresenter");
/* macro-end: logger */

import PresenterBase from '../../server/presenterBase.mjs';


//class
export default class QueueCallerAbandonPresenter extends PresenterBase
{
    constructor(module)
    {
        super(module);
        //this.queues = []
    }

    async aInit(service,session)
    {
        await super.aInit(service,session);
        //this.queues = await this.service.aGetInWhatQueueIam(this.session.context.extension);

        //this.onServiceAdded = (QueueCallerAbandon) => {
        //    if(this.queues.find( x => x.extension == QueueCallerAbandon.Queue) )
       //     {
        //        this.sendEvent({type: "add", QueueCallerAbandon: QueueCallerAbandon });
        //    }
        //};
        this.onUpdate = async () => {
            this.sendEvent({type: "update", value: await this.service.aGetInQueue(this.session.context.inQueue)  });
        };


        this.service.handler.on("update", this.onUpdate );
        //this.service.handler.on("remove", this.onServiceRemoved )
    }

    async aSendHello()
    {
        // sync
        return await this.service.aGetInQueue(this.session.context.inQueue);
    }

    async aReceiveHello(hello)
    {
        log.debug(`aReceiveHello`,`id: ${this.session.id}, hello: ${hello}`);
    }

    // required
    async aReceiveEvent(event)
    {
        if(event.type == "originate")
        {
            await this.service.aOriginate(this.session.context.extension,event.CallerIDNum);
        }
    }

    async aCleanup()
    {
        await super.aCleanup();

        this.service.handler.removeListener("update", this.onUpdate );
        //this.service.handler.removeListener("add", this.onServiceAdded )
        //this.service.handler.removeListener("remove", this.onServiceRemoved )
    }
}