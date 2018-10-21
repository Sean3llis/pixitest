import { EventEmitter } from "eventemitter3";

export const FILE_UPLOADED = 'FILE_UPLOADED';

export default class PixiClient extends EventEmitter {
  static getInstance() {
    if (this.instance) return this.instance;

    this.instance = new PixiClient();
    return this.instance;
  }
}