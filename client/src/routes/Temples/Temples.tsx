import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, ListRenderItemInfo} from 'react-native';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import useTemples from '../../lib/temples/hooks/useTemples';
import {ROUTES, ScreenProps} from '../../common/constants/routes';

import {
  Spacer12,
  Spacer16,
  Spacer32,
  Spacer8,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {B1} from '../../common/components/Typography/Text/Text';
import {COLORS} from '../../common/constants/colors';
import {SPACINGS} from '../../common/constants/spacings';
import Gutters from '../../common/components/Gutters/Gutters';
import {H3} from '../../common/components/Typography/Heading/Heading';
import Button from '../../common/components/Buttons/Button';
import {Temple} from '../../lib/api/temple';

const LoadingView = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const Card = styled.TouchableOpacity({
  border: 0.1,
  borderColor: COLORS.BODY500,
  padding: SPACINGS.SIXTEEN,
  borderRadius: SPACINGS.TWELVE,
  backgroundColor: COLORS.WHITE_TRANSPARENT,
});

type ScreenNavigationProps = NativeStackNavigationProp<ScreenProps>;

const Temples = () => {
  const {fetchTemples, isLoading, addTemple, temples} = useTemples();

  const [newTemple, onChangeNewTemple] = useState<string | null>(null);
  const {navigate} = useNavigation<ScreenNavigationProps>();

  const renderRoom = ({item}: ListRenderItemInfo<Temple>) => (
    <Card
      onPress={() =>
        navigate(ROUTES.VIDEO, {templeId: item.id, url: item.url})
      }>
      <B1>{item.name}</B1>
    </Card>
  );

  const addNewTemple = useCallback(
    async roomName => {
      addTemple(roomName);
    },
    [addTemple],
  );

  useEffect(() => {
    fetchTemples();
  }, [fetchTemples]);

  if (isLoading) {
    return (
      <LoadingView>
        <ActivityIndicator size="large" color={COLORS.BLACK} />
      </LoadingView>
    );
  }

  return (
    <>
      <TopSafeArea />
      <Gutters>
        <H3>{'Temples'}</H3>
        <Spacer16 />
        <FlatList
          data={temples}
          keyExtractor={room => room.id}
          ItemSeparatorComponent={Spacer12}
          renderItem={renderRoom}
          refreshing={isLoading}
          onRefresh={fetchTemples}
        />
        <Spacer32 />
        <TextInput
          placeholder="Room name..."
          onChangeText={onChangeNewTemple}
        />
        <Spacer8 />
        <Button onPress={() => addNewTemple(newTemple)}>
          <B1>{'Create room'}</B1>
        </Button>
      </Gutters>
    </>
  );
};

export default Temples;
