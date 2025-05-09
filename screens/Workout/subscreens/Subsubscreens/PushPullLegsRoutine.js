import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PushPullLegsRoutine = () => {
  return (
    <View style={styles.container}>
      <Text>Push Pull Legs Routine</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

export default PushPullLegsRoutine;
