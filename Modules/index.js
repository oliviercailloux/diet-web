import { Requester } from './requester.js';
if (window.location.protocol !== 'https:' && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
    throw new Error('Protocol should be https.');
}
/** Just to wake the server up, in case it is sleeping, ahead of time (before we really need it). */
new Requester().svg();
