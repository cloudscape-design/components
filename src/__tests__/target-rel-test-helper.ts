// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface ButtonProps {
  href: undefined | string;
  target: undefined | string;
  rel: undefined | string;
}

export interface LinkProps extends ButtonProps {
  external: boolean;
}

export const buttonTargetExpectations: [props: ButtonProps, expectedTarget: undefined | string][] = [
  [{ href: undefined, target: 'custom', rel: undefined }, undefined],
  [{ href: '#', target: undefined, rel: undefined }, undefined],
  [{ href: '#', target: 'custom', rel: undefined }, 'custom'],
];

export const buttonRelExpectations: [props: ButtonProps, expectedTarget: undefined | string][] = [
  [{ href: undefined, target: '_blank', rel: undefined }, undefined],
  [{ href: '#', target: 'custom', rel: undefined }, undefined],
  [{ href: '#', target: '_blank', rel: undefined }, 'noopener noreferrer'],
  [{ href: '#', target: undefined, rel: 'custom' }, 'custom'],
  [{ href: '#', target: '_blank', rel: 'custom' }, 'custom'],
];

export const linkTargetExpectations: [props: LinkProps, expectedTarget: undefined | string][] = [
  [{ href: undefined, external: false, target: 'custom', rel: undefined }, undefined],
  [{ href: '#', external: false, target: undefined, rel: undefined }, undefined],
  [{ href: '#', external: true, target: undefined, rel: undefined }, '_blank'],
  [{ href: '#', external: false, target: 'custom', rel: undefined }, 'custom'],
  [{ href: '#', external: true, target: 'custom', rel: undefined }, 'custom'],
];

export const linkRelExpectations: [props: LinkProps, expectedRel: undefined | string][] = [
  [{ href: undefined, external: false, target: undefined, rel: 'custom' }, undefined],
  [{ href: '#', external: false, target: undefined, rel: undefined }, undefined],
  [{ href: '#', external: true, target: undefined, rel: undefined }, 'noopener noreferrer'],
  [{ href: '#', external: false, target: 'custom', rel: undefined }, undefined],
  [{ href: '#', external: false, target: '_blank', rel: undefined }, 'noopener noreferrer'],
  [{ href: '#', external: true, target: undefined, rel: 'custom' }, 'custom'],
  [{ href: '#', external: false, target: '_blank', rel: 'custom' }, 'custom'],
];
