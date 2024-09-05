/**
 * @format
 */

import {act} from 'react';
import 'react-native';

// Note: import explicitly to use the types shipped with jest.
import {describe, expect, it} from '@jest/globals';
import React from 'react';
// Note: test renderer must be required after react-native.
import {NavigationContainer} from '@react-navigation/native';
import {render, renderHook} from '@testing-library/react-native';
import ResizeList from '../src/components/ResizeList';
import useTaskManagerWithMap from '../src/hooks/useTaskManger2';

const sampleTasks = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Task 1 description',
    dueDate: '2024-09-04',
    status: 'completed',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Task 2 description',
    dueDate: '2024-09-05',
    status: 'pending',
    priority: 'low',
  },
  {
    id: 3,
    title: 'Task 3',
    description: 'Task 3 description',
    dueDate: '2024-09-08',
    status: 'completed',
    priority: 'medium',
  },
  {
    id: 4,
    title: 'Task 4',
    description: 'Task 4 description',
    dueDate: '2024-09-09',
    status: 'pending',
    priority: 'high',
  },
];

describe('useTaskManagerWithMap', () => {
  it('should show list of task', () => {
    const {result} = renderHook(() =>
      useTaskManagerWithMap({tasksSelector: sampleTasks}),
    );

    // Apply status filter to 'completed'

    const {getByTestId} = render(
      <NavigationContainer>
        <ResizeList
          tasks={result?.current?.sortedTasks}
          loadMore={() => {
            result?.current?.loadMoreTasks?.();
          }}
        />
        ,
      </NavigationContainer>,
    );

    // Expect 4 tasks
    expect(result.current.sortedTasks.length).toBe(4);
    //Check if the tasks are rendered
    expect(getByTestId('row-item-1')).toBeTruthy();
    expect(getByTestId('row-item-2')).toBeTruthy();
    expect(getByTestId('row-item-3')).toBeTruthy();
    expect(getByTestId('row-item-4')).toBeTruthy();
  });

  it('should return tasks filtered by status', () => {
    const {result} = renderHook(() =>
      useTaskManagerWithMap({tasksSelector: sampleTasks}),
    );

    // Apply status filter to 'completed'
    act(() => {
      result.current.setStatus('completed');
    });

    const {getByTestId} = render(
      <NavigationContainer>
        <ResizeList
          tasks={result?.current?.sortedTasks}
          loadMore={() => {
            result?.current?.loadMoreTasks?.();
          }}
        />
        ,
      </NavigationContainer>,
    );
    // Expect 2 tasks with 'completed' status
    expect(result.current.sortedTasks.length).toBe(2);
    //Check if the tasks are rendered
    expect(getByTestId('row-item-1')).toBeTruthy();
    expect(getByTestId('row-item-3')).toBeTruthy();
  });

  it('should return tasks filtered by priority', () => {
    const {result} = renderHook(() =>
      useTaskManagerWithMap({tasksSelector: sampleTasks}),
    );

    // Apply priority filter to 'high'
    act(() => {
      result.current.setPriority('high');
    });

    const {getByTestId} = render(
      <NavigationContainer>
        <ResizeList
          tasks={result?.current?.sortedTasks}
          loadMore={() => {
            result?.current?.loadMoreTasks?.();
          }}
        />
      </NavigationContainer>,
    );

    // Expect 2 tasks with 'high' priority
    expect(result.current.sortedTasks.length).toBe(2);
    expect(getByTestId('row-item-1')).toBeTruthy();
    expect(getByTestId('row-item-4')).toBeTruthy();
  });

  it('should return tasks filtered by date range', () => {
    const {result} = renderHook(() =>
      useTaskManagerWithMap({tasksSelector: sampleTasks}),
    );

    // Apply date filter to '3d' (next 3 days)
    act(() => {
      result.current.setDate('3d');
    });

    const {getByTestId} = render(
      <NavigationContainer>
        <ResizeList
          tasks={result.current.sortedTasks}
          loadMore={() => {
            result.current.loadMoreTasks?.();
          }}
        />
      </NavigationContainer>,
    );

    // Expect 2 tasks with '3d' date range
    expect(result.current.sortedTasks.length).toBe(2);
    expect(getByTestId('row-item-1')).toBeTruthy();
    expect(getByTestId('row-item-2')).toBeTruthy();
  });

  it('should return tasks filtered by status and priority combination', () => {
    const {result} = renderHook(() =>
      useTaskManagerWithMap({tasksSelector: sampleTasks}),
    );

    act(() => {
      result.current.setStatus('pending');
    });

    act(() => {
      result.current.setPriority('high');
    });

    const {getByTestId} = render(
      <NavigationContainer>
        <ResizeList
          tasks={result.current.sortedTasks}
          loadMore={() => {
            result.current.loadMoreTasks?.();
          }}
        />
      </NavigationContainer>,
    );
    // Expect only 1 task that is both 'pending' and 'high'
    expect(result.current.sortedTasks.length).toBe(1);
    expect(getByTestId('row-item-4')).toBeTruthy();
  });

  it('should return tasks filtered by status, priority, and date combination', () => {
    const {result} = renderHook(() =>
      useTaskManagerWithMap({tasksSelector: sampleTasks}),
    );

    act(() => {
      result.current.setStatus('pending');
    });

    act(() => {
      result.current.setPriority('low');
    });

    act(() => {
      result.current.setDate('3d');
    });

    const {getByTestId} = render(
      <NavigationContainer>
        <ResizeList
          tasks={result.current.sortedTasks}
          loadMore={() => {
            result.current.loadMoreTasks?.();
          }}
        />
        ,
      </NavigationContainer>,
    );

    // Expect 1 task that matches all filters
    expect(result.current.sortedTasks.length).toBe(1);
    expect(getByTestId('row-item-2')).toBeTruthy();
  });

  it('should return tasks filtered by date and priority combination', () => {
    const {result} = renderHook(() =>
      useTaskManagerWithMap({tasksSelector: sampleTasks}),
    );

    act(() => {
      result.current.setDate('3d');
    });

    act(() => {
      result.current.setPriority('high');
    });

    const {getByTestId} = render(
      <NavigationContainer>
        <ResizeList
          tasks={result.current.sortedTasks}
          loadMore={() => {
            result.current.loadMoreTasks?.();
          }}
        />
        ,
      </NavigationContainer>,
    );
    // Expect only 1 task that is both '3d' and 'high'
    expect(result.current.sortedTasks.length).toBe(1);
    expect(getByTestId('row-item-1')).toBeTruthy();
  });
});
