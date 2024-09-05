import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function RadioButton({selected, label, onPress, style}) {
  return (
    <TouchableOpacity style={[style, styles.container]} onPress={onPress}>
      <View style={styles.radio}>
        {selected ? <View style={styles.checked} /> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  radio: {
    height: 20,
    width: 20,
    borderRadius: 100,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontWeight: 'semibold',
  },
  checked: {
    backgroundColor: 'blue',
    height: 16,
    width: 16,
    borderRadius: 100,
  },
  container: {flexDirection: 'row', alignItems: 'center'},
});
