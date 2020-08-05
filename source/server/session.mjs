/* macro: logger */
import logger from '../logger.mjs';
let log = logger.getInstance("Session");
/* macro-end: logger */

//class
export default class Session
{
    constructor(socket,webServer)
    {
        this.socket = socket;
        this.id = socket.id;
        this.webServer = webServer;

        this.context = {}

        this.presenters = [];

        this.socket.on("module-hello", (msg) =>
        {
            log.info(`module-hello`,JSON.stringify(msg));
            const presenter = this.presenters.find( p => p.module == msg.module);
            presenter.aReceiveHello(msg.hello);
        })

        this.socket.on("module-event", (msg) =>
        {
            log.info(`module-event`,JSON.stringify(msg));
            const presenter = this.presenters.find( p => p.module == msg.module);
            presenter.aReceiveEvent(msg.event);
        })

    }

    async aInit(module)
    {
        await this.addPresenter(module);
    }

    async aCleanup()
    {
        log.info(`aCleanup`,this.id);
        this.presenters.forEach( p => p.aCleanup() );
        this.presenters = []
    }

    async addPresenter(module)
    {
        const presenterClass = await this.webServer.aGetModulePresenterClass(module);
        const presenter = new presenterClass(module);
        this.presenters.push(presenter);

        await presenter.aInit(this.webServer.getModuleService(module),this);

        let hello = await presenter.aSendHello();
        this.socket.emit("module-init",{ module: module, hello: hello});
    }

    async _aGetPresenterClass(module)
    {
        const presenterClass = (await import(process.cwd()+`/source/modules/${module}/presenter.mjs`)).default;
        return presenterClass;
    }

    sendEvent(presenter,event)
    {
        log.debug(`send Event in module ${presenter.module} , ${this.socket.id}`,event);
        this.socket.emit("module-event",{ module: presenter.module, event: event});
    }
}