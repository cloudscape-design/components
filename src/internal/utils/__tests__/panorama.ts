// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const panorama = jest.fn();
(window as any).panorama = panorama;

export const expectDetailInPanoramaCall = (callNumber: number) =>
  expect(JSON.parse(panorama.mock.calls[callNumber - 1][1].eventDetail));
