import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import RNPickerSelect from 'react-native-picker-select';
import {useAddOrEditTask} from '../../hooks/useAddOrEditTask';
import {styles} from './styles';
const {width} = Dimensions.get('window');

export default function AddOrEditTask({route}) {
  const {
    initId,
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    priority,
    setPriority,
    status,
    setStatus,
    image,
    open,
    setOpen,
    handleUpdateTask,
    handleUploadImage,
    navigation,
  } = useAddOrEditTask({route});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {left: width / 2 - 50}]}>
          {initId ? 'Edit Task' : 'Add Task'}
        </Text>
        <View />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.title}>Title</Text>
        <View style={styles.inputContainer}>
          <TextInput value={title} onChangeText={setTitle} />
        </View>

        <Text>Description</Text>
        <View style={styles.inputContainer}>
          <TextInput value={description} onChangeText={setDescription} />
        </View>

        <Text>Due Date</Text>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setOpen(true)}>
          <Text>{dueDate?.toLocaleDateString('en-US')}</Text>
          <DatePicker
            modal
            open={open}
            date={dueDate}
            mode={'date'}
            onConfirm={date => {
              setOpen(false);
              setDueDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </TouchableOpacity>

        <Text>Priority</Text>
        <View style={styles.inputContainer}>
          <RNPickerSelect
            onValueChange={value => setPriority(value)}
            items={[
              {label: 'Low', value: 1},
              {label: 'Medium', value: 2},
              {label: 'High', value: 3},
            ]}
            value={priority}
          />
        </View>

        <Text>Status</Text>
        <View style={styles.inputContainer}>
          <RNPickerSelect
            onValueChange={value => setStatus(value)}
            items={[
              {label: 'To Do', value: 1},
              {label: 'In Progress', value: 2},
              {label: 'Completed', value: 3},
            ]}
            value={status}
          />
        </View>
      </View>

      <Text>Image</Text>

      <TouchableOpacity
        style={styles.imageContainer}
        onPress={handleUploadImage}>
        {image ? (
          <Image
            source={{uri: `data:image/jpg;base64,${image}`}}
            style={styles.image}
          />
        ) : (
          <Text>Select Image</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.save} onPress={handleUpdateTask}>
        <Text>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
