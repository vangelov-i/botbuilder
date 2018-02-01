/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Activity } from './activity';
import { Bot } from './bot';
/**
 * Creates a new BotContext instance.
 *
 * @param bot Bot the context is for.
 * @param request (Optional) request to initialize the context with.
 */
export declare function createBotContext(bot: Bot, request?: Activity): BotContext;
