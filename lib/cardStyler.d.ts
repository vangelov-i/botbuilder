/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as activity from './activity';
/**
 * A set of utility functions designed to assist with the formatting of the various card types a
 * bot can return. All of these functions return an `Attachment` which can be added to an `Activity`
 * directly or passed as input to a `MessageStyler` function.
 *
 * **Usage Example**
 *
 * ```js
 * const card = CardStyler.heroCard(
 *      'White T-Shirt',
 *      ['https://example.com/whiteShirt.jpg'],
 *      ['buy']
 * );
 * ```
 */
export declare class CardStyler {
    /** List of content types for each card style. */
    static contentTypes: {
        adaptiveCard: string;
        animationCard: string;
        audioCard: string;
        heroCard: string;
        receiptCard: string;
        signinCard: string;
        thumbnailCard: string;
        videoCard: string;
    };
    /**
     * Returns an attachment for an adaptive card. The attachment will contain the card and the
     * appropriate `contentType`.
     *
     * Adaptive Cards are a new way for bots to send interactive and immersive card content to
     * users. For channels that don't yet support Adaptive Cards natively, the Bot Framework will
     * down render the card to an image that's been styled to look good on the target channel. For
     * channels that support [hero cards](#herocards) you can continue to include Adaptive Card
     * actions and they will be sent as buttons along with the rendered version of the card.
     *
     * For more information about Adaptive Cards and to download the latest SDK, visit
     * [adaptivecards.io](http://adaptivecards.io/).
     *
     * @param card The adaptive card to return as an attachment.
     */
    static adaptiveCard(card: any): activity.Attachment;
    /**
     * Returns an attachment for an animation card.
     *
     * @param title The cards title.
     * @param media Media URL's for the card.
     * @param buttons (Optional) set of buttons to include on the card.
     * @param other (Optional) additional properties to include on the card.
     */
    static animationCard(title: string, media: (activity.MediaUrl | string)[], buttons?: (activity.CardAction | string)[], other?: Partial<activity.AnimationCard>): activity.Attachment;
    /**
     * Returns an attachment for an audio card.
     *
     * @param title The cards title.
     * @param media Media URL's for the card.
     * @param buttons (Optional) set of buttons to include on the card.
     * @param other (Optional) additional properties to include on the card.
     */
    static audioCard(title: string, media: (activity.MediaUrl | string)[], buttons?: (activity.CardAction | string)[], other?: Partial<activity.AnimationCard>): activity.Attachment;
    /**
     * Returns an attachment for a hero card. Hero cards tend to have one dominant full width image
     * and the cards text & buttons can usually be found below the image.
     *
     * @param title The cards title.
     * @param text (Optional) text field for the card.
     * @param images (Optional) set of images to include on the card.
     * @param buttons (Optional) set of buttons to include on the card.
     * @param other (Optional) additional properties to include on the card.
     */
    static heroCard(title: string, images?: (activity.CardImage | string)[], buttons?: (activity.CardAction | string)[], other?: Partial<activity.HeroCard>): activity.Attachment;
    static heroCard(title: string, text: string, images?: (activity.CardImage | string)[], buttons?: (activity.CardAction | string)[], other?: Partial<activity.HeroCard>): activity.Attachment;
    /**
     * Returns an attachment for a receipt card. The attachment will contain the card and the
     * appropriate `contentType`.
     *
     * @param card The adaptive card to return as an attachment.
     */
    static receiptCard(card: activity.ReceiptCard): activity.Attachment;
    /**
     * Returns an attachment for a signin card. For channels that don't natively support signin
     * cards an alternative message will be rendered.
     *
     * @param title The cards title.
     * @param url The link to the signin page the user needs to visit.
     * @param text (Optional) additional text to include on the card.
     */
    static signinCard(title: string, url: string, text?: string): activity.Attachment;
    /**
     * Returns an attachment for a thumbnail card. Thumbnail cards are similar to [hero cards](#herocard)
     * but instead of a full width image, they're typically rendered with a smaller thumbnail version of
     * the image on either side and the text will be rendered in column next to the image. Any buttons
     * will typically show up under the card.
     *
     * @param title The cards title.
     * @param text (Optional) text field for the card.
     * @param images (Optional) set of images to include on the card.
     * @param buttons (Optional) set of buttons to include on the card.
     * @param other (Optional) additional properties to include on the card.
     */
    static thumbnailCard(title: string, images?: (activity.CardImage | string)[], buttons?: (activity.CardAction | string)[], other?: Partial<activity.ThumbnailCard>): activity.Attachment;
    static thumbnailCard(title: string, text: string, images?: (activity.CardImage | string)[], buttons?: (activity.CardAction | string)[], other?: Partial<activity.ThumbnailCard>): activity.Attachment;
    /**
     * Returns an attachment for a video card.
     *
     * @param title The cards title.
     * @param media Media URL's for the card.
     * @param buttons (Optional) set of buttons to include on the card.
     * @param other (Optional) additional properties to include on the card.
     */
    static videoCard(title: string, media: (activity.MediaUrl | string)[], buttons?: (activity.CardAction | string)[], other?: Partial<activity.AnimationCard>): activity.Attachment;
    /**
     * Returns a properly formatted array of actions. Supports converting strings to `messageBack`
     * actions (note: using 'imBack' for now as 'messageBack' doesn't work properly in emulator.)
     *
     * @param actions Array of card actions or strings. Strings will be converted to `messageBack` actions.
     */
    static actions(actions: (activity.CardAction | string)[] | undefined): activity.CardAction[];
    /**
     * Returns a properly formatted array of card images.
     *
     * @param images Array of card images or strings. Strings will be converted to card images.
     */
    static images(images: (activity.CardImage | string)[] | undefined): activity.CardImage[];
    /**
     * Returns a properly formatted array of media url objects.
     *
     * @param links Array of media url objects or strings. Strings will be converted to a media url object.
     */
    static media(links: (activity.MediaUrl | string)[] | undefined): activity.MediaUrl[];
}
