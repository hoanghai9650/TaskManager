import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,

  reducers: {
    updateTasks(state, action) {
      const lastTask = state.tasks[state.tasks.length - 1];
      const newId = lastTask ? lastTask.id + 1 : 1;

      const newTask = {
        ...action.payload,
        id: newId,
      };

      state.tasks.push(newTask);
    },
    editTask(state, action) {
      const {id, title, description, dueDate, status, priority, image} =
        action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);

      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          title,
          description,
          dueDate,
          status,
          priority,
          image,
        };
      }
    },
  },
});

export const {updateTasks, editTask} = appSlice.actions;
export default appSlice.reducer;
