import React, {forwardRef, useCallback, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  FlatList,
  GestureDetector,
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, {useSharedValue} from 'react-native-reanimated';
import {useGesture} from '../hooks/useGesture';
import {useGestureResize} from '../hooks/useGestureResize';
import {getInitialPositions, header} from '../utils/constant';
import RowItem from './RowItem';

const ResizeList = forwardRef(({tasks, loadMore}, ref) => {
  //will hold the task's width in list at every moment
  const width1 = useSharedValue(100);
  const width2 = useSharedValue(100);
  const width3 = useSharedValue(100);
  const width4 = useSharedValue(100);
  const width5 = useSharedValue(100);

  const currentTaskPositions = useSharedValue(getInitialPositions());

  //will hold the task's animated width in liar
  const {animatedStyles: resizeAnimatedStyles, resizeGesture} =
    useGestureResize(width1, header[0], currentTaskPositions);
  const {animatedStyles: resizeAnimatedStyles1, resizeGesture: resizeGesture1} =
    useGestureResize(width2, header[1], currentTaskPositions);
  const {animatedStyles: resizeAnimatedStyles2, resizeGesture: resizeGesture2} =
    useGestureResize(width3, header[2], currentTaskPositions);
  const {animatedStyles: resizeAnimatedStyles3, resizeGesture: resizeGesture3} =
    useGestureResize(width4, header[3], currentTaskPositions);
  const {animatedStyles: resizeAnimatedStyles4, resizeGesture: resizeGesture4} =
    useGestureResize(width5, header[4], currentTaskPositions);

  const widths = useMemo(
    () => [
      resizeAnimatedStyles,
      resizeAnimatedStyles1,
      resizeAnimatedStyles2,
      resizeAnimatedStyles3,
      resizeAnimatedStyles4,
    ],
    [
      resizeAnimatedStyles,
      resizeAnimatedStyles1,
      resizeAnimatedStyles2,
      resizeAnimatedStyles3,
      resizeAnimatedStyles4,
    ],
  );
  const resizeGestures = [
    resizeGesture,
    resizeGesture1,
    resizeGesture2,
    resizeGesture3,
    resizeGesture4,
  ];

  //used to know if drag is happening or not
  const isDragging = useSharedValue(0);

  //this will hold id for item which user started dragging
  const draggedItemId = useSharedValue(null);

  //calculate the order of the task
  const {animatedStyles, gesture} = useGesture(
    width1,
    header[0],
    isDragging,
    draggedItemId,
    currentTaskPositions,
  );
  const {animatedStyles: animatedStyles2, gesture: gesture2} = useGesture(
    width2,
    header[1],
    isDragging,
    draggedItemId,
    currentTaskPositions,
  );
  const {animatedStyles: animatedStyles3, gesture: gesture3} = useGesture(
    width3,
    header[2],
    isDragging,
    draggedItemId,
    currentTaskPositions,
  );
  const {animatedStyles: animatedStyles4, gesture: gesture4} = useGesture(
    width4,
    header[3],
    isDragging,
    draggedItemId,
    currentTaskPositions,
  );
  const {animatedStyles: animatedStyles5, gesture: gesture5} = useGesture(
    width5,
    header[4],
    isDragging,
    draggedItemId,
    currentTaskPositions,
  );
  const gestures = [gesture, gesture2, gesture3, gesture4, gesture5];
  const animatedStyle = useMemo(
    () => [
      animatedStyles,
      animatedStyles2,
      animatedStyles3,
      animatedStyles4,
      animatedStyles5,
    ],
    [
      animatedStyles,
      animatedStyles2,
      animatedStyles3,
      animatedStyles4,
      animatedStyles5,
    ],
  );

  const renderItem = useCallback(
    ({item}) => {
      return (
        <RowItem
          id={item.id}
          title={item.title}
          description={item.description}
          dueDate={item.dueDate}
          status={item.status}
          priority={item.priority}
          image={item.image}
          width={widths}
          order={animatedStyle}
        />
      );
    },
    [widths, animatedStyle],
  );

  const handleEndReached = () => {
    if (tasks.length < 10) {
      return;
    }
    loadMore();
  };

  return (
    <GestureHandlerRootView>
      <ScrollView horizontal>
        <View>
          {/* render Header */}
          <View style={styles.headerRow}>
            {header.map((item, index) => (
              <Animated.View
                // id={index}
                key={item.id}
                style={[
                  widths[index],
                  styles.headerCell,
                  animatedStyle[index],
                ]}>
                <GestureDetector gesture={resizeGestures[index]}>
                  <Animated.View style={styles.resizeHandle} />
                </GestureDetector>
                <Text style={styles.headerText}>{item.title}</Text>
                <GestureDetector gesture={gestures[index]}>
                  <Animated.View style={styles.dragHandle} />
                </GestureDetector>
              </Animated.View>
            ))}
          </View>
          <View>
            <FlatList
              data={tasks}
              ref={ref}
              style={styles.list}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              scrollEventThrottle={16}
              maxToRenderPerBatch={20}
              onEndReachedThreshold={0.001}
              onEndReached={handleEndReached}
            />
          </View>
        </View>
      </ScrollView>
      {/* render content*/}
    </GestureHandlerRootView>
  );
});
export default ResizeList;
const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  headerRow: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#f1f8ff',
    width: 100 * header.length,
  },
  row: {flexDirection: 'row', height: 40, alignItems: 'center'},
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
    width: 10,
    backgroundColor: '#ccc',
    cursor: 'ew-resize',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  dragHandle: {
    width: 10,
    backgroundColor: '#ccc',
    cursor: 'ew-resize',
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
  },
  list: {
    height: 390,
  },
});
