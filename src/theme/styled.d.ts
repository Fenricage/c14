import { FlattenSimpleInterpolation } from 'styled-components';

export type Color = string
export interface Colors {
  white: Color
  black: Color
  violet: Color
  lgray: Color,
  dviolet: Color
  bviolet: Color
  bg: Color
  red: Color
  beige: Color
  primary1: Color
  primary1o: Color
  primary2: Color
  alt1: Color
  alt2: Color
  alt3: Color
  alt3o1: Color
  alt3o2: Color
  alt4: Color
  alt5: Color
  alt6: Color
}

export interface Grids {
  sm: number
  md: number
  lg: number
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {
    grids: Grids

    // shadows
    shadow1: string

    // media queries
    mediaWidth: {
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
      upToExtraLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
