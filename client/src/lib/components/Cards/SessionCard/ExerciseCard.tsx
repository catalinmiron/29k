import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import {ModalStackProps} from '../../../navigation/constants/routes';
import {formatContentName} from '../../../utils/string';
import CardSmall from '../CardSmall';
import {ViewStyle} from 'react-native';

type ExerciseCardContainerProps = {
  exercise: Exercise;
  onPress?: () => void;
  style?: ViewStyle;
};

const ExerciseCard: React.FC<ExerciseCardContainerProps> = ({
  exercise,
  onPress = () => {},
  style,
}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  const onPressHandle = useCallback(() => {
    onPress();
    navigate('CreateSessionModal', {exerciseId: exercise.id});
  }, [exercise, onPress, navigate]);

  if (!exercise) {
    return null;
  }

  return (
    <CardSmall
      title={formatContentName(exercise)}
      graphic={exercise?.card}
      onPress={onPressHandle}
      style={style}
    />
  );
};

export default React.memo(ExerciseCard);
