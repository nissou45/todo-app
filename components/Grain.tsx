import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Grain() {
  return (
    <View style={{
      ...StyleSheet.absoluteFillObject,
      opacity: 0.03,
      backgroundColor: '#2D3748',
      pointerEvents: 'none',
    }} />
  );
}
