// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import AppContext from '../app/app-context';
import { IframeWrapper } from '../utils/iframe-wrapper';
import ScreenshotArea from '../utils/screenshot-area';
import { Configurator, DropdownExpandableContext, DropdownsDemo } from './expandable.page';

export default function () {
  const {
    urlParams: { componentType = 'Autosuggest', expandToViewport = true },
    setUrlParams,
  } = useContext(AppContext as DropdownExpandableContext);
  return (
    <ScreenshotArea>
      <h1>Expandable dropdown scenarios inside iframe</h1>
      <Configurator componentType={componentType} expandToViewport={expandToViewport} onChange={setUrlParams} />
      <IframeWrapper
        id="expandable-dropdowns-iframe"
        AppComponent={() => <DropdownsDemo componentType={componentType} expandToViewport={expandToViewport} />}
      />
    </ScreenshotArea>
  );
}
