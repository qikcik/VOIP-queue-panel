/* macro: logger */
import logger from '../logger.mjs';
let log = logger.getInstance("QueueAsteriskharedService");
/* macro-end: logger */

import QueueSharedService from './queue.mjs';
import {  EventEmitter } from 'events';

import AsteriskAmi from '../dependence/asteriskAmi.mjs';

//class
export default class QueueAsteriskharedService extends QueueSharedService
{
    constructor()
    {
        super(); 


        this.handler = new EventEmitter();
        this.channels = [];
        
        AsteriskAmi.eventHandler.on( "QueueCallerAbandon" , async (event) => {
            log.debug("QueueCallerAbandon", JSON.stringify( event));
            this.handler.emit("new", {
                CallerIDNum: event.CallerIDNum,
                Queue: event.Queue,
                Timestamp: Math.floor(Date.now()/1000),
                HoldTime: event.HoldTime,
            });            
        })

        AsteriskAmi.eventHandler.on( "BridgeEnter" , async (event) => {
            this.handler.emit("BridgeEnter",event.CallerIDNum);
        })
    }
}