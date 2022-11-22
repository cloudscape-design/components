// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { throttle } from '../throttle';

describe('throttle', () => {
  let dateNowSpy: jest.SpyInstance<number>;
  let requestAnimationFrameSpy: jest.SpyInstance<number>;
  let funcMock: jest.Mock;
  let tick: () => void;

  beforeEach(() => {
    let time = 0;
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => time);
    requestAnimationFrameSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      tick = () => {
        time++;
        callback(time);
      };
      return time;
    });
    funcMock = jest.fn();
  });

  afterAll(() => {
    dateNowSpy.mockRestore();
    requestAnimationFrameSpy.mockRestore();
  });

  it('should run the client function synchronously for the first invocation', () => {
    const throttled = throttle(funcMock, 50);

    throttled('arg1', 'arg2');

    expect(funcMock).toBeCalledTimes(1);
    expect(funcMock).toBeCalledWith('arg1', 'arg2');
    expect(dateNowSpy).toBeCalledTimes(1);
    expect(requestAnimationFrameSpy).toBeCalledTimes(0);
  });

  it('should run the client function three times only', () => {
    const throttled = throttle(funcMock, 25);

    // Execution 1
    throttled(`arg-${0}`);

    // The function should execute every 25th iteration.
    for (let i = 1; i <= 50; i++) {
      throttled(`arg-${i}`);
      tick();
    }

    expect(funcMock).toBeCalledTimes(3);
    expect(funcMock).toBeCalledWith('arg-0');
    expect(funcMock).toBeCalledWith('arg-25');
    expect(funcMock).toBeCalledWith('arg-50');
  });
});
