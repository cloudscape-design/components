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

    expect(funcMock).toHaveBeenCalledTimes(1);
    expect(funcMock).toHaveBeenCalledWith('arg1', 'arg2');
    expect(dateNowSpy).toHaveBeenCalledTimes(1);
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(0);
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

    expect(funcMock).toHaveBeenCalledTimes(3);
    expect(funcMock).toHaveBeenCalledWith('arg-0');
    expect(funcMock).toHaveBeenCalledWith('arg-25');
    expect(funcMock).toHaveBeenCalledWith('arg-50');
  });

  describe('cancel', () => {
    it('prevents a pending trailing invocation from firing', () => {
      const throttled = throttle(funcMock, 25);

      throttled('a'); // leading invocation, fires immediately
      throttled('b'); // schedules trailing
      throttled.cancel();

      // Advance well past the delay; nothing additional should fire.
      for (let i = 0; i < 30; i++) {
        tick();
      }

      expect(funcMock).toHaveBeenCalledTimes(1);
      expect(funcMock).toHaveBeenCalledWith('a');
    });

    it('preserves the throttle window so subsequent calls within the delay are still throttled', () => {
      const throttled = throttle(funcMock, 25);

      throttled('a'); // leading invocation, fires immediately
      throttled.cancel();
      // A call within the throttle window after a cancel should NOT fire as a
      // new leading invocation — it should be deferred as a trailing call.
      throttled('b');

      expect(funcMock).toHaveBeenCalledTimes(1);
      expect(funcMock).toHaveBeenCalledWith('a');

      // After the delay elapses, the trailing call fires.
      for (let i = 0; i < 30; i++) {
        tick();
      }
      expect(funcMock).toHaveBeenCalledTimes(2);
      expect(funcMock).toHaveBeenCalledWith('b');
    });
  });
});
