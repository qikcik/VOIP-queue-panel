/* macro: logger */
import logger from '/logger.mjs';
let log = logger.getInstance("AuthorizationView");
/* macro-end: logger */

import ViewBase from "/viewBase.mjs";

//class
const name = "authorization-view";
//class
export class AuthorizationView extends ViewBase 
{
    constructor()
    {
        super();
    }

    // required
    async aInit(module,connection)
    {
        await super.aInit(module,connection,`/modules/authorization/client/view.html`);
        this.dataset.name = "autoryzacja";


        this._query("#login-submit").addEventListener("click", () => { 
            this.sendEvent({
                type: "login",
                login: this._query("#login-login").value,
                password: this._query("#login-password").value
            }) 
        });
    }

    // required
    async aHello(hello)
    {
        hello.forEach(element => {
            this._query("#available-login").innerHTML += `<option>${element}</option>`;
        });
        return "";//window.prompt("module");
    }

    async aReceiveEvent(event)
    {
        log.debug(`aReceiveEvent`,event);

        if(event.type == "logged")
        {
            this._query("#login").style.display = "none";
            this._query("#logged").style.display = "block";
            this._query("#logged-who").innerHTML = `${event.login}(${event.extension})`

        }

        if(event.type == "error")
        {
            this._query("#error").innerHTML = event.error;
        }

    }


    // required
    async aCleanup()
    {
        await super.aCleanup(connection);
    }
}

// export and register
export default name;
customElements.define(name,AuthorizationView);