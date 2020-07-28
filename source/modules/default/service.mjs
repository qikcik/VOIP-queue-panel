/* macro: logger */
import logger from '../../logger.mjs';
let log = logger.getInstance("DefaultService");
/* macro-end: logger */

import serviceBase from '../../server/serviceBase.mjs';

//class
export default class DefaultService extends serviceBase
{
    constructor(module)
    {
        super(module);
    }

    async aInit()
    {
        await super.aInit();
    }

    async aCleanup()
    {
        await super.aCleanup();
    }
}