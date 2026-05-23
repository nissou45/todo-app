import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Todo } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  } as any),
});

export const useNotifications = () => {
  const registerForPushNotificationsAsync = async () => {
    if (!Device.isDevice) {
      console.log('Must use physical device for push notifications');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  const scheduleTodoNotification = async (todo: Todo) => {
    if (!todo.dueDate || !todo.reminderEnabled || todo.completed) {
      await cancelTodoNotification(todo.id);
      return;
    }

    const trigger = new Date(todo.dueDate);
    
    // Si la date est passée, on ne planifie rien
    if (trigger.getTime() <= Date.now()) {
      return;
    }

    await cancelTodoNotification(todo.id);

    await Notifications.scheduleNotificationAsync({
      identifier: todo.id,
      content: {
        title: 'Rappel de tâche 🔔',
        body: todo.text,
        data: { todoId: todo.id },
      },
      trigger: trigger as any,
    });
  };

  const cancelTodoNotification = async (todoId: string) => {
    await Notifications.cancelScheduledNotificationAsync(todoId);
  };

  return {
    registerForPushNotificationsAsync,
    scheduleTodoNotification,
    cancelTodoNotification,
  };
};
