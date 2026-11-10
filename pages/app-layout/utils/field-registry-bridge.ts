// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const BRIDGE_CHANNEL = 'field-registry-demo';

export const EXAMPLE_VALUES: ReadonlyArray<[string, unknown]> = [
  ['Function name', 'my function'],
  ['Runtime', 'Python 3.13'],
  ['Architecture', 'arm64'],
  ['Enable logging', true],
  ['Description', 'Created from the assistant panel'],
  ['Subnet', 'subnet-b'],
  ['Security group', 'sg-web'],
  ['Enable flow logs', true],
  ['I acknowledge the terms', true],
];

// The assistant runs on the other loopback host name, which makes it a cross-origin frame, like an isolated runtime.
export function otherLoopbackOrigin() {
  const { protocol, hostname, port } = window.location;
  const host = hostname === 'localhost' ? '127.0.0.1' : 'localhost';
  return `${protocol}//${host}${port ? `:${port}` : ''}`;
}
