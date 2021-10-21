import React from 'react';

import {
  ScrollView
} from 'react-native';
import { Message } from '../Message';

import { styles } from './styles';

const message = {
  id: '1',
  text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Incidunt laudantium illum magnam assumenda enim sint ut? Nemo, ipsa consequatur. Sunt, aperiam vitae. Veritatis possimus iste earum vel asperiores fugit dolorem.',
  user: {
    name: 'Usuário',
    avatar_url: 'https://randomuser.me/api/portraits/women/79.jpg'
  }
}

export function MessageList(){
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      <Message data={message} />
      <Message data={message} />
      <Message data={message} />
    </ScrollView>
  );
}