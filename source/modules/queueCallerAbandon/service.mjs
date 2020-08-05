/* macro: logger */
import logger from '../../logger.mjs';
let log = logger.getInstance("QueueCallerAbandonService");
/* macro-end: logger */

import serviceBase from '../../server/serviceBase.mjs';
//import ucmAmi from '../../dependence/ucmApi.mjs'


//import AsteriskAmi from '../../dependence/asteriskAmi.mjs';


import Shared from '../../sharedService/shared.mjs'; 


//class
export default class QueueCallerAbandonService extends serviceBase
{
    constructor(module)
    {
        super(module);
        //this.callersAbandoned = [];

    }

    async aInit()
    {
        await super.aInit();
        this.db = (await import('better-sqlite3')).default('./databases/queueCallerAbandon.db');

        const stmt = this.db.prepare(
            `CREATE TABLE IF NOT EXISTS queueCallerAbandon (
            Id INTEGER PRIMARY KEY,
            Queue TEXT NOT NULL,
            CallerIDNum TEXT NOT NULL ,
            Timestamp INTEGER  NOT NULL,
            HoldTime TEXT NOT NULL );`);
        const info = stmt.run();


        log.debug("queueCallerAbandon",info.changes); // => 1


        Shared.queue.handler.on("new", async (obj) => {
            await this.aAddToDB(obj);
        });

        Shared.queue.handler.on("BridgeEnter", async (obj) => {
            await this.aRemoveFromDB(obj);
        });

        
        Shared.callControl.handler.on("update", async () => {
            this.handler.emit("update");
        });

        /*AsteriskAmi.eventHandler.on( "QueueCallerAbandon" , async (event) => {
            log.debug("QueueCallerAbandon", JSON.stringify( event));
            
            this.callersAbandoned.push( event );
            this.handler.emit("add",this._mapToPublice(event));
            
        })

        AsteriskAmi.eventHandler.on( "BridgeEnter" , async (event) => {
            log.debug("BridgeEnter", JSON.stringify(event.CallerIDNum));

            if(this.callersAbandoned.find( e => e.CallerIDNum == event.CallerIDNum ))
                this.handler.emit("remove",event.CallerIDNum);

            this.callersAbandoned = this.callersAbandoned.filter( e => e.CallerIDNum != event.CallerIDNum );
        })*/
    }

    _mapToPublice(e)
    {
        return { 
            CallerIDNum:e.CallerIDNum,
            Queue: e.Queue,
            HoldTime: e.HoldTime
        }; 
    }

    async aOriginate(local,remote)
    {
        await Shared.callControl.aOriginate(local,remote);
    }

    async aGetInWhatQueueIam(extension)
    {
        /*let queues = []
        let response  = await ucmAmi.aRequest( { "action":"listQueue" } );
        response.response.queue.forEach(element => {
            if(element.members.includes(extension))
                queues.push( {extension: element.extension, queue_name: element.queue_name} );
        });

        return queues;*/
    }


    async aCleanup()
    {
        await super.aCleanup();
    }

    async aAddToDB(obj)
    {
        const stmt = this.db.prepare(
            `INSERT INTO queueCallerAbandon ( Queue, CallerIDNum, Timestamp, HoldTime ) VALUES (?,?,?,?);`);
        const info = stmt.run(obj.Queue,obj.CallerIDNum,obj.Timestamp,obj.HoldTime);
        log.debug("aAddToDB",info.changes); // => 1

        this.handler.emit("update");
    }

    async aRemoveFromDB(obj)
    {
        const stmt = this.db.prepare(
            `DELETE FROM queueCallerAbandon WHERE CallerIDNum = ?`);
        const info = stmt.run(obj);
        log.debug("aAddToDB",info.changes); // => 1

        this.handler.emit("update");
    }

    async aGetInQueue(queues) // { CallerIDNum , History [ { Timestamp, Queue, HoldTime} ] }
    {
        let res = [];
        queues.forEach( (queue)=> {
            const stmt = this.db.prepare(
                `SELECT Queue, CallerIDNum, Timestamp, HoldTime FROM queueCallerAbandon WHERE Queue IN (?)`);
            res = res.concat(stmt.all(queue));
        });

        let res2 = [];
        for (const e of res) 
        {
            let row = res2.find( x => x.CallerIDNum == e.CallerIDNum );
            console.log(row);
            if(row == undefined) 
            {
                row = { CallerIDNum: e.CallerIDNum, busy: await Shared.callControl.aIsBusy(e.CallerIDNum) , history: [] }; 
                res2.push( row );
                console.log(res2);
            }
            let QueueName = (await Shared.account.aGetQueueName(e.Queue)).QueueName;

            row.history.push( {Timestamp: e.Timestamp, Queue:e.Queue, QueueName: QueueName , HoldTime: e.HoldTime} );
        }

        return res2;
    }
}