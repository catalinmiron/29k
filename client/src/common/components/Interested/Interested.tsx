import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {StarIcon} from '../Icons';
import {BodyBold} from '../Typography/Body/Body';

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const StarIconWrapper = styled.View({
  width: 22,
  height: 22,
  alignSelf: 'center',
});

type InterestedProps = {
  active: boolean;
};

const Body = styled(BodyBold)<InterestedProps>(({active}) => ({
  color: active ? COLORS.PRIMARY : COLORS.GREYDARK,
}));

const Interested: React.FC<InterestedProps> = ({active}) => {
  const {t} = useTranslation('Component.Interested');
  return (
    <Container>
      <StarIconWrapper>
        <StarIcon fill={active ? COLORS.PRIMARY : COLORS.GREYDARK} />
      </StarIconWrapper>
      <Body active={active}>{t('text')}</Body>
    </Container>
  );
};

export default Interested;
