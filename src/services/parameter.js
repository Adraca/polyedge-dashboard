import { info } from './data.js';

const uuri = info.protocol + info.separator + info.domain + info.path;

export const token = info.token;

export const options = { url: uuri, headers: info.head }



