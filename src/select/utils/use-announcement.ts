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
  highlightText,
  announceSelected,
  highlightedOption,
  getParent,
  selectedAriaLabel,
  renderHighlightedAriaLive,
}: {
  highlightText?: string;
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
  // Note: We intentionally keep selectedAriaLabel in the live region announcement even though
  // we now use proper ARIA attributes (aria-selected, aria-checked, aria-multiselectable).
  // This is because NVDA and older versions of JAWS (e.g., 2022, still commonly used) have bugs
  // where they don't properly announce the selected state from ARIA attributes alone.
  // For newer screen readers (modern JAWS, VoiceOver), this results in redundant "Selected"
  // announcements, but this is preferable to the alternative where users hear "Selected"
  // followed by "Not Selected" due to missing ARIA attribute support.
  // See AWSUI-61639 for details.
  const selectedAnnouncement = announceSelected && selectedAriaLabel ? selectedAriaLabel : '';
  const defaultDescription = defaultOptionDescription({ option, parentGroup: group, highlightText });
  return [selectedAnnouncement, defaultDescription].filter(Boolean).join(' ');
}
