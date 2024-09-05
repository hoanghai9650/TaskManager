import {useEffect, useState} from 'react';
const ITEMS_PER_PAGE = 10;

const useTaskManagerWithMap = ({tasksSelector}) => {
  const [paginateTasks, setPaginateTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [status, setStatus] = useState(null);
  const [priority, setPriority] = useState(null);
  const [date, setDate] = useState(null);
  const [sortOption, setSortOption] = useState(null);
  const [page, setPage] = useState(1);

  //Calculates the target date
  const calculateTargetDate = days => {
    const endDate = new Date();
    days === '3d'
      ? endDate.setDate(endDate.getDate() + 3)
      : endDate.setDate(endDate.getDate() + 7);
    return endDate;
  };

  //Create maps from the tasks array
  const createTaskMaps = tasks => {
    const statusMap = new Map();
    const priorityMap = new Map();
    const dateMap = new Map();

    tasks.forEach(task => {
      // Status Map
      if (!statusMap.has(task.status)) {
        statusMap.set(task.status, []);
      }
      statusMap.get(task.status).push(task);

      // Priority Map
      if (!priorityMap.has(task.priority)) {
        priorityMap.set(task.priority, []);
      }
      priorityMap.get(task.priority).push(task);

      // Date Map
      const dueDate = new Date(task.dueDate).toISOString().split('T')[0];
      if (!dateMap.has(dueDate)) {
        dateMap.set(dueDate, []);
      }
      dateMap.get(dueDate).push(task);
    });

    return {statusMap, priorityMap, dateMap};
  };

  // This function returns the intersection of multiple arrays
  const intersectArrays = arrays => {
    if (arrays.length === 0) {
      return [];
    }
    return arrays.reduce((a, b) => a.filter(c => b.includes(c)));
  };

  // Paginate tasks
  useEffect(() => {
    const endIndex = page * ITEMS_PER_PAGE;
    setPaginateTasks([...tasksSelector].slice(0, endIndex));
  }, [page, tasksSelector]);

  // Create maps for tasks
  useEffect(() => {
    const _tasks = [...paginateTasks];
    const {statusMap, priorityMap, dateMap} = createTaskMaps(_tasks);
    setFilteredTasks({statusMap, priorityMap, dateMap});
  }, [paginateTasks]);

  // Combine filters and update `sortedTasks`
  useEffect(() => {
    let tasksArrays = [];

    // Apply status filter
    if (status) {
      const statusTasks = filteredTasks.statusMap.get(status) || [];
      tasksArrays.push(statusTasks);
    }

    // Apply priority filter
    if (priority) {
      const priorityTasks = filteredTasks.priorityMap.get(priority) || [];
      tasksArrays.push(priorityTasks);
    }

    // Apply date filter
    if (date) {
      const targetEndDate = calculateTargetDate(date);
      const filteredByDate = [];
      for (let [dueDate, tasks] of filteredTasks.dateMap.entries()) {
        const taskDueDate = new Date(dueDate);
        if (taskDueDate <= targetEndDate) {
          filteredByDate.push(...tasks); // Add tasks whose dueDate <= target date
        }
      }
      tasksArrays.push(filteredByDate);
    }

    // Combine filters using intersection
    const combinedTasks =
      tasksArrays.length > 0
        ? intersectArrays(tasksArrays)
        : [...paginateTasks];

    // Sort the filtered tasks
    let sorted = [...combinedTasks];
    if (sortOption) {
      switch (sortOption) {
        case 'dueDate':
          sorted.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
          break;
        case 'priority':
          sorted.sort((a, b) => {
            return a.priority - b.priority;
          });
          break;
        case 'status':
          sorted.sort((a, b) => a.status - b.status);
          break;
        default:
          break;
      }
    }
    setSortedTasks(sorted);
  }, [status, priority, date, filteredTasks, paginateTasks, sortOption]);

  const loadMoreTasks = () => {
    console.log('load more tasks');
    setPage(prevPage => prevPage + 1);
  };

  const handleReset = () => {
    setStatus(null);
    setPriority(null);
    setSortOption(null);
    setDate(null);
    setPage(1);
  };

  return {
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
  };
};

export default useTaskManagerWithMap;
