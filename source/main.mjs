/* macro: logger */
import logger from './logger.mjs';
let log = logger.getInstance("main");
/* macro-end: logger */

import WebServer from './server/webServer.mjs';

//import UcmApi from './dependence/ucmApi.mjs'


import AsteriskAmi from './dependence/asteriskAmi.mjs'

async function startup()
{
    //shared services
    //UcmApi.config = {
    //    url:"https://192.168.1.135:8089/api", // default value
    //    username:"cdrapi", // default value
    //    password:"cdrapi123", // default value
    //};
    //await UcmApi.aRequest({});
    //AsteriskAmi.aConnect("asteriskami","Haslo!23","192.168.1.135",7777);


    AsteriskAmi.aConnect("ami","1234","192.168.1.192",5038);


    let webServer = new WebServer();
    await webServer.aInit(80);

    log.info("startup","startup procces end");
}

startup();