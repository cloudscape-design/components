// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import debounce from '../debounce';

describe('debounce utility', () => {
  const wait = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

  it('calls the underlying function with the specified delay', async () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 0);
    debouncedFunc();
    expect(func).not.toHaveBeenCalled();
    await wait(0);
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('aggregates calls and invokes the function only once with the latest arguments', async () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 0);
    debouncedFunc('one');
    debouncedFunc('two');
    debouncedFunc('three');
    expect(func).not.toHaveBeenCalled();
    await wait(0);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('three');
  });
});
