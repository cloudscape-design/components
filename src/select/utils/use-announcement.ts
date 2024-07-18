// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef } from 'react';

import { OptionDefinition, OptionGroup } from '../../internal/components/option/interfaces';
import defaultOptionDescription from '../../internal/components/option/option-announcer';
import { SelectProps } from '../interfaces';

interface OptionHolder {
  option?: OptionDefinition | OptionGroup;
}

/**
 * The hook produces the live region string to be announced when an option is highlighted.
 * This is a workaround to account for the issues with assistive technologies.
 *
 * If the testing reveals no issues with the native announcements the live-region can be removed.
 */
export function useAnnouncement<Option extends OptionHolder>({
  announceSelected,
  highlightedOption,
  getParent,
  selectedAriaLabel,
  renderHighlightedAriaLive,
}: {
  announceSelected: boolean;
  highlightedOption?: Option;
  getParent: (option: Option) => undefined | OptionGroup;
  selectedAriaLabel?: string;
  renderHighlightedAriaLive?: SelectProps.ContainingOptionAndGroupString;
}) {
  const prevAnnouncedGroup = useRef<OptionGroup | undefined>(undefined);

  // Record previously announced group with a delay to account for possible re-renders of the hook.
  useEffect(() => {
    if (highlightedOption) {
      const frameId = requestAnimationFrame(() => {
        prevAnnouncedGroup.current = getParent(highlightedOption);
      });
      return () => cancelAnimationFrame(frameId);
    }
  });

  if (!highlightedOption) {
    return '';
  }

  const option = highlightedOption.option as OptionDefinition;
  const parent = getParent(highlightedOption);
  // Only announce parent group if it wasn't announced with previous option.
  const group = parent && parent !== prevAnnouncedGroup.current ? parent : undefined;

  // Use custom renderer if provided.
  if (renderHighlightedAriaLive) {
    return renderHighlightedAriaLive(option, group);
  }

  // Use default renderer with selected ARIA label if defined and relevant.
  const selectedAnnouncement = announceSelected && selectedAriaLabel ? selectedAriaLabel : '';
  const defaultDescription = defaultOptionDescription(option, group);
  return [selectedAnnouncement, defaultDescription].filter(Boolean).join(' ');
}
