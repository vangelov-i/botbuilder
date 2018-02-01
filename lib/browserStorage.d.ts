/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { MemoryStorage } from './memoryStorage';
import { StorageSettings } from './storage';
/**
 * Storage middleware that uses browser local storage.
 *
 * __Extends BotContext:__
 * * context.storage - Storage provider for storing and retrieving objects.
 *
 * **Usage Example**
 *
 * ```js
 * const bot = new Bot(adapter)
 *      .use(new BrowserLocalStorage())
 *      .use(new BotStateManage())
 *      .onReceive((context) => {
 *          context.reply(`Hello World`);
 *      })
 * ```
 */
export declare class BrowserLocalStorage extends MemoryStorage {
    constructor(options?: StorageSettings);
}
/**
 * Storage middleware that uses browser session storage.
 *
 * __Extends BotContext:__
 * * context.storage - Storage provider for storing and retrieving objects.
 *
 * **Usage Example**
 *
 * ```js
 * const bot = new Bot(adapter)
 *      .use(new BrowserSessionStorage())
 *      .use(new BotStateManage())
 *      .onReceive((context) => {
 *          context.reply(`Hello World`);
 *      })
 * ```
 */
export declare class BrowserSessionStorage extends MemoryStorage {
    constructor(options?: StorageSettings);
}
