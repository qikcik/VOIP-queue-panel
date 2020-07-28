/* macro: logger */
import logger from '../logger.mjs';
let log = logger.getInstance("webServer");
/* macro-end: logger */


// import
import http from 'http';
import express from 'express';
import socketIo from 'socket.io';
import fs from 'fs';

import Session from './session.mjs';
import PresenterBase from './presenterBase.mjs';


// class
export default class WebServer
{
    constructor()
    {
        // init
        this.expressApp = express();
        this.webServer = http.createServer(this.expressApp);
        this.ioServer = socketIo.listen(this.webServer);

        this.sessions = [];

        // static route
        this.expressApp.use(express.static(process.cwd()+"/source/client"));

        // socket.io
        this.ioServer.on('connection',async (socket) => 
        {
            log.debug("session start connecting", "id: "+socket.id);

            const session = new Session(socket,this);
            this.sessions.push(session);

            await session.aInit("default");

            socket.on('disconnect',async () => 
            {
                log.debug("session start disconnecting", "id: "+socket.id);
                await session.aCleanup();
                this.sessions = this.sessions.filter( x => x.id != session.id );
            });
        })

        //modules
        this.services = [];
        
    }

    async aGetModulePresenterClass(module)
    {
        const presenterClass = (await import(process.cwd()+`/source/modules/${module}/presenter.mjs`)).default;
        return presenterClass;
    }


    getModuleService(module)
    {
        return this.services.find( s => s.module == module);
    }


    async aInit(port)
    {
        // modules install routes
        await fs.readdirSync(process.cwd()+"/source/modules").forEach( async (module) => {
            const serviceClass = (await import(process.cwd()+`/source/modules/${module}/service.mjs`)).default;
            const service = new serviceClass(module);

            this.services.push( service );
            await service.aInit(module);

            this.expressApp.use(`/modules/${module}/client`,express.static(process.cwd()+`/source/modules/${module}/client`));

            log.info(`installed service and seted static route for module ${module}`, `from: /source/modules/${module}/client  to: /modules/${module}/client`);
        });


        // start listenning
        await this.webServer.listen(port);
        log.info("aListen",`listen on port ${port}`);
    }

    async aCleanup()
    {
    
    }
}
