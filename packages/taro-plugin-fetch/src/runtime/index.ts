import Blob from './Blob';
import FormData from 'miniprogram-formdata';
import {
  ByteLengthQueuingStrategy,
  CountQueuingStrategy,
  ReadableByteStreamController,
  ReadableStream,
  ReadableStreamBYOBReader,
  ReadableStreamBYOBRequest,
  ReadableStreamDefaultController,
  ReadableStreamDefaultReader,
  TransformStream,
  TransformStreamDefaultController,
  WritableStream,
  WritableStreamDefaultController,
  WritableStreamDefaultWriter,
} from 'web-streams-polyfill';
import { Headers } from './Headers';
import { Body } from './Body';
import { Request } from './Request';
import { Response } from './Response';
import { fetch } from './fetch';

import { window } from '@tarojs/runtime';

if (process.env.TARO_PLATFORM !== 'web') {
  const polyfills = {
    Headers,
    Body,
    Request,
    Response,
    fetch,
    Blob,
    FormData,
    ByteLengthQueuingStrategy,
    CountQueuingStrategy,
    ReadableByteStreamController,
    ReadableStream,
    ReadableStreamBYOBReader,
    ReadableStreamBYOBRequest,
    ReadableStreamDefaultController,
    ReadableStreamDefaultReader,
    TransformStream,
    TransformStreamDefaultController,
    WritableStream,
    WritableStreamDefaultController,
    WritableStreamDefaultWriter,
  };

  for (const key in polyfills) {
    try {
      Object.defineProperty(window, key, {
        configurable: false, // 防止属性被删除或再次修改
        writable: false, // 防止属性值被改写
        value: polyfills[key],
      });
      console.log(`output->window`, window[key]);
    } catch (e) {
      console.warn(e);
      continue;
    }
  }
}

export * from './Headers';
export * from './Body';
export * from './Request';
export * from './Response';
export * from './fetch';
