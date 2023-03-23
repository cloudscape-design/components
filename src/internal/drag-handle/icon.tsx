// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import Icon from '../../icon/internal';
import React, { memo } from 'react';

function DragHandleIcon() {
  return <Icon svg={<SVG />} />;
}

function SVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="true">
      <circle cx="5.5" cy="2.5" r="0.5" className="filled" strokeWidth="2" />
      <circle cx="5.5" cy="13.5" r="0.5" className="filled" strokeWidth="2" />
      <circle cx="5.5" cy="8" r="0.5" className="filled" strokeWidth="2" />
      <circle cx="10.5" cy="2.5" r="0.5" className="filled" strokeWidth="2" />
      <circle cx="10.5" cy="13.5" r="0.5" className="filled" strokeWidth="2" />
      <circle cx="10.5" cy="8" r="0.5" className="filled" strokeWidth="2" />
    </svg>
  );
}

export default memo(DragHandleIcon);
