/* macro: logger */
import logger from '/logger.mjs';
let log = logger.getInstance("ChatCorresponder");
/* macro-end: logger */

import CorrespondentBase from "/correspondentBase.mjs";

//import View from "/modules/chat/client/view.mjs";

//class
const name = "chat-view";

class ChatCorrespondent extends CorrespondentBase 
{
    constructor()
    {
        super();
    }

    // required
    async aInit(module,connection)
    {

        await super.aInit(module,connection,"/modules/chat/client/view.html");
        this.dataset.name = "chat";

        console.log(this.module);

    }

    // required
    async aHello(hello)
    {
        this.shadowRoot.querySelector("#send").addEventListener("click", () => { 
            this.sendEvent({
                type: "new",
                msg: this.shadowRoot.querySelector("#msg").value 
            }) 
        });

        return window.prompt("username");
    }

    async aReceiveEvent(event)
    {
        log.debug(`aReceiveEvent`,event);

        if(event.type == "update")
            event.msgs.forEach(e => {
                this.shadowRoot.querySelector("#msgs").innerHTML += `${e.who}:  ${e.msg} <br/>`;
        });
    }
    // required
    async aCleanup()
    {
        await super.aCleanup(connection);
    }
}


// export and register
export default name;
customElements.define(name,ChatCorrespondent);