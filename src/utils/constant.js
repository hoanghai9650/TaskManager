export const header = [
  {id: 0, title: 'Title', key: 'title'},
  {id: 1, title: 'Description', key: 'description'},
  {id: 2, title: 'Due Date', key: 'dueDate'},
  {id: 3, title: 'Priority', key: 'priority'},
  {id: 4, title: 'Status', key: 'status'},
];

export const priorityOptions = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
};

export const statusOptions = {
  1: 'To Do',
  2: 'In Progress',
  3: 'Completed',
};

export const getInitialPositions = () => {
  let taskPositions = {};
  for (let i = 0; i < header.length; i++) {
    taskPositions[i] = {
      updatedIndex: i,
      updatedWidth: 100,
      updatedTranslate: i * 100,
    };
  }
  return taskPositions;
};
