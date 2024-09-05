import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch} from 'react-redux';
import {editTask, updateTasks} from '../redux/app';

export const useAddOrEditTask = ({route}) => {
  const _initDueDate = new Date();
  _initDueDate.setDate(_initDueDate.getDate() + 1);

  const {
    id: initId,
    title: initTitle = '',
    description: initDescription = '',
    dueDate: initDueDate,
    priority: initPriority = null,
    status: initStatus = null,
    image: initImage = null,
  } = route.params || {};

  const [title, setTitle] = React.useState(initTitle ? initTitle : '');
  const [description, setDescription] = React.useState(
    initDescription ? initDescription : '',
  );
  const [dueDate, setDueDate] = React.useState(
    initDueDate ? new Date(initDueDate) : _initDueDate,
  );
  const [priority, setPriority] = React.useState(
    initPriority ? initPriority : null,
  );
  const [status, setStatus] = React.useState(initStatus ? initStatus : null);
  const [image, setImage] = React.useState(initImage ? initImage : null);

  const [open, setOpen] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleUpdateTask = useCallback(() => {
    if (initId) {
      dispatch(
        editTask({
          id: initId,
          title,
          description,
          dueDate,
          status,
          priority,
          image,
        }),
      );
    } else {
      dispatch(
        updateTasks({
          title,
          description,
          dueDate,
          status,
          priority,
          image,
        }),
      );
    }

    navigation.goBack();
  }, [
    initId,
    title,
    description,
    dueDate,
    status,
    priority,
    image,
    dispatch,
    navigation,
  ]);

  const handleUploadImage = () => {
    launchImageLibrary(
      {maxWidth: 150, maxHeight: 200, quality: 0.8, includeBase64: true},
      val => setImage(val.assets[0].base64),
    );
  };

  return {
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
  };
};
