// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getContentHeaderClassName } from '../../internal/utils/content-header-utils';
import { getClassName, SVGTableRowProps } from './side-position-refresh';

const TableRow = ({ offset, isHeader }: SVGTableRowProps) => {
  const offsetTop = 0.4482;
  const offsetBottom = 3.4482;
  return (
    <g transform={`translate(0, ${offset})`} className={getClassName(isHeader ? 'column-header' : 'disabled')}>
      <path d={`M31 ${offsetTop}H34V${offsetBottom}H31V${offsetTop}Z`} />
      <path
        d={`M39 ${offsetTop}H63V${offsetBottom}H39V${offsetTop}Z`}
        className={!isHeader ? getClassName('secondary') : undefined}
      />
      <path d={`M135 ${offsetTop}H155V${offsetBottom}H135V${offsetTop}Z`} />
      <path d={`M158 ${offsetTop}H202V${offsetBottom}H158V${offsetTop}Z`} />
      <path d="M26 8H204.388" className={getClassName('separator')} strokeLinecap="square" />
    </g>
  );
};

const SidePanelRow = ({ offset }: SVGTableRowProps) => {
  return (
    <g transform={`translate(0, ${offset})`} className={getClassName('secondary')}>
      <path d="M27 0H59V3H27V0Z" />
      <path d="M75 0H107V3H75V0Z" />
      <path d="M123 0H155V3H123V0Z" />
      <path d="M171 0H203V3H171V0Z" />
    </g>
  );
};

const bottomPositionIcon = (
  <svg
    focusable={false}
    viewBox="0 0 230 128"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    aria-hidden="true"
  >
    <path
      d="M2 1H228C228.552 1 229 1.44772 229 2V117C229 117.552 228.552 118 228 118H2C1.44772 118 1 117.552 1 117V2C1 1.44772 1.44772 1 2 1Z"
      className={getClassName('window')}
      strokeWidth="2"
    />
    <g className="awsui-context-top-navigation">
      <rect x="2" y="2" width="226" height="6" className={getClassName('layout-top')} />
    </g>
    <g className={getContentHeaderClassName()}>
      <path d="M2 8H228V23H2V8Z" className={getClassName('layout-main')} />
      <g className={getClassName('default')}>
        <path
          d="M9 15.5C9 16.8807 7.88071 18 6.5 18C5.11929 18 4 16.8807 4 15.5C4 14.1193 5.11929 13 6.5 13C7.88071 13 9 14.1193 9 15.5Z"
          className={getClassName('disabled')}
        />
        <path d="M26 14H56.1484V17H26V14Z" />
        <path d="M139 15.5C139 13.567 140.567 12 142.5 12H155.86C157.793 12 159.36 13.567 159.36 15.5C159.36 17.433 157.793 19 155.86 19H142.5C140.567 19 139 17.433 139 15.5Z" />
        <path d="M163 15.5C163 13.567 164.567 12 166.5 12H179.86C181.793 12 183.36 13.567 183.36 15.5C183.36 17.433 181.793 19 179.86 19H166.5C164.567 19 163 17.433 163 15.5Z" />
        <path
          d="M186 15.5C186 13.567 187.567 12 189.5 12H202.86C204.793 12 206.36 13.567 206.36 15.5C206.36 17.433 204.793 19 202.86 19H189.5C187.567 19 186 17.433 186 15.5Z"
          className={getClassName('primary')}
        />
        <circle cx="223.5" cy="15.5" r="2.5" className={getClassName('disabled')} />
      </g>
    </g>
    <TableRow offset={27} isHeader={true} />
    <TableRow offset={39} />
    <TableRow offset={51} />
    <TableRow offset={63} />

    <rect x="8" y="75" width="214" height="52" rx="5" className={getClassName('window')} strokeWidth="2" />
    <rect x="111" y="79" width="8" height="3" rx="1.5" className={getClassName('input-default')} />
    <path d="M27 87H57V92H27V87Z" className={getClassName('heading')} />
    <g className={getClassName('secondary')}>
      <path d="M198 87H203V92H198V87Z" />
      <path d="M190 87H195V92H190V87Z" />
    </g>

    <SidePanelRow offset={99} />
    <SidePanelRow offset={106} />
    <SidePanelRow offset={113} />
  </svg>
);

export default bottomPositionIcon;
