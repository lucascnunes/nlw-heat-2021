import React, { useEffect, useState } from 'react';

import {
  ScrollView
} from 'react-native';
import { io } from 'socket.io-client';
import { api } from '../../services/api';
import { MESSAGES_EXAMPLE } from '../../utils/messages';
import { Message, MessageProps } from '../Message';

import { styles } from './styles';

let messagesQueue: MessageProps[] = MESSAGES_EXAMPLE;

const socket = io(String(api.defaults.baseURL));
socket.on('new_message', (newMessage) => {
  messagesQueue.push(newMessage);
});

export function MessageList(){

  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    const checkQueue = setInterval(() => {
      if (messagesQueue.length > 0) {
        setCurrentMessages(prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1]
        ]);
        messagesQueue.shift();
      }
    }, 3000);

    return () => clearInterval(checkQueue);
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      const messagesResponse = await api.get<MessageProps[]>('/messages/last');
      setCurrentMessages(messagesResponse.data); 
    }

    fetchMessages();
  }, [])

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {currentMessages.map((message) => <Message key={message.id} data={message} /> )}
    </ScrollView>
  );
}