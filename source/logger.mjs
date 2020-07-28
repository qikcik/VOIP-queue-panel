import {  EventEmitter } from 'events';

class Logger
{
    constructor()
    {
        this.handler = new EventEmitter();

        this.level = loggerLevel;
    }

    log(level,scope,tittle,value) 
    {
        this.handler.emit('log',level,scope,tittle,value);
    }

    getInstance(scope)
    {
        return new LoggerInstance(this,scope);
    }
}


class LoggerInstance
{
    constructor(logger,scope)
    {
        this.logger = logger;
        this.scope = scope;

        this.level = loggerLevel;
    }

    log( level,tittle,value ) { this.logger.log(level,this.scope,tittle,value) }
    debug (tittle,value) { this.logger.log(loggerLevel.debug, this.scope,tittle ,value) }
    info (tittle,value) { this.logger.log(loggerLevel.info, this.scope,tittle ,value) }

}

export const loggerLevel = {
    "debug": 0,
    "info": 1,
    "warrning": 2,
    "crititcal": 3,
}

export const logger = new Logger();
export default logger;

// TERMINAL OUTUPT
import colors from 'colors';

logger.handler.on('log', (level,scope,tittle,value) => 
{
    console.log(`[${level}][${scope}]`.green,`${tittle}: `,`${value}`);
});
