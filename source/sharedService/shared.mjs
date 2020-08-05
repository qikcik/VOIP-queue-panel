import PlainAccountSharedService from "./plainAccount.mjs";
import QueueAsteriskharedService from "./queueAsterisk.mjs";
import CallControlAsteriskSharedService from "./callControlAsterisk.mjs";

export default {
    account: new PlainAccountSharedService(),
    queue: new QueueAsteriskharedService(),
    callControl: new CallControlAsteriskSharedService()
}