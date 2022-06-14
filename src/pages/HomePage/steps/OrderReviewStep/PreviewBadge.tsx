import React, { FC } from 'react';
import styled from 'styled-components/macro';

type PreviewBadgeProps = {
  children: React.ReactNode;
  label: string;
}

const PreviewBadgeContainer = styled.div`
  padding: 12px 20px 12px 26px;
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
  background: ${({ theme }) => theme.alt4};
  border-radius: 16px;
`;

const PreviewBadgeLabel = styled.div`
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 6px;
  font-weight: 700;
`;

const PreviewBadgeContent = styled.div`

`;

const PreviewBadge: FC<PreviewBadgeProps> = (props) => {
  const {
    children,
    label,
  } = props;

  return (
    <PreviewBadgeContainer>
      <PreviewBadgeLabel>{label}</PreviewBadgeLabel>
      <PreviewBadgeContent>
        {children}
      </PreviewBadgeContent>
    </PreviewBadgeContainer>
  );
};

export default PreviewBadge;
