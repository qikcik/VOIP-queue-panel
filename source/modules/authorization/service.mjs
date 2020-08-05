/* macro: logger */
import logger from '../../logger.mjs';
let log = logger.getInstance("AuthorizationService");
/* macro-end: logger */

import serviceBase from '../../server/serviceBase.mjs';


import Shared from '../../sharedService/shared.mjs'; 

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
    }

    async aGetAllLogin()
    {
        log.debug(`aGetAllLogin`,``);

        return await Shared.account.aGetAllLogin();
    }

    async aGetUser(login)
    {
        return  await Shared.account.aGetUser(login);
    }

    async aTryLogin(login,password)
    {

        let user = await Shared.account.aGetUser(login);
        if(user)
            if(user.password == password)
                return true;
        return false;
    }

    async aCleanup()
    {
        await super.aCleanup();
    }
}