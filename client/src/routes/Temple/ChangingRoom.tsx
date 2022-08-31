import React, {useContext, useEffect} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import styled from 'styled-components/native';

import Button from '../../common/components/Buttons/Button';

import Gutters from '../../common/components/Gutters/Gutters';
import {BackIcon} from '../../common/components/Icons';
import {Spacer28, TopSafeArea} from '../../common/components/Spacers/Spacer';
import AudioToggleButton from '../Temple/Buttons/AudioToggleButton';
import VideoToggleButton from '../Temple/Buttons/VideoToggleButton';
import {B1} from '../../common/components/Typography/Text/Text';
import {COLORS} from '../../common/constants/colors';
import {DailyContext} from '../Temple/DailyProvider';
import {DailyMediaView} from '@daily-co/react-native-daily-js';
import {useRecoilValue} from 'recoil';
import {localParticipantAtom, templeAtom} from './state/state';
import {ROUTES, ScreenProps} from '../../common/constants/routes';
import useTemple from './hooks/useTemple';

const Back = styled.TouchableOpacity({
  width: 40,
  height: 40,
});

const Controls = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const Input = styled.TextInput({
  borderBottomWidth: 1,
  borderBottomColor: COLORS.GREY,
  paddingBottom: 2,
  paddingHorizontal: 2,
});

const DailyMediaViewWrapper = styled(DailyMediaView)({
  height: '50%',
  width: '100%',
});

const ChangingRoom = () => {
  const {goBack, navigate} = useNavigation();
  const {
    toggleAudio,
    toggleVideo,
    hasAudio,
    hasVideo,
    prepareMeeting,
    preJoinMeeting,
  } = useContext(DailyContext);

  const temple = useRecoilValue(templeAtom);
  const {
    params: {templeId},
  } = useRoute<RouteProp<ScreenProps, 'ChangingRoom'>>();

  const {subscribeTemple} = useTemple();

  useEffect(() => subscribeTemple(templeId), [subscribeTemple, templeId]);

  useEffect(() => {
    const startVideo = async () => {
      if (temple?.url) {
        await prepareMeeting(temple?.url);
        preJoinMeeting();
      }
    };
    startVideo();
  }, [prepareMeeting, preJoinMeeting, temple]);

  const me = useRecoilValue(localParticipantAtom);
  console.log('mememememeemmememememememem', me);
  return (
    <>
      <TopSafeArea />
      <Gutters>
        <Back onPress={goBack}>
          <BackIcon />
        </Back>
      </Gutters>

      {me && (
        <DailyMediaViewWrapper
          videoTrack={me.videoTrack ?? null}
          audioTrack={me.audioTrack ?? null}
          objectFit={'cover'}
          mirror={me.local}
        />
      )}

      <Spacer28 />
      <Gutters>
        <Controls>
          <AudioToggleButton onPress={toggleAudio} active={hasAudio} />
          <VideoToggleButton onPress={toggleVideo} active={hasVideo} />
        </Controls>
        <Spacer28 />
        <B1>Please type what do you like to be called</B1>
        <Spacer28 />
        <Input />
        <Spacer28 />
        <Button onPress={() => navigate(ROUTES.TEMPLE, {templeId})}>
          Join
        </Button>
      </Gutters>
    </>
  );
};

export default ChangingRoom;
