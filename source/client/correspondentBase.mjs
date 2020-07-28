/* macro: logger */
import logger from './logger.mjs';
let log = logger.getInstance("CorrespondentBase");
/* macro-end: logger */

//class
export default class CorresponderBase extends HTMLElement 
{
    constructor()
    {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
    }

    // required
    async aInit(module,connection,html)
    {
        this.module = module;
        this.connection = connection;

        if(html)
        {
            let response = await fetch(html);
            response = await response.text();
            this.shadowRoot.innerHTML = response;
        }

        log.debug(`aInit corresponder ${this.module}`);

    }

    // required
    async aHello(hello)
    {
        return "hello";
    }

    // required
    async aReceiveEvent(event)
    {
        log.debug(`aReceiveEvent in ${this.session.id}`,event);
    }


    // required
    async aCleanup()
    {
        log.debug(`aCleanup corresponder ${this.module}`);
    }

    // don't touch in inherited cladd , only use
    sendEvent(event)
    {
        this.connection.sendEvent(this,event);
    }
}