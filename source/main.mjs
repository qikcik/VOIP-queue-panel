/* macro: logger */
import logger from './logger.mjs';
let log = logger.getInstance("main");
/* macro-end: logger */

import WebServer from './server/webServer.mjs';

async function startup()
{
    let webServer = new WebServer();
    await webServer.aInit(80);

    log.info("startup","startup procces end");
}

startup();