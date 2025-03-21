import React from 'react';
import { Table as CloudscapeTable } from '~components';
import Theme from '~components/theming/component/index';
import { theme as selectionControlTheme } from './checkbox-field';
import { palette } from './theme';

export default function Table(props: any) {
  return (
    <Theme
      backgroundColor={backgroundColors}
      borderColor={borderColors}
      borderRadius="4px"
      borderWidth="1px"
      paddingBlock="12px"
    >
      <CloudscapeTable
        onSelectionChange={props.onSelectionChange}
        selectedItems={props.selectedItems}
        columnDefinitions={props.columnDefinitions}
        columnDisplay={props.columnDisplay}
        items={props.items}
        selectionType={props.selectionType}
        theme={{
          selectionControl: selectionControlTheme,
        }}
        trackBy={props.trackBy}
        variant={props.variant}
      />
    </Theme>
  );
};

const backgroundColors = {
  selected: palette.teal10,
};

const borderColors = {
  default: palette.neutral40, 
  selected: palette.teal80
};
