/* macro: logger */
import logger from '../../logger.mjs';
let log = logger.getInstance("AuthorizationPresenter");
/* macro-end: logger */

import PresenterBase from '../../server/presenterBase.mjs';

//class
export default class AuthorizationPresenter extends PresenterBase
{
    constructor(module)
    {
        super(module);

        this.logged = false;
    }

    async aInit(service,session)
    {
        await super.aInit(service,session);

        this.session.context.fullname = undefined;
        this.session.context.extension = undefined;
        /* ToDelete */
        //session.addPresenter("chat");
    }

    async aSendHello()
    {
        log.debug(`aSendHello`,`id: ${this.session.id}`);

        return await this.service.aGetAllLogin();
    }

    async aReceiveHello(hello)
    {
        //this.session.addPresenter(hello);
        log.debug(`aReceiveHello`,`id: ${this.session.id}, hello: ${hello}`);
    }

    // required
    async aReceiveEvent(event)
    {
        if(event.type == "login" )
        {
            
            if( await this.service.aTryLogin(event.login,event.password)  )
            {
                if(!this.logged )
                {
                    this.logged = true;
                    let user = await this.service.aGetUser(event.login);
                    this.session.context.login = user.login;
                    this.session.context.fullname = user.fullname;
                    this.session.context.extension = user.extension;
                    this.session.context.inQueue = user.inQueue;
                    
                    this.sendEvent({type: "logged", login:user.login,extension:user.extension,fullname:user.fullname });

                    //extend
                    this.session.addPresenter("chat");
                    this.session.addPresenter("queueCallerAbandon");
                }
                else
                {
                    this.sendEvent({type: "error", error:"..."});
                }
            }
            else
            {
                this.sendEvent({type: "error", error:"nieprawidłowe dane"});
            }
        }
    }

    async aCleanup()
    {
        await super.aCleanup();
    }
}