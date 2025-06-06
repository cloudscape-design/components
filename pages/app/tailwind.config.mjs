import * as tokens from '../../lib/design-tokens';

export default {
  content: ['./**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: tokens.colorTextAccent,
        body: {
          DEFAULT: tokens.colorTextBodyDefault,
          secondary: tokens.colorTextBodySecondary,
        },
        heading: tokens.colorTextHeadingDefault,
        link: {
          DEFAULT: tokens.colorTextLinkDefault,
          hover: tokens.colorTextLinkHover,
        },
        form: {
          DEFAULT: tokens.colorTextFormDefault,
          hover: tokens.colorTextFormSecondary,
        },
        error: tokens.colorTextStatusError,
        success: tokens.colorTextStatusSuccess,
        warning: tokens.colorTextStatusWarning,
        info: tokens.colorTextStatusInfo,
      }
    },
    spacing: {
      xxxs: tokens.spaceScaledXxxs,
      xxs: tokens.spaceScaledXxs,
      l: tokens.spaceScaledL,
      xxxl: tokens.spaceScaledXxxl
    },
  }
}