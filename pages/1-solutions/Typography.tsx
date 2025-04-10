// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ReactElement } from 'react';

import { Box, BoxProps } from '~components';
import Theme from '~components/theming/component';
import { ThemeProps } from '~components/theming/component/interfaces';

// API created based on the typography ramp defined in Figma: https://www.figma.com/design/jcbVR3w3C6BVhwYv6kv2A2/Hodgkin-Playground?node-id=8657-76841&t=EAkryAWWhtTcVsuY-1
type TextProps = {
  children: JSX.Element | string;
  size: SizeProps;
  gradient?: string;
  fontWeight?: string;
} & (HeadlineProps | TitleProps | LabelProps | BodyProps);

type SizeProps = 'large' | 'medium' | 'small';

interface HeadlineProps {
  tag?: 'div' | 'h1' | 'h2' | 'h3';
  type: 'headline';
}
interface TitleProps {
  tag?: 'div' | 'p' | 'h2' | 'h3' | 'h4' | 'h5';
  type: 'title';
}

interface LabelProps {
  tag?: 'div' | 'p' | 'h4' | 'h5';
  type: 'label';
}
interface BodyProps {
  tag?: 'div' | 'p';
  type: 'body';
}

export default function Typography({ children, size, tag, type, gradient, fontWeight }: TextProps): ReactElement {
  let variantMap: Record<string, BoxProps.Variant>;
  let defaultTag: string;
  let theme: ThemeProps;
  switch (type) {
    case 'headline':
      variantMap = {
        large: 'h1',
        medium: 'h2',
        small: 'h3',
      };
      defaultTag = variantMap[size];
      theme = { color: gradient || '#E1E3E3', fontWeight: fontWeight || '400', ...headlines[size] };
      break;
    case 'title':
      variantMap = {
        large: 'h2',
        medium: 'h3',
        small: 'h4',
      };
      defaultTag = variantMap[size];
      theme = { color: gradient || '#E1E3E3', fontWeight: fontWeight || '500', ...titles[size] };
      break;
    case 'label':
      variantMap = {
        large: 'div',
        medium: 'div',
        small: 'div',
      };
      defaultTag = 'div';
      theme = { color: gradient || '#BFC8CA', fontWeight: fontWeight || '500', ...labels[size] };
      break;
    case 'body':
      variantMap = {
        large: 'p',
        medium: 'p',
        small: 'small',
      };
      defaultTag = 'div';
      theme = { color: gradient || '#E1E3E3', fontWeight: fontWeight || '400', ...body[size] };
      break;
  }

  const TextContent = (
    // API addition #2: Added variant="awsui-gradient-text" to the Box component to enable gradient colored text.
    // Note: Made it a variant for simplicity. If actually changing the API, would probably consider making the "color" prop more open to allow for this instead.
    <Box variant={gradient ? 'awsui-gradient-text' : variantMap[size]} tagOverride={tag || defaultTag}>
      {children}
    </Box>
  );

  return <Theme {...theme}>{TextContent}</Theme>;
}

export const headlines = {
  large: {
    fontSize: '32px',
    lineHeight: '40px',
  },
  medium: {
    fontSize: '28px',
    lineHeight: '36px',
  },
  small: {
    fontSize: '24px',
    lineHeight: '32px',
  },
};

export const titles = {
  large: {
    fontSize: '22px',
    lineHeight: '28px',
  },
  medium: {
    fontSize: '20px',
    lineHeight: '26px',
  },
  small: {
    fontSize: '18px',
    lineHeight: '26px',
  },
};

export const labels = {
  large: {
    fontSize: '16px',
    lineHeight: '24px',
  },
  medium: {
    fontSize: '14px',
    lineHeight: '20px',
  },
  small: {
    fontSize: '12px',
    lineHeight: '16px',
  },
};

const body = {
  large: {
    fontSize: '16px',
    lineHeight: '24px',
  },
  medium: {
    fontSize: '14px',
    lineHeight: '20px',
  },
  small: {
    fontSize: '12px',
    lineHeight: '16px',
  },
};
