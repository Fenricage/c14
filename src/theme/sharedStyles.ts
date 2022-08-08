import { css } from 'styled-components/macro';

export const sharedBaseInputStyle = css`
  width: 100%;
  background-color: transparent;
  color: ${({ theme }) => theme.white};
  border: 0 solid transparent;
  outline: none;
  font-style: normal;
  font-family: "Inter",serif;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: -0.035em;
  padding: 0;
  
  &::placeholder {
    color: rgb(82, 120, 141);
  }
  
  &:disabled {
    opacity: .75;
  }
`;
