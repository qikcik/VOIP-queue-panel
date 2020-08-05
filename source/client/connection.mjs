/* macro: logger */
import logger from './logger.mjs';
let log = logger.getInstance("Connection");
/* macro-end: logger */

// class
export default class Connection
{
    constructor()
    {
        // view
        this.views = [];

        // initialize socket.io
        this.socket = io.connect( window.location.host );

        this.socket.on( 'connect', () => {
            this.id = this.socket.id;
            log.info("connected",this.socket.id);
        });
        this.socket.on('reconnecting', () => {
            window.setTimeout( ()=> location.reload(), 3000);
        });


        // module
        this.socket.on("module-init", async (msg) => {
            log.info(`module-init`,JSON.stringify(msg));
            const viewName = (await import(`/modules/${msg.module}/client/view.mjs`)).default;

            console.log(viewName);
            const view = document.createElement(viewName);
            console.log(view);
            this.views.push(view);
            await view.aInit(msg.module,this);

            view.setAttribute("slot", "view");
            document.getElementsByTagName("main-view")[0].appendChild(view);
            document.getElementsByTagName("main-view")[0].update();

            const hello_msg = await view.aHello(msg.hello);
            this.socket.emit("module-hello",{module: msg.module, hello: hello_msg });
            log.info("receive and send hello module",msg.module);
        });

        this.socket.on("module-event", (msg) =>
        {
            log.info(`module-event`,JSON.stringify(msg));
            const view = this.views.find( c => c.module == msg.module);
            view.aReceiveEvent(msg.event);
        })


    }

    sendEvent(view,event)
    {
        this.socket.emit("module-event",{ module: view.module, event: event});
    }
}