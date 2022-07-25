import React, { useMemo, ReactNode } from 'react';
import { css, DefaultTheme, ThemeProvider as StyledComponentsThemeProvider } from 'styled-components/macro';
import { Colors } from './styled';

export const white = '#FFFFFF';
export const black = '#000000';
export const bg = white;

export const FORM_CONTROLS_LINE_HEIGHT = 20;

export const MEDIA_WIDTHS = {
  upToSmall: 575,
  upToMedium: 960,
  upToLarge: 1600,
  upToExtraLarge: 1960,
};

const mediaWidthTemplates: {
  [width in keyof typeof MEDIA_WIDTHS]: typeof css
} = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    (accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (min-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `;
    return accumulator;
  },
  {},
) as any;

export const lgray = '#EDEDED';
export const violet = '#783AFF';
export const dviolet = '#33334B';
export const bviolet = '#8047fa';
export const red = '#E23737';
export const beige = '#ECD2D2';
export const primary1 = '#fd7f3a';
export const primary1o = 'rgba(255,128,64,0.2)';
export const primary2 = '#ffe23c';
export const alt1 = '#fcb913';
export const alt2 = '#9cbccd';
export const alt3 = 'rgba(42,57,68,1)';
export const alt3o1 = 'rgba(42,57,68,.42)';
export const alt3o2 = 'rgba(42,57,68,.26)';
export const alt4 = 'rgb(104,146,169)';
export const alt5 = 'rgba(104,146,169,.75)';
export const alt6 = 'rgb(78,118,140)';

export function colors(): Colors {
  return {
    // base
    white,
    black,
    bg,
    alt4,
    lgray,
    violet,
    dviolet,
    bviolet,
    red,
    beige,
    primary1,
    primary1o,
    primary2,
    alt1,
    alt2,
    alt3,
    alt3o1,
    alt3o2,
    alt5,
    alt6,
  };
}

export function theme(): DefaultTheme & {breakpoints: string[]} {
  return {
    ...colors(),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    // medias
    mediaWidth: mediaWidthTemplates,

    // for rebass components, e.g. Flex
    breakpoints: Object.values(MEDIA_WIDTHS).map((v) => `${v}px`),

    // shadows
    shadow1: '#2F80ED',

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  };
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const themeObject = useMemo(() => theme(), []);

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>;
}
