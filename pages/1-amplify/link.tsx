import React from 'react';
import { Link as CloudscapeLink } from '~components';
import Theme from '~components/theming/component/index';
import { palette } from './theme';

export default function Link(props: any) {
  return (
    <Theme color={palette.teal80}>
      <CloudscapeLink href="#" variant="primary">
        {props.children}
      </CloudscapeLink>
    </Theme>
  );
};