// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';

export interface HotspotProps extends BaseComponentProps {
  /**
   * ID of this hotspot. Use this ID in your tutorial data to refer to this
   * hotspot's location in your application. The ID must be unique
   * throughout your whole application.
   */
  hotspotId: string;

  /**
   * On which side of the content the hotspot icon should be displayed.
   */
  side?: 'left' | 'right';

  /**
   * The direction that the annotation popover should open in.
   * Change this property if in the default direction the annotation popover
   * overlaps too much with other content on the page.
   */
  direction?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * Content that should be wrapped by the hotspot icon. Optional.
   *
   * If you supply this property, the hotspot will wrap it in an element with
   * `flex: 1`, in order to give the children the maximum available space. The
   * hotspot icon will be placed floating next to the children. Use
   * this if you are wrapping e.g. an input field that should use the full
   * available width, or a button.
   *
   * If you do not supply this property, the hotspot icon will behave as an inline
   * element. Use this if you want to place the hotspot icon on a label, e.g. a
   * checkbox's label.
   */
  children?: React.ReactNode;
}
