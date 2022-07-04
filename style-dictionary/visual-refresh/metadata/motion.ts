// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';

const metadata: StyleDictionary.MetadataIndex = {
  motionEasingResponsive: {
    description: 'The easing curve for providing responsive yet smooth visual feedback.',
    public: true,
    themeable: false,
  },
  motionEasingSticky: {
    description: 'The easing curve for making an element sticky to a certain state.',
    public: true,
    themeable: false,
  },
  motionEasingExpressive: {
    description: "The easing curve for drawing a user's attention in an expressive way.",
    public: true,
    themeable: false,
  },

  motionDurationResponsive: {
    description: 'The duration for making the motion feel quick and responsive.',
    public: true,
    themeable: false,
  },
  motionDurationExpressive: {
    description: 'The duration for accommodating the motion with more expressiveness.',
    public: true,
    themeable: false,
  },
  motionDurationComplex: {
    description: 'The duration for drawing more attention or accommodating for more complexity.',
    public: true,
    themeable: false,
  },

  motionKeyframesFadeIn: {
    description: 'The CSS keyframes for showing an element.',
    public: true,
    themeable: false,
  },
  motionKeyframesFadeOut: {
    description: 'The CSS keyframes for hiding an element.',
    public: true,
    themeable: false,
  },
  motionKeyframesScalePopup: {
    description: "The CSS keyframes for scaling up an element to draw the user's attention.",
    public: true,
    themeable: false,
    visualRefreshOnly: true,
  },
  motionKeyframesStatusIconError: {
    description: "The CSS keyframes applied to an error status icon to draw the user's attention.",
    public: true,
    themeable: false,
    visualRefreshOnly: true,
  },
};

export default metadata;
