import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const DetailsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the details screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#000',
  },
});

export default DetailsScreen;
