/* macro: logger */
import logger from '/logger.mjs';
let log = logger.getInstance("QueueCallerAbandonView");
/* macro-end: logger */

import ViewBase from "/viewBase.mjs";

//class
const name = "queuecallerabandon-view";
//class
export class QueueCallerAbandonView extends ViewBase 
{
    constructor()
    {
        super();
        this.QueueCallerAbandon = [];
    }

    // required
    async aInit(module,connection)
    {
        await super.aInit(module,connection,`/modules/${module}/client/view.html`);
        this.dataset.name = "nieodebrane połączenia";

    }

    // required
    async aHello(hello)
    {
        this.QueueCallerAbandon = hello;
        await this.aUpdate();
        //hello.forEach(element => {
        //    this._query("#my-queues").innerHTML += `${element.queue_name}, `
        //});
        //return "";//window.prompt("module");
    }

    async aReceiveEvent(event)
    {
        log.debug(`aReceiveEvent`,event);


        if(event.type == "update")
        {
            this.QueueCallerAbandon = event.value;
            await this.aUpdate();
        }
        //if(event.type == "add")
        //{
        //    this._query("#content").innerHTML += `<div id="element-${event.QueueCallerAbandon.CallerIDNum}" class="element"> ${event.QueueCallerAbandon.CallerIDNum} <button id="btn-${event.QueueCallerAbandon.CallerIDNum}"> Odzwoń </button> </div>`;
        //    this._query(`#btn-${event.QueueCallerAbandon.CallerIDNum}`).addEventListener("click", () => {            
        //        this.sendEvent({
        //        type: "orginate",
        //        CallerIDNum: event.QueueCallerAbandon.CallerIDNum,
        //        }) 
        //    });
        //}

        //if(event.type == "remove")
        //{
        //    this._query(`#element-${event.CallerIDNum}`).remove();
        //}
    }

    async aUpdate()
    {
        this._query("#content").innerHTML = "";
        this.QueueCallerAbandon.forEach( element => {
            let elementString = 
            `<div class="callerAbandom">
                <div class="header"> 
                    <div> <span class="idnum">${element.CallerIDNum}</span> </div>
            `
            if(!element.busy)
                elementString += `<button id="btn-${element.CallerIDNum}" > Odzwoń </button>`;

            elementString += 
            `
                </div>
                <div class="log">
            `;

            element.history.forEach( (row) => {
                elementString += 
                `
                    <div>
                        <b>${this.timeConverter(row.Timestamp)}:</b> ${row.QueueName} (${row.HoldTime}s.)
                    </div>
                `;
            })


            elementString += 
            `
                </div>
            </div>
            `;

            this._query("#content").innerHTML += elementString;

            if(!element.busy)
            {
                this._query(`#btn-${element.CallerIDNum}`).addEventListener("click", () => {            
                    this.sendEvent({
                    type: "originate",
                    CallerIDNum: element.CallerIDNum,
                    }) 
                });
            }
            
        })
    }

    timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var year = a.getFullYear();
        var month = a.getMonth();
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = hour + ':' + min + ':' + sec + ' ';
        return time;
      }

    // required
    async aCleanup()
    {
        await super.aCleanup(connection);
    }
}

// export and register
export default name;
customElements.define(name,QueueCallerAbandonView);