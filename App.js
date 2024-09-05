import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const initialTasks = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    dueDate: '2024-09-01',
    priority: 'High',
    status: 'To Do',
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    dueDate: '2024-09-03',
    priority: 'Medium',
    status: 'In Progress',
  },
  {
    id: '3',
    title: 'Task 3',
    description: 'Description 3',
    dueDate: '2024-09-02',
    priority: 'Low',
    status: 'Completed',
  },
];

const MIN_COLUMN_WIDTH = 100;

const App = () => {
  const [tasks, setTasks] = React.useState(initialTasks);
  const [order, setOrder] = React.useState([0, 1, 2, 3, 4]); // Order of columns

  const columnTitles = [
    'Title',
    'Description',
    'Due Date',
    'Priority',
    'Status',
  ];

  const widths = columnTitles.map(() => useSharedValue(MIN_COLUMN_WIDTH));
  const positions = order.map((_, i) => useSharedValue(i * MIN_COLUMN_WIDTH)); // Initial position

  const gestureDisabled = useSharedValue(false);
  const panGestureState = useSharedValue(-1);
  const touchTranslate = useSharedValue(0);

  const horizontalAnim = useSharedValue(true); // Assume horizontal by default

  // Create animated styles for each column based on the position
  const animatedStyles = positions.map((position, index) =>
    useAnimatedStyle(() => ({
      transform: [{translateX: position.value}],
      width: widths[index].value,
    })),
  );

  // Gesture handlers for resizing columns
  const resizeHandlers = widths.map(width => {
    const initialWidth = useSharedValue(width.value);

    return Gesture.Pan()
      .onBegin(() => {
        initialWidth.value = width.value;
      })
      .onUpdate(evt => {
        if (gestureDisabled.value) {
          return;
        }
        const translation = evt.translationX;
        width.value = Math.max(
          MIN_COLUMN_WIDTH,
          initialWidth.value + translation,
        );
      })
      .onEnd(() => {
        width.value = withSpring(width.value);
      });
  });

  // Function to update the column order in React state
  const updateOrder = newOrder => {
    setOrder(newOrder);

    // Update positions to match the new order
    newOrder.forEach((colIndex, i) => {
      positions[colIndex].value = withSpring(i * MIN_COLUMN_WIDTH);
    });
  };

  // Gesture handlers for dragging columns
  const dragHandlers = positions.map((position, colIndex) => {
    const dragStartX = useSharedValue(0);
    const currentOrder = useSharedValue([...order]);

    return Gesture.Pan()
      .onBegin(evt => {
        gestureDisabled.value = false;
        panGestureState.value = evt.state;
        dragStartX.value = position.value;
        currentOrder.value = [...order];
      })
      .onUpdate(evt => {
        if (gestureDisabled.value) {
          return;
        }
        panGestureState.value = evt.state;
        const translation = evt.translationX;
        touchTranslate.value = translation;
        position.value = dragStartX.value + translation;

        // Check for swapping logic
        for (let i = 0; i < positions.length; i++) {
          if (i !== colIndex) {
            const posX = positions[i].value;
            const distance = Math.abs(posX - position.value);
            if (distance > position.value / 2) {
              const newOrder = [...currentOrder.value];
              [newOrder[i], newOrder[colIndex]] = [
                newOrder[colIndex],
                newOrder[i],
              ];

              currentOrder.value = newOrder;
              runOnJS(updateOrder)(newOrder);
              break;
            }
          }
        }
      })
      .onEnd(() => {
        // Snap columns to their new positions based on the updated order
        positions.forEach((position, i) => {
          const newIndex = currentOrder.value.indexOf(i);
          position.value = withSpring(newIndex * MIN_COLUMN_WIDTH);
        });
      });
  });

  const handleSort = criteria => {
    const sortedTasks = [...tasks].sort((a, b) => {
      switch (criteria) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          return a.priority.localeCompare(b.priority);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
    setTasks(sortedTasks);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1, padding: 10}}>
        {/* Sorting Controls */}
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <Text onPress={() => handleSort('dueDate')} style={{marginRight: 10}}>
            Sort by Due Date
          </Text>
          <Text
            onPress={() => handleSort('priority')}
            style={{marginRight: 10}}>
            Sort by Priority
          </Text>
          <Text onPress={() => handleSort('status')} style={{marginRight: 10}}>
            Sort by Status
          </Text>
        </View>

        {/* Task List with Resizable and Reorderable Columns */}
        <ScrollView horizontal>
          <View style={{flexDirection: 'row', height: '100%'}}>
            {order.map(colIndex => (
              <Animated.View
                key={columnTitles[colIndex]}
                style={[
                  animatedStyles[colIndex],
                  {
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    flexDirection: 'column',
                  },
                ]}>
                <GestureDetector gesture={dragHandlers[colIndex]}>
                  <Animated.View style={styles.header}>
                    <Text>{columnTitles[colIndex]}</Text>
                  </Animated.View>
                </GestureDetector>
                <GestureDetector gesture={resizeHandlers[colIndex]}>
                  <Animated.View style={styles.resizer} />
                </GestureDetector>
                {tasks.map(task => (
                  <Animated.View key={task.id} style={styles.cell}>
                    <Text>
                      {
                        task[
                          columnTitles[colIndex].toLowerCase().replace(' ', '')
                        ]
                      }
                    </Text>
                  </Animated.View>
                ))}
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    zIndex: 2,
  },
  resizer: {
    width: 5,
    height: '100%',
    backgroundColor: '#ccc',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  cell: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

export default App;
