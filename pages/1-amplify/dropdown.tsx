import { ThemeProps } from '~components/theming/component/interfaces';
import { palette } from './theme';

export const Dropdown: ThemeProps = {
  backgroundColor:  {
    default: palette.white,
    hover: palette.neutral20,
    selected: palette.blue10,
  },
  borderColor: {
    default: palette.neutral60,
    hover: palette.neutral80,
    selected: palette.blue80,  
  },
  borderRadius: "4px",
  borderWidth: "1px",
  color: {
    default: palette.neutral90,
    hover: palette.neutral90,
    selected: palette.blue90, 
  },
  fill: {
    selected: palette.blue80,
  },
  fontSize: "16px",
  onDarkMode: {
    backgroundColor: {
      default: palette.neutral100,
      hover: palette.neutral90,
      selected: palette.neutral90
    },
    borderColor: {
      default: palette.neutral80,
      hover: palette.neutral80,
      selected: palette.neutral80,  
    },
    color: palette.white,
    fill: {
      selected: palette.teal30,
    },
  },
  paddingBlock: "8px",
  paddingInline: "16px",
};