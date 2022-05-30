import React, { FC } from 'react';
import styled from 'styled-components/macro';
import logo from '../../assets/logo_2.png';

const StyledLogo = styled.img`
  width: 128px;
`;

const LogoContainer = styled.div`

`;

const Logo: FC = () => (
  <LogoContainer>
    <StyledLogo src={logo} />
  </LogoContainer>
);

export default Logo;
