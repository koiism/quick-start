import Blob from 'miniprogram-blob';

import { Headers } from './Headers';
import { Body } from './Body';

export class Response extends Body implements globalThis.Response {
  type: ResponseType = 'basic';
  url: string;
  status: number;
  statusText: string;
  ok = false;
  redirected = false;
  headers: Headers;

  constructor(body?: BodyInit | null, init?: ResponseInit) {
    super();
    this.status = init?.status || 0;
    this.statusText = init?.statusText || '';

    if (init?.headers) this.headers = new Headers(init.headers);
    if (
      globalThis.ReadableStream &&
      body instanceof globalThis.ReadableStream
    ) {
      this.body = body;
    } else if (globalThis.FormData && body instanceof globalThis.FormData) {
      this.body = null;
    } else if (body != null) {
      this.body = new Blob([
        body instanceof URLSearchParams ? body + '' : (body as string),
      ]).stream();
    } else {
      this.body = null;
    }
  }

  clone() {
    return Object.assign(new Response(), this);
  }
}
