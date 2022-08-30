import React, {useContext, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  DailyMediaView,
  DailyParticipant,
} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';

import {
  selectedParticipantId,
  videoSharingFields,
  participantsSelector,
  selectedParticipantSelector,
  templeAtom,
} from './state/state';
import {RouteProp, useRoute} from '@react-navigation/native';

import {Spacer12, Spacer28} from '../../common/components/Spacers/Spacer';
import {SPACINGS} from '../../common/constants/spacings';
import AudioToggleButton from './Buttons/AudioToggleButton';
import VideoToggleButton from './Buttons/VideoToggleButton';
import {COLORS} from '../../common/constants/colors';
import LeaveButton from './Buttons/LeaveButton';
import {B1} from '../../common/components/Typography/Text/Text';
import {ScreenProps} from '../../common/constants/routes';
import useTemple from './hooks/useTemple';
import {DailyContext} from './DailyProvider';
import {Temple} from '../../../../shared/src/types/Temple';

const LoadingView = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const VideoView = styled.View({
  aspectRatio: '1',
  backgroundColor: 'gray',
});

const ScreenView = styled.View({
  flex: 1,
  flexDirection: 'row',
});

const Spotlight = styled.View({
  flexGrow: 2,
  margin: SPACINGS.SIXTEEN,
});

const SpotlightVideo = styled.View({
  width: '100%',
  height: '50%',
});

const Participants = styled.View({
  width: '25%',
  borderLeftWidth: 1,
  borderLeftColor: COLORS.BLACK,
  borderLeftStyle: 'solid',
});

const MainViewContainer = styled.View({
  flex: 1,
  alignItems: 'center',
});

const Controls = styled.View({
  flexDirection: 'row',
});

const DailyMediaViewWrapper = styled(DailyMediaView)({
  height: '100%',
  width: '100%',
});

const TouchableMediaView = ({
  onPress,
  item,
}: {
  onPress: () => void;
  item: DailyParticipant;
}) => (
  <TouchableOpacity onPress={onPress}>
    <DailyMediaViewWrapper
      videoTrack={item.videoTrack ?? null}
      audioTrack={item.audioTrack ?? null}
      objectFit={'cover'}
      zOrder={item.local ? 1 : 0}
      mirror={item.local}
    />
  </TouchableOpacity>
);

const Content = ({state}: {state: Temple}) => (
  <B1>{JSON.stringify(state, null, 2)}</B1>
);

const Session = () => {
  const {
    prepareMeeting,
    leaveMeeting,
    startMeeting,
    toggleAudio,
    toggleVideo,
    hasAudio,
    hasVideo,
  } = useContext(DailyContext);
  const {
    params: {templeId},
  } = useRoute<RouteProp<ScreenProps, 'Temple'>>();

  const {subscribeTemple} = useTemple();

  const temple = useRecoilValue(templeAtom);
  const participants = useRecoilValue(participantsSelector);
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));
  const isJoined = useRecoilValue(videoSharingFields('isJoined'));
  const selectedParticipant = useRecoilValue(selectedParticipantSelector);
  const setSelectedParticipantId = useSetRecoilState(selectedParticipantId);

  useEffect(() => {
    if (temple?.url) {
      prepareMeeting(temple.url);
    }
  }, [temple?.url, prepareMeeting]);

  useEffect(() => {
    const unsubscribe = subscribeTemple(templeId);
    return unsubscribe;
  }, [prepareMeeting, subscribeTemple, templeId]);

  useEffect(() => {
    if (!isJoined) {
      return;
    }
    return leaveMeeting;
  }, [isJoined, leaveMeeting]);

  if (isLoading) {
    return (
      <LoadingView>
        <ActivityIndicator size="large" color={COLORS.BLACK} />
      </LoadingView>
    );
  }

  const renderVideo = ({item}: ListRenderItemInfo<DailyParticipant>) => (
    <VideoView>
      <TouchableMediaView
        onPress={() => setSelectedParticipantId(item.user_id)}
        item={item}
      />
    </VideoView>
  );

  return (
    <>
      <ScreenView>
        <MainViewContainer>
          <Spotlight>
            {temple?.active && !selectedParticipant && (
              <Content state={temple} />
            )}
            {selectedParticipant && (
              <SpotlightVideo>
                <TouchableMediaView
                  onPress={() => setSelectedParticipantId(null)}
                  item={selectedParticipant}
                />
              </SpotlightVideo>
            )}
          </Spotlight>
          <Controls>
            <AudioToggleButton onPress={toggleAudio} active={hasAudio} />
            <Spacer12 />
            <VideoToggleButton onPress={toggleVideo} active={hasVideo} />
            <Spacer12 />
            <LeaveButton
              onPress={participants.length === 0 ? startMeeting : leaveMeeting}
            />
          </Controls>
          <Spacer28 />
        </MainViewContainer>
        <Participants>
          <FlatList
            data={participants}
            keyExtractor={participant => participant.user_id}
            ItemSeparatorComponent={Spacer12}
            renderItem={renderVideo}
          />
        </Participants>
      </ScreenView>
    </>
  );
};

export default Session;
