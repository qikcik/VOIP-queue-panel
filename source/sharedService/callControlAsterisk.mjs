/* macro: logger */
import logger from '../logger.mjs';
let log = logger.getInstance("CallControlAsteriskSharedService");
/* macro-end: logger */

import CallControl from './callControl.mjs';
import {  EventEmitter } from 'events';

import AsteriskAmi from '../dependence/asteriskAmi.mjs';

//class
export default class CallControlAsteriskSharedService extends CallControl
{
    constructor()
    {
        super(); 

        this.handler = new EventEmitter();

        this.channels = [];
        // track channels
        AsteriskAmi.eventHandler.on( "Newchannel" , async (event) => {
            if(event.Channel.indexOf('-')) event.Channel = event.Channel.substring(0,event.Channel.indexOf('-'));

            let channel = this.channels.find( x => x.Channel == event.Channel ) 
            if( channel )
            {
                channel.CallerIDNum = event.CallerIDNum;
                channel.ConnectedLineNum = event.ConnectedLineNum;
                return;
            }   
            this.channels.push( {
                CallerIDNum: event.CallerIDNum,
                ConnectedLineNum: event.ConnectedLineNum,
                Channel: event.Channel
            }); 

            console.log(this.channels);
            this.handler.emit("update");
        })

        
        AsteriskAmi.eventHandler.on( "NewCallerid" , async (event) => {
            if(event.Channel.indexOf('-')) event.Channel = event.Channel.substring(0,event.Channel.indexOf('-'));


            let channel = this.channels.find( x => x.Channel == event.Channel ) 
            if( channel )
            {
                channel.CallerIDNum = event.CallerIDNum;
            } 
            console.log(this.channels);
            this.handler.emit("update");
        })

        AsteriskAmi.eventHandler.on( "NewConnectedLine" , async (event) => {
            if(event.Channel.indexOf('-')) event.Channel = event.Channel.substring(0,event.Channel.indexOf('-'));

            let channel = this.channels.find( x => x.Channel == event.Channel ) 
            if( channel )
            {
                channel.ConnectedLineNum = event.ConnectedLineNum;
            }    
            console.log(this.channels);
            this.handler.emit("update");
        })


        AsteriskAmi.eventHandler.on( "Hangup" , async (event) => {
            if(event.Channel.indexOf('-')) event.Channel = event.Channel.substring(0,event.Channel.indexOf('-'));

            
            this.channels = this.channels.filter( x => x.Channel != event.Channel  );
            console.log(this.channels);
            this.handler.emit("update");
        })

    }

    async aIsBusy(CallerIdNum) 
    {
        if(this.channels.find( x => x.CallerIdNum == CallerIdNum ) )
            return true;

        if(this.channels.find( x => x.ConnectedLineNum == CallerIdNum ) )
            return true;

        return false;

    }

    async aOriginate(local,remote)
    {
        AsteriskAmi.action( {
            Action: `Originate`,
            Channel: `PJSIP/${local}`,
            Exten: remote,
            Context: "from-internal" ,
            Async: `yes` ,
            CallerID: remote
        });

        this.channels.push( {
            CallerIDNum: local,
            ConnectedLineNum: remote,
            Channel: `PJSIP/${local}`
        }); 

        this.handler.emit("update");
    }

}