import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import useSessionReminderNotificationsSetting from '../../notifications/hooks/useSessionReminderNotificationsSetting';
import useSessionReminderNotification from './useSessionReminderNotification';

const useConfirmSessionReminder = (session: LiveSessionType) => {
  const {t} = useTranslation('Component.ConfirmSessionReminder');
  const {toggleReminder} = useSessionReminderNotification(session);
  const {remindersEnabled, setRemindersEnabled} =
    useSessionReminderNotificationsSetting();

  const confirmToggleReminder = useCallback(
    async (enable: boolean) => {
      if (enable && remindersEnabled === undefined) {
        Alert.alert(t('title'), t('message'), [
          {
            text: t('actions.dismiss'),
            style: 'destructive',
            onPress: async () => {
              await setRemindersEnabled(false);
            },
          },
          {
            text: t('actions.cancel'),
          },
          {
            text: t('actions.confirm'),
            onPress: async () => {
              await setRemindersEnabled(true);
              await toggleReminder(true);
            },
          },
        ]);
      } else if (remindersEnabled) {
        await toggleReminder(enable);
      }
    },
    [t, remindersEnabled, setRemindersEnabled, toggleReminder],
  );

  return confirmToggleReminder;
};

export default useConfirmSessionReminder;
