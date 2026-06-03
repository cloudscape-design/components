// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useState } from 'react';

import { FormField, SpaceBetween } from '~components';
import Icon from '~components/icon';
import RadioGroup from '~components/radio-group';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import { applyTheme } from '~components/theming';
import Toggle from '~components/toggle';

import { SimplePage } from '../app/templates';
import { generateThemeConfigOneTheme, themeCoreConfig } from './one-theme-config';

// A custom inline SVG, demonstrating that the `icon` slot accepts any React node.
const CustomBoltSvg = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    aria-hidden="true"
  >
    <path d="M9 1L3 9h4l-1 6 6-8h-4l1-6z" stroke="currentColor" strokeWidth="1" fill="none" strokeLinejoin="round" />
  </svg>
);

export const omegaItems: SideNavigationProps.Item[] = [
  {
    type: 'link',
    icon: (
      <Icon
        svg={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="4" height="5" rx="1" fill="currentColor" className="filled no-stroke" />
            <rect x="9" y="9" width="4" height="5" rx="1" fill="currentColor" className="filled no-stroke" />
            <rect x="9" y="4" width="4" height="3" rx="1" fill="currentColor" className="filled no-stroke" />
            <rect x="3" y="11" width="4" height="3" rx="1" fill="currentColor" className="filled no-stroke" />
          </svg>
          // <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          //   <rect
          //     x="1.5"
          //     y="1.5"
          //     width="5.5"
          //     height="6.5"
          //     rx="1"
          //     fill="currentColor"
          //     className="filled no-stroke"
          //   ></rect>
          //   <rect x="9" y="8" width="5.5" height="6.5" rx="1" fill="currentColor" className="filled no-stroke"></rect>
          //   <rect x="9" y="1.5" width="5.5" height="4.5" rx="1" fill="currentColor" className="filled no-stroke"></rect>
          //   <rect
          //     x="1.5"
          //     y="10"
          //     width="5.5"
          //     height="4.65"
          //     rx="1"
          //     fill="currentColor"
          //     className="filled no-stroke"
          //   ></rect>
          // </svg>
        }
      />
    ),
    text: 'Project overview',
    href: '#/overview',
  },
  {
    type: 'link',
    icon: (
      <Icon
        svg={
          <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2926_14024)">
              <path
                d="M14.0178 2.86708L14.0413 2.77928C14.2747 1.90712 13.5479 1.07726 12.6526 1.19363C10.758 1.43988 9.01325 2.35335 7.73145 3.77007L2.99982 8.99976L5.99988 11.9998L11.5705 6.89947C12.7539 5.81602 13.603 4.41696 14.0178 2.86708Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M1.1026 11.1156C1.07061 10.9237 1.30372 10.8037 1.4413 10.9413L4.0587 13.5587C4.19628 13.6963 4.07632 13.9294 3.8844 13.8974L1.64091 13.5235C1.55662 13.5094 1.49056 13.4434 1.47651 13.3591L1.1026 11.1156Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M8.999 10.7249L9.89315 13.4073C10.0047 13.7421 10.4296 13.8424 10.6791 13.5929L11.884 12.388C13.1958 11.0762 13.4473 9.04039 12.4942 7.44886C12.4556 7.3844 12.3667 7.37332 12.3135 7.42631L8.999 10.7249Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M4.75603 6.48203L2.07356 5.58787C1.7388 5.47629 1.63851 5.05143 1.88802 4.80192L3.09296 3.59698C4.40473 2.28522 6.44057 2.03371 8.03213 2.98681C8.09658 3.0254 8.10767 3.11426 8.05467 3.16751L4.75603 6.48203Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        }
      />
    ),
    text: 'Deployments',
    href: '#/deployments',
  },
  {
    type: 'link',
    icon: (
      <Icon
        svg={
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3.9502 12.0996C4.50217 12.0998 4.94999 12.5476 4.9502 13.0996V15.5L4.94531 15.6016C4.89766 16.0722 4.52321 16.4461 4.05273 16.4941L3.9502 16.5H2.65039L2.54785 16.4941C2.07726 16.4462 1.70292 16.0722 1.65527 15.6016L1.65039 15.5V13.0996C1.65059 12.5821 2.04385 12.1558 2.54785 12.1045L2.65039 12.0996H3.9502ZM9.4502 6.59961C10.0022 6.59982 10.45 7.04763 10.4502 7.59961V15.5L10.4453 15.6016C10.3977 16.0722 10.0232 16.4461 9.55273 16.4941L9.4502 16.5H8.15039L8.04785 16.4941C7.57726 16.4462 7.20292 16.0722 7.15527 15.6016L7.15039 15.5V7.59961C7.15059 7.08211 7.54385 6.65581 8.04785 6.60449L8.15039 6.59961H9.4502ZM14.9502 2.2002C15.5023 2.20041 15.9502 2.64804 15.9502 3.2002V15.5C15.9501 16.0521 15.5022 16.4998 14.9502 16.5H13.6504L13.5479 16.4951C13.0438 16.4438 12.6505 16.0176 12.6504 15.5V3.2002C12.6504 2.68252 13.0437 2.25641 13.5479 2.20508L13.6504 2.2002H14.9502Z"
              fill="currentColor"
              className="filled no-stroke"
            />
          </svg>
        }
      />
    ),
    text: 'Metrics',
    href: '#/metrics',
  },
  { type: 'link', icon: <Icon name="settings" />, text: 'Settings', href: '#/settings' },
  {
    type: 'link',
    icon: (
      <Icon
        svg={
          <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.99976 14.5L2.61514 12.2564C2.24249 12.1011 1.99976 11.737 1.99976 11.3333V4L7.61514 1.66026C7.86129 1.55769 8.13822 1.55769 8.38437 1.66026L13.9998 4V11.3333C13.9998 11.737 13.757 12.1011 13.3844 12.2564L7.99976 14.5ZM13.9998 4L7.99976 6.5M1.99976 4L7.99976 6.5M7.99976 14.5V6.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M8 6.5L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8 6.5V14" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8.01794 6.46971L2 4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        }
      />
    ),
    text: 'Integrations',
    href: '#/integrations',
  },
  // { type: 'divider' },
  // { type: 'link', icon: <Icon name="gen-ai" />, text: 'Amazon Q', href: '#/q' },
];

export const courtyardItems: SideNavigationProps.Item[] = [
  {
    type: 'link',
    icon: (
      <Icon
        svg={
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              className="filled no-stroke"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 1C0 0.447715 0.447715 0 1 0H5C5.55228 0 6 0.447715 6 1V5C6 5.55228 5.55228 6 5 6H1C0.447715 6 0 5.55228 0 5V1ZM2 2V4H4V2H2Z"
              fill="currentColor"
            ></path>
            <path
              className="filled no-stroke"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1 8C0.447715 8 0 8.44771 0 9V13C0 13.5523 0.447715 14 1 14H5C5.55228 14 6 13.5523 6 13V9C6 8.44771 5.55228 8 5 8H1ZM2 12V10H4V12H2Z"
              fill="currentColor"
            ></path>
            <path
              className="filled no-stroke"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 8C8.44771 8 8 8.44771 8 9V13C8 13.5523 8.44771 14 9 14H13C13.5523 14 14 13.5523 14 13V9C14 8.44771 13.5523 8 13 8H9ZM10 12V10H12V12H10Z"
              fill="currentColor"
            ></path>
            <path
              className="filled no-stroke"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9 0C8.44771 0 8 0.447715 8 1V5C8 5.55228 8.44771 6 9 6H13C13.5523 6 14 5.55228 14 5V1C14 0.447715 13.5523 0 13 0H9ZM10 4V2H12V4H10Z"
              fill="currentColor"
            ></path>
          </svg>
        }
      />
    ),
    text: 'Projects',
    href: '#/workspaces',
  },
  {
    type: 'link',
    icon: (
      <Icon
        svg={
          <svg width="16" height="16" viewBox="0 0 16.005 15.5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              className="filled no-stroke"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.255 0C2.46 0 1.005 1.455 1.005 3.25C1.005 5.045 2.46 6.5 4.255 6.5C6.05 6.5 7.505 5.045 7.505 3.25C7.505 1.455 6.05 0 4.255 0ZM3.005 3.25C3.005 2.56 3.565 2 4.255 2C4.945 2 5.505 2.56 5.505 3.25C5.505 3.94 4.945 4.5 4.255 4.5C3.565 4.5 3.005 3.94 3.005 3.25Z"
              fill="currentColor"
            ></path>
            <path
              className="filled no-stroke"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.005 6.25C8.005 4.455 9.46 3 11.255 3C13.05 3 14.505 4.455 14.505 6.25C14.505 8.045 13.05 9.5 11.255 9.5C9.46 9.5 8.005 8.045 8.005 6.25ZM11.255 5C10.565 5 10.005 5.56 10.005 6.25C10.005 6.94 10.565 7.5 11.255 7.5C11.945 7.5 12.505 6.94 12.505 6.25C12.505 5.56 11.945 5 11.255 5Z"
              fill="currentColor"
            ></path>
            <path
              className="filled no-stroke"
              d="M6.005 13.5C6.005 11.843 7.348 10.5 9.005 10.5H13.005C14.662 10.5 16.005 11.843 16.005 13.5V15.5H14.005V13.5C14.005 12.948 13.557 12.5 13.005 12.5H9.005C8.453 12.5 8.005 12.948 8.005 13.5V15.5H6.005V13.5Z"
              fill="currentColor"
            ></path>
            <path
              className="filled no-stroke"
              d="M0 10.495C0 8.835 1.345 7.49 3.005 7.49H6.794L7.091 7.935L7.096 7.943L8.142 9.5H3.005C2.455 9.5 2.01 9.945 2.01 10.495V13.495H0V10.495Z"
              fill="currentColor"
            ></path>
          </svg>
        }
      />
    ),
    text: 'Team',
    href: '#/team',
  },
  {
    type: 'link',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
    text: 'Billing',
    href: '#/billing',
  },
  {
    type: 'link',
    icon: (
      <Icon
        svg={
          <svg width="16" height="16" viewBox="0 0 640 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path
              className="filled no-stroke"
              d="M224 0a128 128 0 1 1 0 256A128 128 0 1 1 224 0zM178.3 304h91.4c11.8 0 23.4 1.2 34.5 3.3c-2.1 18.5 7.4 35.6 21.8 44.8c-16.6 10.6-26.7 31.6-20 53.3c4 12.9 9.4 25.5 16.4 37.6s15.2 23.1 24.4 33c15.7 16.9 39.6 18.4 57.2 8.7v.9c0 9.2 2.7 18.5 7.9 26.3H29.7C13.3 512 0 498.7 0 482.3C0 383.8 79.8 304 178.3 304zM436 218.2c0-7 4.5-13.3 11.3-14.8c10.5-2.4 21.5-3.7 32.7-3.7s22.2 1.3 32.7 3.7c6.8 1.5 11.3 7.8 11.3 14.8v17.7c7.9 3.4 15.4 7.7 22.3 12.8l15.2-8.8c6.1-3.5 13.8-2.7 18.6 2.5c7.7 8.4 14.4 17.9 19.9 28.4s9.4 21.3 12 32.1c1.6 6.8-1.9 13.8-8 17.3l-15.2 8.8c.3 4 .5 8.1 .5 12.3s-.2 8.2-.5 12.3l15.2 8.8c6.1 3.5 9.6 10.5 8 17.3c-2.6 10.8-6.6 21.7-12 32.1s-12.2 19.9-19.9 28.4c-4.8 5.2-12.5 6-18.6 2.5l-15.2-8.8c-6.9 5.1-14.3 9.4-22.3 12.8v17.7c0 7-4.5 13.3-11.3 14.8c-10.5 2.4-21.5 3.7-32.7 3.7s-22.2-1.3-32.7-3.7c-6.8-1.5-11.3-7.8-11.3-14.8V454.3c-8-3.4-15.6-7.7-22.5-12.9l-15.1 8.7c-6.1 3.5-13.8 2.7-18.6-2.5c-7.7-8.5-14.4-18-19.9-28.4s-9.4-21.3-12-32.1c-1.6-6.8 1.9-13.8 8-17.3l15.1-8.7c-.3-4.2-.5-8.3-.5-12.5s.2-8.3 .5-12.5l-15.1-8.7c-6.1-3.5-9.6-10.5-8-17.3c2.6-10.8 6.6-21.7 12-32.1s12.2-19.9 19.9-28.4c4.8-5.2 12.5-6 18.6-2.5l15.1 8.7c6.9-5.1 14.5-9.4 22.5-12.9V218.2zm92.1 133.5a48.1 48.1 0 1 0 -96.1 0 48.1 48.1 0 1 0 96.1 0z"
              fill="currentColor"
            ></path>
          </svg>
        }
      />
    ),
    text: 'Support',
    href: '#/support',
    external: true,
  },
];

export const bedrockItems: SideNavigationProps.Item[] = [
  {
    type: 'link',
    text: 'Home',
    href: '#/home',
    icon: (
      <Icon
        svg={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2 7L8 2L14 7V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V7Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M6 14V9H10V14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        }
      />
    ),
  },
  {
    type: 'link',
    text: 'Models',
    href: '#/models',
    icon: (
      <Icon
        svg={
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M3 13 Q1 13 1 9 Q1 2 8 2 Q15 2 15 9 Q15 13 13 13 L3 13Z"></path>
            <line x1="8" y1="2" x2="8" y2="13"></line>
            <path d="M4 6 Q5.5 5 5.5 7"></path>
            <path d="M3.5 10 Q5 9 5.5 11"></path>
            <path d="M12 6 Q10.5 5 10.5 7"></path>
            <path d="M12.5 10 Q11 9 10.5 11"></path>
          </svg>
        }
      />
    ),
  },
  {
    type: 'section-group',
    title: 'Project scope',
    items: [
      {
        type: 'link',
        text: 'Dashboard',
        href: '#/dashboard',
        icon: (
          <Icon
            svg={
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="1,8 4,8 5.5,4 7,12 8.5,6 10,9 11,8 15,8"></polyline>
              </svg>
            }
          />
        ),
      },
      {
        type: 'link',
        text: 'Evaluate',
        href: '#/evaluate',
        icon: (
          <Icon
            svg={
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 13 Q1 13 1 9 Q1 2 8 2 Q15 2 15 9 Q15 13 13 13 L3 13Z"></path>
                <line x1="8" y1="2" x2="8" y2="13"></line>
                <path d="M4 6 Q5.5 5 5.5 7"></path>
                <path d="M3.5 10 Q5 9 5.5 11"></path>
                <path d="M12 6 Q10.5 5 10.5 7"></path>
                <path d="M12.5 10 Q11 9 10.5 11"></path>
              </svg>
            }
          />
        ),
      },
      {
        type: 'link',
        text: 'Reservations',
        href: '#/reservations',
        icon: (
          <Icon
            svg={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"></rect>
                <path d="M2 6H14" stroke="currentColor" strokeWidth="1.5"></path>
                <circle cx="5" cy="9.5" r="0.75" fill="currentColor"></circle>
                <circle cx="8" cy="9.5" r="0.75" fill="currentColor"></circle>
                <circle cx="11" cy="9.5" r="0.75" fill="currentColor"></circle>
              </svg>
            }
          />
        ),
      },
      { type: 'link', text: 'Getting started', href: '#/getting-started', icon: <Icon name="status-info" /> },
      { type: 'link', text: 'Live API docs', href: '#/live-api-docs', icon: <Icon name="file" /> },
    ],
  },
  {
    type: 'section-group',
    title: 'Account scope',
    items: [
      { type: 'link', text: 'Account dashboard', href: '#/account-dashboard', icon: <Icon name="grid-view" /> },
      { type: 'link', text: 'Projects', href: '#/projects', icon: <Icon name="folder" /> },
      { type: 'link', text: 'API keys', href: '#/api-keys', icon: <Icon name="key" /> },
    ],
  },
  { type: 'divider' },
  {
    type: 'link',
    text: 'Bedrock Runtime Console',
    href: 'https://console.aws.amazon.com/bedrock',
    external: true,
  },
];

const ITEMS: SideNavigationProps.Item[] = [
  { type: 'link', icon: <Icon name="folder" />, text: 'Dashboard', href: '#/dashboard' },
  { type: 'link', icon: <Icon name="grid-view" />, text: 'Resources', href: '#/resources' },
  { type: 'link', icon: <Icon name="file" />, text: 'Reports', href: '#/reports' },
  {
    type: 'section',
    text: 'Navigation One',
    icon: <Icon name="envelope" />,
    items: [
      { type: 'link', text: 'Inbox', href: '#/inbox' },
      { type: 'link', text: 'Sent', href: '#/sent' },
      { type: 'link', text: 'Drafts', href: '#/drafts' },
      { type: 'link', text: 'Trash', href: '#/trash' },
    ],
  },
  {
    type: 'link-group',
    text: 'Navigation Two',
    icon: <Icon name="settings" />,
    href: '#/settings',
    items: [{ type: 'link', text: 'Billing', href: '#/billing' }],
  },
  {
    type: 'link-group',
    text: 'Navigation Two sans icon',
    href: '#/two',
    items: [{ type: 'link', text: 'Account', href: '#/account' }],
  },
  {
    type: 'expandable-link-group',
    text: 'Expandable link group',
    href: '#/exp-link-group-1',
    icon: <Icon name="folder-open" />,
    items: [
      { type: 'link', icon: <Icon name="file" />, text: 'Page 7', href: '#/page7' },
      { type: 'link', icon: <Icon name="file" />, text: 'Page 8', href: '#/page8' },
    ],
  },
  { type: 'divider' },
  {
    type: 'section-group',
    title: 'Section Group',
    icon: <Icon name="grid-view" />,
    items: [
      {
        type: 'link',
        icon: <Icon name="file-open" />,
        text: 'Overview',
        href: '#/overview',
      },
      {
        type: 'expandable-link-group',
        text: 'Expandable link group',
        href: '#/exp-link-group',
        items: [
          { type: 'link', icon: <Icon name="file" />, text: 'Page 9', href: '#/page9' },
          { type: 'link', icon: <Icon name="file" />, text: 'Page 10', href: '#/page10' },
        ],
      },
    ],
  },
  { type: 'divider' },
  // Demonstrates a custom React node (inline SVG) in place of an Icon component.
  { type: 'link', icon: CustomBoltSvg, text: 'Custom SVG icon', href: '#/custom' },
  // Demonstrates that the icon prop is optional.
  { type: 'link', text: 'No icon', href: '#/no-icon' },
];

export default function SideNavigationIconsPage() {
  const [activeHref, setActiveHref] = useState<string>('#/dashboard');
  const [activeOmegaHref, setActiveOmegaHref] = useState<string>('#/overview');
  const [activeCourtyardHref, setActiveCourtyardHref] = useState<string>('#/workspaces');

  const [expandIconPosition, setExpandIconPosition] = useState<SideNavigationProps.ExpandIconPosition>('start');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [variant, setVariant] = useState<SideNavigationProps.Variant>('highlighted');
  const [themeEnabled, setThemeEnabled] = useState<boolean>(true);
  const [itemHeight, setItemHeight] = useState(28);
  const [itemGap, setItemGap] = useState(2);

  useEffect(() => {
    if (themeEnabled) {
      console.log('theme set: ', themeCoreConfig);
      const { reset } = applyTheme({ theme: generateThemeConfigOneTheme() as any });
      return reset;
    }
  }, [themeEnabled]);

  const onFollow = useCallback((e: CustomEvent<SideNavigationProps.FollowDetail>, nav?: string) => {
    e.preventDefault();

    switch (nav) {
      case 'omega':
        setActiveOmegaHref(e.detail.href);
        break;
      case 'courtyard':
        setActiveCourtyardHref(e.detail.href);
        break;
      default:
        setActiveHref(e.detail.href);
        break;
    }
  }, []);

  return (
    <SimplePage
      title="Side navigation with new features"
      settings={
        <SpaceBetween direction="horizontal" size="l">
          <FormField label="Expand icon position" description="Controls the `expandIconPosition` prop">
            <RadioGroup
              value={expandIconPosition}
              onChange={({ detail }) => setExpandIconPosition(detail.value as SideNavigationProps.ExpandIconPosition)}
              items={[
                { value: 'start', label: 'Start' },
                { value: 'end', label: 'End' },
              ]}
            />
          </FormField>
          <FormField label="Collapsed" description="Renders only icons; hides text labels and child items.">
            <Toggle checked={collapsed} onChange={({ detail }) => setCollapsed(detail.checked)}>
              {collapsed ? 'On' : 'Off'}
            </Toggle>
          </FormField>
          <FormField label="Highlight variant" description="Controls the `variant` prop">
            <RadioGroup
              value={variant}
              onChange={({ detail }) => setVariant(detail.value as SideNavigationProps.Variant)}
              items={[
                { value: 'default', label: 'Default (text highlight)' },
                { value: 'highlighted', label: 'Highlighted (background fill)' },
              ]}
            />
          </FormField>
          <FormField label="One Theme" description="Applies the One Theme design tokens">
            <Toggle checked={themeEnabled} onChange={({ detail }) => setThemeEnabled(detail.checked)}>
              {themeEnabled ? 'On' : 'Off'}
            </Toggle>
          </FormField>
          <FormField label={`Item height: ${itemHeight}px`} description="Vertical size of each item row">
            <input
              type="range"
              min={20}
              max={44}
              value={itemHeight}
              onChange={e => setItemHeight(Number(e.target.value))}
            />
          </FormField>
          <FormField label={`Item gap: ${itemGap}px`} description="Vertical gap between items">
            <input type="range" min={0} max={12} value={itemGap} onChange={e => setItemGap(Number(e.target.value))} />
          </FormField>
        </SpaceBetween>
      }
      subtitle={<a href="#/light/side-navigation/layout-example">View layout example →</a>}
    >
      <style>{`
        [class*="list-item"] { margin-block: ${itemGap}px !important; }
        [class*="list-item"] > a { min-block-size: ${itemHeight}px !important; min-inline-size: ${itemHeight}px !important; }
        [class*="expandable-link-group"] > div:first-child {min-block-size: ${itemHeight}px !important; }
        [class*="section"] > div:first-child {min-block-size: ${itemHeight}px !important; }
        [class*="section-group-title"] { block-size: ${itemHeight}px !important; line-height: ${itemHeight}px !important; }
      `}</style>
      <SpaceBetween direction="horizontal" size="l">
        <div style={{ inlineSize: collapsed ? '64px' : '300px' }}>
          <SideNavigation
            activeHref={activeHref}
            header={{
              logo: {
                svg: collapsed ? (
                  <svg width="20" height="20" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M448 424V88c0-8.8-7.2-16-16-16s-16 7.2-16 16V424c0 8.8 7.2 16 16 16s16-7.2 16-16zM299.3 244.7l-192-192c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L265.4 256 84.7 436.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l192-192c6.2-6.2 6.2-16.4 0-22.6z"></path>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 448 512" fill="currentColor">
                    <path d="M0 424c0 8.8 7.2 16 16 16s16-7.2 16-16V88c0-8.8-7.2-16-16-16S0 79.2 0 88V424zM148.7 267.3l192 192c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L182.6 256 363.3 75.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0l-192 192c-6.2 6.2-6.2 16.4 0 22.6z"></path>
                  </svg>
                ),
              },
              href: '#/',
              text: 'Service name',
            }}
            items={ITEMS}
            expandIconPosition={expandIconPosition}
            collapsed={collapsed}
            variant={variant}
            onFollow={e => onFollow(e)}
          />
        </div>
        <div style={{ inlineSize: collapsed ? '64px' : '250px' }}>
          <SideNavigation
            activeHref={activeOmegaHref}
            items={omegaItems}
            expandIconPosition={expandIconPosition}
            collapsed={collapsed}
            variant={variant}
            onFollow={e => onFollow(e, 'omega')}
          />
        </div>
        <div style={{ inlineSize: collapsed ? '64px' : '250px' }}>
          <SideNavigation
            activeHref={activeCourtyardHref}
            items={courtyardItems}
            expandIconPosition={expandIconPosition}
            collapsed={collapsed}
            variant={variant}
            onFollow={e => onFollow(e, 'courtyard')}
          />
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
