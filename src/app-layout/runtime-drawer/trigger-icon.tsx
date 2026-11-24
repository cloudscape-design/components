// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export interface RuntimeTriggerIconMarkup {
  iconSvgMarkup?: string;
}

export const convertRuntimeTriggerToReactNode = (runtimeTrigger?: string) => {
  if (!runtimeTrigger) {
    return undefined;
  }
  // eslint-disable-next-line react/no-danger
  return <span style={{ lineHeight: 0 }} dangerouslySetInnerHTML={{ __html: runtimeTrigger }} />;
};

export function resolveTriggerIconSvg(trigger?: { iconSvg?: React.ReactNode } & RuntimeTriggerIconMarkup) {
  return trigger?.iconSvgMarkup ? convertRuntimeTriggerToReactNode(trigger.iconSvgMarkup) : trigger?.iconSvg;
}
