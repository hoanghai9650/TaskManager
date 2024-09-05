import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import RadioButton from '../../components/RadioButton';
import ResizeList from '../../components/ResizeList';
import useTaskManagerWithMap from '../../hooks/useTaskManger2';
import {styles} from './styles';

export default function Home() {
  const tasksSelector = useSelector(state => state.app.tasks);
  const {
    sortedTasks,
    setStatus,
    setPriority,
    setDate,
    setSortOption,
    handleReset,
    sortOption,
    status,
    priority,
    date,
    loadMoreTasks,
  } = useTaskManagerWithMap({tasksSelector});
  const navigation = useNavigation();
  const flatListRef = React.useRef(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        <Text> Filter by Status:</Text>
        <RadioButton
          label="To Do"
          style={styles.radio}
          selected={status === 1}
          onPress={() => setStatus(1)}
        />
        <RadioButton
          label="In Progress"
          style={styles.radio}
          selected={status === 2}
          onPress={() => setStatus(2)}
        />
        <RadioButton
          label="Completed"
          style={styles.radio}
          selected={status === 3}
          onPress={() => setStatus(3)}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text> Filter by priority:</Text>
        <RadioButton
          label="Low"
          style={styles.radio}
          selected={priority === 1}
          onPress={() => setPriority(1)}
        />
        <RadioButton
          label="Medium"
          style={styles.radio}
          selected={priority === 2}
          onPress={() => setPriority(2)}
        />
        <RadioButton
          label="High"
          style={styles.radio}
          selected={priority === 3}
          onPress={() => setPriority(3)}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text> Filter by due date:</Text>
        <RadioButton
          label="3d"
          style={styles.radio}
          selected={date === '3d'}
          onPress={() => setDate('3d')}
        />
        <RadioButton
          label="7d"
          style={styles.radio}
          selected={date === '7d'}
          onPress={() => setDate('7d')}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text> Sort by:</Text>
        <RadioButton
          label="due date"
          style={styles.radio}
          selected={sortOption === 'dueDate'}
          onPress={() => setSortOption('dueDate')}
        />
        <RadioButton
          label="priority"
          style={styles.radio}
          selected={sortOption === 'priority'}
          onPress={() => setSortOption('priority')}
        />
        <RadioButton
          label="status"
          style={styles.radio}
          selected={sortOption === 'status'}
          onPress={() => setSortOption('status')}
        />
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.clear}>
          <Text onPress={() => navigation.navigate('AddOrEditTask')}>
            Create Task
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clear}>
          <Text
            onPress={() => {
              flatListRef.current.scrollToOffset({animated: false, offset: 0});
              handleReset();
            }}>
            Clear filter
          </Text>
        </TouchableOpacity>
      </View>

      <ResizeList
        ref={flatListRef}
        tasks={sortedTasks}
        loadMore={loadMoreTasks}
      />
    </SafeAreaView>
  );
}
