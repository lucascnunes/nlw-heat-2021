import React, { useState } from 'react';

import {
  Alert,
  Keyboard,
  TextInput,
  View
} from 'react-native';

import { api } from '../../services/api';
import { COLORS } from '../../theme';
import { Button } from '../Button';

import { styles } from './styles';

export function SendMessageForm(){
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  async function handleMessageSubmit() {
    const messageFormatted = message.trim();

    if (messageFormatted.length > 0) {
      setSendingMessage(true);
      await api.post('messages', { message: messageFormatted });
      setMessage('');
      Keyboard.dismiss();
      Alert.alert('Mensagem enviada com sucesso');
      setSendingMessage(false);
    } else {
      Alert.alert('Escreva uma mensagem para ser enviada');
    }
  }

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input}
        keyboardAppearance="dark"
        placeholder="Qual sua expectativa para o evento?"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        multiline={true}
        maxLength={140}
        onChangeText={setMessage}
        value={message}
        editable={!sendingMessage}
       />
      <Button 
        title="Enviar mensagem" 
        color={COLORS.WHITE}
        backgroundColor={COLORS.PINK}
        isLoading={sendingMessage}
        onPress={handleMessageSubmit}
      />
    </View>
  );
}