/* macro: logger */
import logger from '../logger.mjs';
let log = logger.getInstance("AsteriskAmi");
/* macro-end: logger */


import AmiClient from 'asterisk-ami-client';
import Events from 'events';

let eventHandler = new Events.EventEmitter();
let client = new AmiClient();

async function aConnect(username,secret,host,port)
{
    log.debug(`start`);
    await
    (
        client.connect(username,secret, {host: host, port: port})
        .then(amiConnection => {
            client
                .on('connect', () => log.debug(`connected`))
                .on('event', event => {/*console.log(event);*/ eventHandler.emit(event.Event, event); })
                .on('response', response => log.debug(`response`,response))
                .on('disconnect', () => log.debug(`disconnected`))
                .on('reconnection', () => log.debug(`reconnected`))
                .on('internalError', error => log.error("error",error));
        })
        .catch(error => console.log(error))
    );
}


// export everything
// aConnect (username,secret,host,port) is function that was used to connect to ami
// eventHandler will forwarding event with that event name and as argument all event
export default  {
    aConnect: aConnect,
    eventHandler: eventHandler,
    action: (a) => client.action(a)
}