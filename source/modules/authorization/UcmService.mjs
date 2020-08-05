/* macro: logger */
import logger from '../../logger.mjs';
let log = logger.getInstance("AuthorizationService");
/* macro-end: logger */

import serviceBase from '../../server/serviceBase.mjs';
import ucmAmi from '../../dependence/ucmApi.mjs'

//class
export default class AuthorizationService extends serviceBase
{
    constructor(module)
    {
        super(module);
    }

    async aInit()
    {
        await super.aInit();

        /*this.auth = 
        [
            {
                extension: "11",
                login: "l11",
                pass: "pass",
            },
            {
                extension: "12",
                login: "l12",
                pass: "pass",
            }
        ];*/

    }

    async aGetAllLogin()
    {
        log.debug(`aGetAllLogin`,``);
        let response = await ucmAmi.aRequest( { "action":"listAccount" } );
        return response.response.account.map( e => e.extension ) ;
        //return this.auth.map( e => e.login );
    }

    async aGetUser(login)
    {
        /*let e = this.auth.find( x => x.login == login)
        return {
            login: e.login,
            extension: e.extension
        };*/

        let response = await ucmAmi.aRequest( { "action":"getSIPAccount", "extension":login } );
        return {
            login: response.response.extension.fullname,
            extension: response.response.extension.extension
        };
    }

    async aTryLogin(login,pass)
    {
        let response = await ucmAmi.aRequest( { "action":"getSIPAccount", "extension":login } );
        if(response.response.extension.secret == pass)
            return true;
        return false;
        
        
        /*let user = this.auth.find( x => x.login == login)
        if(user)
            if(user.pass == pass)
                return true;
        return false;*/

        //return true;
    }

    async aCleanup()
    {
        await super.aCleanup();
    }
}