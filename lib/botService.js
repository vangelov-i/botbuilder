"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Middleware that simplifies adding a new service to the BotContext. Services expose themselves
 * as a new property of the BotContext and this class formalizes that process.
 *
 * This class is typically derived from but can also be used like
 * `bot.use(new BotService('myService', new MyService()));`. The registered service would be
 * accessible globally by developers through `context.myService`.
 *
 * __Extends BotContext:__
 * * context.<service name> - New service
 */
class BotService {
    /**
     * Creates a new instance of a service definition.
     *
     * @param name Name of the service being registered. This is the property off the context object
     * that will be used by developers to access the service.
     * @param instance (Optional) singleton instance of the service to add to the context object.
     * Dynamic instances can be added by implementing [getService()](#getservice).
     */
    constructor(name, instance) {
        this.name = name;
        this.instance = instance;
    }
    contextCreated(context, next) {
        if (context.hasOwnProperty(this.name)) {
            context.logger.log(`A service named '${this.name}' is already registered with the context object.`, TraceLevel.warning);
        }
        context[this.name] = this.getService(context);
        return next();
    }
    /**
     * Overrided by derived classes to register a dynamic instance of the service.
     *
     * @param context Context for the current turn of the conversation.
     */
    getService(context) {
        return this.instance;
    }
}
exports.BotService = BotService;
//# sourceMappingURL=botService.js.map