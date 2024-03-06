// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getContentHeaderClassName } from '../../internal/utils/content-header-utils';
import styles from '../styles.css.js';

export interface SVGTableRowProps {
  offset: number;
  separator?: boolean;
  isHeader?: boolean;
}

export const getClassName = (suffix: string) => styles[`preference-icon-refresh--${suffix}`];

const TableRow = ({ offset, separator = true, isHeader }: SVGTableRowProps) => {
  const offsetTop = 0.4482;
  const offsetBottom = 3.4482;
  return (
    <g transform={`translate(0, ${offset})`} className={getClassName(isHeader ? 'column-header' : 'disabled')}>
      <path d={`M19 ${offsetTop}2H22V${offsetBottom}H19V${offsetTop}Z`} />
      <path
        d={`M27 ${offsetTop}H51V${offsetBottom}H27V${offsetTop}Z`}
        className={!isHeader ? getClassName('secondary') : undefined}
      />
      <path d={`M90 ${offsetTop}H110V${offsetBottom}H90V${offsetTop}Z`} />
      <path d={`M113 ${offsetTop}H157V${offsetBottom}H113V${offsetTop}Z`} />
      {separator && <path d="M14 8H159.387" className={getClassName('separator')} strokeLinecap="square" />}
    </g>
  );
};

const SidePanelRow = ({ offset }: SVGTableRowProps) => {
  return (
    <g transform={`translate(0, ${offset})`} className={getClassName('secondary')}>
      <path d="M177 0H190V3H177V0Z" />
      <path d="M195 0H208V3H195V0Z" />
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
      d="M2 1H214C214.552 1 215 1.44772 215 2V126C215 126.552 214.552 127 214 127H2.00001C1.44772 127 1 126.552 1 126V2C1 1.44772 1.44772 1 2 1Z"
      className={getClassName('window')}
      strokeWidth="2"
    />
    <g className="awsui-context-top-navigation">
      <rect x="2" y="2" width="212" height="6" className={getClassName('layout-top')} />
    </g>
    <g className={getContentHeaderClassName()}>
      <path d="M2 8H214V23H2V8Z" className={getClassName('layout-main')} />
      <g className={getClassName('default')}>
        <path
          d="M9 15.5C9 16.8807 7.88071 18 6.5 18C5.11929 18 4 16.8807 4 15.5C4 14.1193 5.11929 13 6.5 13C7.88071 13 9 14.1193 9 15.5Z"
          className={getClassName('disabled')}
        />
        <path d="M16 14H46.1484V17H16V14Z" />
        <path d="M92 15.5C92 13.567 93.567 12 95.5 12H108.86C110.793 12 112.36 13.567 112.36 15.5C112.36 17.433 110.793 19 108.86 19H95.5C93.567 19 92 17.433 92 15.5Z" />
        <path d="M116 15.5C116 13.567 117.567 12 119.5 12H132.86C134.793 12 136.36 13.567 136.36 15.5C136.36 17.433 134.793 19 132.86 19H119.5C117.567 19 116 17.433 116 15.5Z" />
        <path
          d="M139 15.5C139 13.567 140.567 12 142.5 12H155.86C157.793 12 159.36 13.567 159.36 15.5C159.36 17.433 157.793 19 155.86 19H142.5C140.567 19 139 17.433 139 15.5Z"
          className={getClassName('primary')}
        />
      </g>
    </g>
    <TableRow offset={27} isHeader={true} />
    <TableRow offset={39} />
    <TableRow offset={51} />
    <TableRow offset={63} />
    <TableRow offset={75} />
    <TableRow offset={87} />
    <TableRow offset={99} />
    <TableRow offset={111} separator={false} />

    <rect x="166" y="13" width="62" height="108" rx="5" className={getClassName('window')} strokeWidth="2" />
    <rect x="169" y="62" width="3" height="8" rx="1.5" className={getClassName('input-default')} />
    <path d="M216 14V120" className={getClassName('separator')} />
    <g className={getClassName('disabled')}>
      <path d="M224 19.5C224 20.8807 222.881 22 221.5 22C220.119 22 219 20.8807 219 19.5C219 18.1193 220.119 17 221.5 17C222.881 17 224 18.1193 224 19.5Z" />
      <path d="M224 27.5C224 28.8807 222.881 30 221.5 30C220.119 30 219 28.8807 219 27.5C219 26.1193 220.119 25 221.5 25C222.881 25 224 26.1193 224 27.5Z" />
    </g>
    <path d="M177 23H191V28H177V23Z" className={getClassName('heading')} />
    <g className={getClassName('secondary')}>
      <path d="M207 23H212V28H207V23Z" />
      <path d="M199 23H204V28H199V23Z" />
    </g>
    <SidePanelRow offset={36} />
    <SidePanelRow offset={48} />
    <SidePanelRow offset={60} />
    <SidePanelRow offset={72} />
  </svg>
);

export default bottomPositionIcon;
