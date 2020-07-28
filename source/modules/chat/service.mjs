/* macro: logger */
import logger from '../../logger.mjs';
let log = logger.getInstance("ChatService");
/* macro-end: logger */

import serviceBase from '../../server/serviceBase.mjs';
import {  EventEmitter } from 'events';

//class
export default class ChatService extends serviceBase
{
    constructor(module)
    {
        super(module);

        this.handler = new EventEmitter();
        this.messages = [];
    }

    write({who,msg})
    {
        this.messages.push({who: who, msg: msg});
        this.handler.emit("writed",{who: who, msg: msg})
    }

    async aInit()
    {
        await super.aInit();
    }

    async aCleanup()
    {
        await super.aCleanup();
    }
}