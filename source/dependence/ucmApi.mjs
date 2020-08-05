/*
    Grandstream UCM API
    http://www.grandstream.com/sites/default/files/Resources/UCM_API_Guide.pdf
*/


/* macro: logger */
import logger from '../logger.mjs';
let log = logger.getInstance("UcmApi");
/* macro-end: logger */


import  md5 from 'md5';

import Lock from 'async-lock';
import Request from 'request-promise';

const Config = {
    url:"https://192.168.1.135:8089/api", // default value
    username:"cdrapi", // default value
    password:"cdrapi123", // default value
    cookie:null
};

// mutex for aBlockedRequest, prevent from unexpected authorization issue, and for simplify everything
const requestLock = new Lock();

async function aBlockedRequest(request)
{
    return new Promise((resolve, reject) => {
        log.debug(`lock`);
        requestLock.acquire("1",(done)=>{
            aRequest(request)
            .then( r => {
                resolve(r);
                log.debug(`unlock success`);
                done();
            }).catch(e => {
                reject(e);
                log.debug(`unlock catch`);
                done();
            })
        }, (err) => {
            reject(err);
            //log.debug(`unlock err`);
        });
    });
    /*
    requestLock.acquire("1",()=>{
        aRequest(request)
        .then( r => {

        })
    });*/
    /*console.log("lock")
    const release = await requestMutex.acquire();
    try {
        let r = await aRequest(request);
        release();
        console.log("unlock");
        return r;
    } finally {
       release();
       console.log("unlock");
    } */
}

// unsafe request use only inside this module
async function aRequest( request) {

    if(Config.cookie) request.cookie = Config.cookie;

    let requestOptions = {
        method: 'POST',
        uri: Config.url,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Connection': 'close'
        },
        body: { request: request},
        json: true,
        "rejectUnauthorized": false
    };

    let response = await Request(requestOptions);
    if(response.status != 0)
    {
        await aConnect();

        if(Config.cookie) request.cookie = Config.cookie;
        response = await Request(requestOptions);
    }
    return response;

}

// connectiong and authorization flow for ucm api
async function aConnect()
{
    log.info(`reconecting`);

    let response = await aRequest({
        "action":"challenge",
        "user":"cdrapi",
        "version":"1.0",
    });

    let token = md5(response.response.challenge+Config.password);
    response = await aRequest({
        "action":"login",
        "token": token,
        "user":"cdrapi",
    });

    Config.cookie = response.response.cookie;
    return Promise.resolve();
}


// in config setup: { url, username, password} to acess ucm api
// aRequest are used to make request argument is request json



export default {
    config: Config,
    aRequest:  aBlockedRequest,
}