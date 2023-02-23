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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2H6.01V2.01H6V2ZM6 6H6.01V6.01H6V6ZM6.01 10H6V10.01H6.01V10ZM6 14H6.01V14.01H6V14ZM10.01 2H10V2.01H10.01V2ZM10 6H10.01V6.01H10V6ZM10.01 10H10V10.01H10.01V10ZM10 14H10.01V14.01H10V14Z"
        fill="#16191F"
      />
    </svg>
  );
}

export default memo(DragHandleIcon);
