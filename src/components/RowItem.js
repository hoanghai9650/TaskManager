import {useNavigation} from '@react-navigation/native';
import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import Animated from 'react-native-reanimated';
import {priorityOptions, statusOptions} from '../utils/constant';

const RowItem = memo(
  ({
    id,
    title,
    description,
    dueDate,
    status,
    priority,
    image,
    width,
    order,
  }) => {
    const navigate = useNavigation();
    console.log('hello');
    return (
      <TouchableOpacity
        testID={`row-item-${id}`}
        key={id.toString()}
        style={[styles.row]}
        onPress={() =>
          navigate.navigate('AddOrEditTask', {
            id: id,
            title: title,
            description: description,
            dueDate: dueDate,
            status: status,
            priority: priority,
            image: image,
          })
        }>
        <Animated.View style={[width[0], styles.headerCell, order[0]]}>
          <Text style={styles.text}>{title}</Text>
        </Animated.View>
        <Animated.View style={[width[1], styles.headerCell, order[1]]}>
          <Text style={styles.text}>{description}</Text>
        </Animated.View>
        <Animated.View style={[width[2], styles.headerCell, order[2]]}>
          <Text style={styles.text}>
            {new Date(dueDate).toLocaleDateString('en-US')}
          </Text>
        </Animated.View>
        <Animated.View style={[width[4], styles.headerCell, order[4]]}>
          <Text style={styles.text}>{statusOptions[status]}</Text>
        </Animated.View>
        <Animated.View style={[width[3], styles.headerCell, order[3]]}>
          <Text style={styles.text}>{priorityOptions[priority]}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  },
);
export default RowItem;
const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  headerRow: {flexDirection: 'row', height: 40, backgroundColor: '#f1f8ff'},
  row: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  headerCellContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  headerCell: {
    justifyContent: 'center',
    backgroundColor: '#f1f8ff',
    position: 'absolute',
  },
  headerText: {margin: 6, fontWeight: 'bold', textAlign: 'center'},
  cellContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    position: 'relative',
  },
  cell: {
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  text: {margin: 6, textAlign: 'center'},
  resizeHandle: {
    width: 5,
    backgroundColor: '#ccc',
    cursor: 'ew-resize',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
});
