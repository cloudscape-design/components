// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export class PointerEventMock extends MouseEvent {
  readonly pointerType: string;
  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.pointerType = props.pointerType ?? 'mouse';
  }
}
