import { Controller } from './support.js';
if (window.location.protocol !== 'https:' && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
    throw new Error('Protocol should be https.');
}
new Controller().init();
