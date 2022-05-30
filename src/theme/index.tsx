import React, { useMemo, ReactNode } from 'react';
import { css, DefaultTheme, ThemeProvider as StyledComponentsThemeProvider } from 'styled-components/macro';
import { Colors } from './styled';

const sizes = {
  large: 1440,
  desktop: 1024,
  small: 600,
  medium: 768,
};

export const sizePx = {
  desktop: `${sizes.desktop}px`,
  large: `${sizes.large}px`,
  small: `${sizes.small}px`,
  medium: `${sizes.medium}px`,
};

export const device = {
  desktop: `(min-width: ${sizePx.desktop})`,
  large: `(min-width: ${sizePx.large})`,
  small: `(min-width: ${sizePx.small})`,
  medium: `(min-width: ${sizePx.medium})`,
};

const white = '#FFFFFF';
const black = '#000000';
export const bg = white;

export const MEDIA_WIDTHS = {
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

export function colors(): Colors {
  return {
    // base
    white,
    black,
    lgray: '#EDEDED',
    bg,
    violet: '#783AFF',
    dviolet: '#33334B',
    bviolet: '#8047fa',
    red: '#E23737',
    beige: '#ECD2D2',
    primary1: '#fd7f3a',
    primary1o: 'rgba(255,128,64,0.2)',
    primary2: '#ffe23c',
    alt1: '#fcb913',
    alt2: '#9cbccd',
    alt3: 'rgba(42,57,68,1)',
    alt3o1: 'rgba(42,57,68,.42)',
    alt3o2: 'rgba(42,57,68,.26)',
    alt4: 'rgb(104,146,169)',
    alt5: 'rgba(104,146,169,.75)',
  };
}

export function theme(): DefaultTheme {
  return {
    ...colors(),

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    // medias
    mediaWidth: mediaWidthTemplates,

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
