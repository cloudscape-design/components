// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CustomHandler } from '../i18n/context';
import { I18nFormatArgTypes } from '../i18n/messages-types';
import { TabsProps } from './interfaces';

export const formatTabReorderStarted: CustomHandler<
  TabsProps.I18nStrings['liveAnnouncementReorderStarted'],
  I18nFormatArgTypes['tabs']['i18nStrings.liveAnnouncementReorderStarted']
> = format => (position, total) => format({ position, total });

export const formatTabReorderMoved: CustomHandler<
  TabsProps.I18nStrings['liveAnnouncementReorderMoved'],
  I18nFormatArgTypes['tabs']['i18nStrings.liveAnnouncementReorderMoved']
> = format => (initialPosition, currentPosition, total) =>
  format({ currentPosition, total, isInitialPosition: `${initialPosition === currentPosition}` });

export const formatTabReorderCommitted: CustomHandler<
  TabsProps.I18nStrings['liveAnnouncementReorderCommitted'],
  I18nFormatArgTypes['tabs']['i18nStrings.liveAnnouncementReorderCommitted']
> = format => (initialPosition, finalPosition, total) =>
  format({
    initialPosition,
    finalPosition,
    total,
    isInitialPosition: `${initialPosition === finalPosition}`,
  });

export const formatTabMovedAcrossLists: CustomHandler<
  TabsProps.I18nStrings['liveAnnouncementTabMovedAcrossLists'],
  I18nFormatArgTypes['tabs']['i18nStrings.liveAnnouncementTabMovedAcrossLists']
> = format => (targetPosition, targetTotal) => format({ targetPosition, targetTotal });
