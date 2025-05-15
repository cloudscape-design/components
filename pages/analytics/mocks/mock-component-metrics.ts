// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { IComponentMetrics } from '~components/internal/analytics/interfaces';

const logMethod = (methodName: string) => (props: any) => {
  console.log(methodName, props);
  const testApi = getTestAPI();
  testApi?.track(methodName, props);
};

function getTestAPI() {
  return window.__analytics?.__tableInteractionAPI;
}

export const ComponentMetricsLogger: IComponentMetrics = {
  componentMounted: props => {
    const taskInteractionId = props.taskInteractionId || 'mocked';
    const updatedProps = { ...props, taskInteractionId };
    logMethod('componentMounted')(updatedProps);
    return taskInteractionId;
  },

  componentUpdated: logMethod('componentUpdated'),
};
