/* macro: logger */
import logger from './logger.mjs';
let log = logger.getInstance("Connection");
/* macro-end: logger */

// class
export default class Connection
{
    constructor()
    {
        // corresponder
        this.correspondents = [];

        // initialize socket.io
        this.socket = io.connect( window.location.host );

        this.socket.on( 'connect', () => {
            this.id = this.socket.id;
            log.info("connected",this.socket.id);
        });
        this.socket.on('reconnecting', () => {
            location.reload();
        });


        // module
        this.socket.on("module-init", async (msg) => {
            log.info(`module-init`,JSON.stringify(msg));
            const coresspondentName = (await import(`/modules/${msg.module}/client/correspondent.mjs`)).default;


            //const coresspondent = new coresspondentClass(msg.module);
            console.log(coresspondentName);
            const coresspondent = document.createElement(coresspondentName);
            console.log(coresspondent);
            this.correspondents.push(coresspondent);
            await coresspondent.aInit(msg.module,this);

            coresspondent.setAttribute("slot", "view");
            document.getElementsByTagName("main-view")[0].appendChild(coresspondent);
            document.getElementsByTagName("main-view")[0].update();

            const hello_msg = await coresspondent.aHello(msg.hello);
            this.socket.emit("module-hello",{module: msg.module, hello: hello_msg });
            log.info("receive and send hello module",msg.module);
        });

        this.socket.on("module-event", (msg) =>
        {
            log.info(`module-event`,JSON.stringify(msg));
            const correspondent = this.correspondents.find( c => c.module == msg.module);
            correspondent.aReceiveEvent(msg.event);
        })


    }

    sendEvent(correspondent,event)
    {
        this.socket.emit("module-event",{ module: correspondent.module, event: event});
    }
}