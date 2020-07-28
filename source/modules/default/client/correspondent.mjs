/* macro: logger */
import logger from '/logger.mjs';
let log = logger.getInstance("DefaultCorresponder");
/* macro-end: logger */

import CorrespondentBase from "/correspondentBase.mjs";

//class
const name = "default-view";
//class
export class DefaultCorrespondent extends CorrespondentBase 
{
    constructor()
    {
        super();
    }

    // required
    async aInit(module,connection)
    {
        await super.aInit(module,connection);
    }

    // required
    async aHello(hello)
    {
        return window.prompt("module");
    }


    // required
    async aCleanup()
    {
        await super.aCleanup(connection);
    }
}

// export and register
export default name;
customElements.define(name,DefaultCorrespondent);