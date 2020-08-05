/* macro: logger */
import logger from '../logger.mjs';
let log = logger.getInstance("PlainAccountSharedService");
/* macro-end: logger */

import AccountSharedService from './account.mjs';

//class
export default class PlainAccountSharedService extends AccountSharedService
{
    constructor()
    {
        super(); 

        this.accounts = [
            {
                login: "user11",
                password: "11",
                extension: "11",
                fullname: "user user11",
                inQueue: []
            },
            {
                login: "user12",
                password: "12",
                extension: "12",
                fullname: "user user12",
                inQueue: ["101"]
            },
            {
                login: "user13",
                password: "13",
                extension: "13",
                fullname: "user user13",
                inQueue: ["102","101"]
            }
        ];

        this.queue = [
            {
                Queue: "101",
                QueueName: "dział sprzedaży"
            },
            {
                Queue: "102",
                QueueName: "dział pomocy"
            }
        ]
    }

    async aGetAllLogin()
    {
        log.debug(`aGetAllLogin`,``);
        return this.accounts.map( e => e.login );
    }

    async aGetUser(login)
    {
        return this.accounts.find( x => x.login == login)
    }

    async aGetQueueName(queue) 
    {
        return this.queue.find( x => x.Queue == queue);
    }
    
}