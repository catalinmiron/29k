import React, {useCallback, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';

import {
  CompletedSessionEvent,
  PostEvent,
} from '../../../../../../shared/src/types/Event';
import {
  SessionMode,
  SessionType,
} from '../../../../../../shared/src/schemas/Session';
import Badge from '../../../../lib/components/Badge/Badge';
import Byline from '../../../../lib/components/Bylines/Byline';
import {
  CommunityIcon,
  FriendsIcon,
  MeIcon,
} from '../../../../lib/components/Icons';
import {
  Spacer16,
  Spacer4,
  Spacer8,
} from '../../../../lib/components/Spacers/Spacer';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {Display16} from '../../../../lib/components/Typography/Display/Display';
import {SPACINGS} from '../../../../lib/constants/spacings';
import useExerciseById from '../../../../lib/content/hooks/useExerciseById';
import {ModalStackProps} from '../../../../lib/navigation/constants/routes';
import useUserProfile from '../../../../lib/user/hooks/useUserProfile';
import Node from '../../../../lib/components/Node/Node';
import useGetFeedbackBySessionId from '../../../../lib/user/hooks/useGetFeedbackBySessionId';
import {
  ThumbsUpWithoutPadding,
  ThumbsDownWithoutPadding,
} from '../../../../lib/components/Thumbs/Thumbs';
import SharingPostCard from '../../../../lib/components/PostCard/SharingPostCard';

export const HEIGHT = 93;
export const HEIGHT_WITH_POST = 214;
const NODE_SIZE = 16;

type JourneyNodeProps = {
  completedSessionEvent: CompletedSessionEvent & {sharingPost?: PostEvent};
  isFirst: boolean;
  isLast: boolean;
};

const Row = styled.View({
  flexDirection: 'row',
});

const Column = styled.View({
  width: '100%',
});

const Container = styled(TouchableOpacity)<
  Pick<JourneyNodeProps, 'isFirst'> & {height?: number}
>(({isFirst, height}) => ({
  flexDirection: 'row',
  height: height ?? HEIGHT,
  marginBottom: isFirst ? -SPACINGS.FOUR : 0,
  overflow: 'visible',
}));

const ContentContainer = styled.View<Pick<JourneyNodeProps, 'isFirst'>>({
  marginLeft: SPACINGS.FOUR,
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Line = styled.View<
  Pick<JourneyNodeProps, 'isLast' | 'isFirst'> & {height?: number}
>(({isLast, isFirst, height}) => ({
  position: 'absolute',
  left: NODE_SIZE / 2 - 1,
  width: 2,
  height: isLast ? SPACINGS.SIXTEEN : height ?? HEIGHT,
  backgroundColor: COLORS.MEDIUM_DARK_GREEN,
  marginTop: isFirst ? SPACINGS.SIXTEEN : 0,
}));

const Spacer2 = styled.View({height: 2});

const ThumbsUp = styled(ThumbsUpWithoutPadding)({
  position: 'static',
  width: 22,
  aspectRatio: 1,
});

const ThumbsDown = styled(ThumbsDownWithoutPadding)({
  position: 'static',
  width: 22,
  aspectRatio: 1,
});

const NodeContainer = styled.View<{isFirst: boolean}>({
  marginTop: 15,
});

const PostWrapper = styled.View({
  height: 120,
});

const JourneyNode: React.FC<JourneyNodeProps> = ({
  completedSessionEvent,
  isFirst = false,
  isLast = false,
}) => {
  const {
    payload: {id, mode, exerciseId, hostId, type, language},
    timestamp,
    sharingPost,
  } = completedSessionEvent;
  const exercise = useExerciseById(exerciseId, language);
  const hostProfile = useUserProfile(hostId);
  const getFeedbackBySessionId = useGetFeedbackBySessionId();

  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<ModalStackProps, 'CompletedSessionModal'>
    >();

  const openCompleteSessionModal = useCallback(
    () =>
      navigate('CompletedSessionModal', {
        completedSessionEvent,
      }),
    [navigate, completedSessionEvent],
  );

  const feedback = useMemo(
    () => getFeedbackBySessionId(id),
    [id, getFeedbackBySessionId],
  );

  if (!exercise) {
    return null;
  }

  return (
    <Container
      onPress={openCompleteSessionModal}
      isFirst={isFirst}
      height={sharingPost && HEIGHT_WITH_POST}>
      <Line
        isLast={isLast}
        isFirst={isFirst}
        height={sharingPost && HEIGHT_WITH_POST}
      />
      <NodeContainer isFirst={isFirst}>
        <Node size={NODE_SIZE} />
      </NodeContainer>
      <ContentContainer isFirst={isFirst}>
        <Column>
          <Row>
            <Badge
              text={dayjs(timestamp).format('ddd, D MMM HH:mm')}
              IconAfter={
                mode === SessionMode.async ? (
                  <MeIcon />
                ) : type === SessionType.private ? (
                  <FriendsIcon />
                ) : (
                  <CommunityIcon />
                )
              }
              completed
            />
            <Spacer4 />
            {feedback &&
              (feedback.payload.answer ? <ThumbsUp /> : <ThumbsDown />)}
          </Row>
          <Spacer8 />
          {exercise?.name && (
            <Display16 numberOfLines={1}>{exercise.name}</Display16>
          )}
          <Spacer2 />
          {!hostProfile?.photoURL && <Spacer16 />}
          <Byline
            small
            pictureURL={hostProfile?.photoURL}
            name={hostProfile?.displayName}
          />
          {sharingPost && (
            <PostWrapper>
              <SharingPostCard sharingPost={sharingPost} clip />
            </PostWrapper>
          )}
        </Column>
      </ContentContainer>
    </Container>
  );
};

export default JourneyNode;
