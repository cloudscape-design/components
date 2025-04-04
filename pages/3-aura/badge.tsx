import React from 'react';
import Theme from '~components/theming/component/index';
import { Badge as CloudscapeBadge } from '~components';

export default function Badge(props: any) {
  return (
    <Theme
      backgroundImage="linear-gradient(120deg, #f8c7ff 20.08%, #d2ccff 75.81%)"
      borderRadius="4px"
      color="#161d26"
      fontSize="16px"
      fontFamily='"Amazon Ember Display", "Helvetica Neue", Helvetica, Arial, sans-serif'
      fontWeight="500"
      onDarkMode={{
        backgroundImage: "linear-gradient(120deg, #78008a 24.25%, #b2008f 69.56%)", 
        color: "#fff",
      }}
      paddingBlock="4px"
    >
      <CloudscapeBadge>{props.text}</CloudscapeBadge>
    </Theme>
  );
}