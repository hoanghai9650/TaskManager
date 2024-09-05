import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

const useTaskManager = () => {
  const tasksSelector = useSelector(state => state.app.tasks);
  const [tasks, setTasks] = useState([]);
  const [displayTasks, setDisplayTasks] = useState([]);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [status, setStatus] = useState();
  const [priority, setPriority] = useState();
  const [date, setDate] = useState();
  const [sortOption, setSortOption] = useState();
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  const calculateTargetDate = days => {
    let endDate = new Date();
    if (days === '3d') {
      endDate.setDate(endDate.getDate() + 3);
    } else {
      endDate.setDate(endDate.getDate() + 7);
    }
    return endDate;
  };

  const handleReset = () => {
    setStatus();
    setPriority();
    setSortOption();
    setDate();
    setPage(1);
  };

  // Paginate tasks
  useEffect(() => {
    const _tasks = [...tasksSelector];
    const endIndex = page * ITEMS_PER_PAGE;
    setTasks(_tasks.slice(0, endIndex));
  }, [page, tasksSelector, date, status, priority]);

  //Filter tasks based on status, priority, and due date
  useEffect(() => {
    const _task = [...tasks];
    if (status && priority && date) {
      const filteredTasks = _task.filter(task => {
        const dueDate = new Date(task.dueDate);
        const endDate = calculateTargetDate(date);
        return (
          task.status === status &&
          task.priority === priority &&
          dueDate <= endDate
        );
      });
      setDisplayTasks(filteredTasks);
      return;
    }
    if (status && priority) {
      const filteredTasks = _task.filter(
        task => task.status === status && task.priority === priority,
      );
      setDisplayTasks(filteredTasks);
      return;
    }
    if (status) {
      const filteredTasks = _task.filter(task => task.status === status);
      setDisplayTasks(filteredTasks);
      return;
    }
    if (priority) {
      const filteredTasks = _task.filter(task => task.priority === priority);
      setDisplayTasks(filteredTasks);
      return;
    }
    if (date) {
      const filteredTasks = _task.filter(task => {
        const dueDate = new Date(task.dueDate);
        const endDate = calculateTargetDate(date);
        return dueDate <= endDate;
      });
      setDisplayTasks(filteredTasks);
      return;
    }
    setDisplayTasks(tasks);
  }, [status, priority, tasks, date]);

  // Sort tasks by due date, priority, and status
  useEffect(() => {
    if (sortOption) {
      if (sortOption === 'dueDate') {
        const _sortedTasks = [...displayTasks].sort((a, b) => {
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        setSortedTasks(_sortedTasks);
        return;
      }
      if (sortOption === 'priority') {
        const _sortedTasks = [...displayTasks].sort((a, b) => {
          return a.priority - b.priority;
        });
        setSortedTasks(_sortedTasks);
        return;
      }
      if (sortOption === 'status') {
        const _sortedTasks = [...displayTasks].sort((a, b) => {
          return a.status - b.status;
        });
        setSortedTasks(_sortedTasks);
        return;
      }
    }
    // setSortedTasks(displayTasks);
  }, [displayTasks, sortOption]);

  const loadMoreTasks = () => {
    console.log('load more tasks');
    setPage(prevPage => prevPage + 1);
  };

  return {
    sortedTasks,
    displayTasks,
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

export default useTaskManager;
