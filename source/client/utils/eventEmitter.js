export default class EventEmitter{
    constructor(){
        this.callbacks = {}
    }

    on(event, cb){
        if(!this.callbacks[event]) this.callbacks[event] = [];
        this.callbacks[event].push(cb)
    }

    emit(event, ...args){
        let cbs = this.callbacks[event]
        if(cbs){
            cbs.forEach(cb => cb(...args))
        }
    }

    remove(event, cb){
        this.callbacks[event] = this.callbacks[event].filter( e => e != cb)
    }
}