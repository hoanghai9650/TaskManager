import {Gesture} from 'react-native-gesture-handler';
import {
  interpolate,
  interpolateColor,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export const useGesture = (
  width,
  item,
  isDragging,
  draggedItemId,
  currentPositions,
) => {
  const COLUMN_WIDTH = useDerivedValue(() => width.value).value;
  const MIN_BOUNDRY = 0;
  const MAX_BOUNDRY = 5 * COLUMN_WIDTH;

  //used for swapping with currentIndex
  const newIndex = useSharedValue(null);

  //used for swapping with newIndex
  const currentIndex = useSharedValue(null);

  const currentPositionsDerived = useDerivedValue(() => {
    return currentPositions.value;
  });

  const translateX = useSharedValue(
    // currentPositions.value[item.id].updatedTranslateX,
    // currentPositionsDerived.value[item.id].updatedIndex * COLUMN_WIDTH,
    item.id * COLUMN_WIDTH,
  );

  const isDraggingDerived = useDerivedValue(() => {
    return isDragging.value;
  });

  const draggedItemIdDerived = useDerivedValue(() => {
    return draggedItemId.value;
  });

  useAnimatedReaction(
    () => {
      return currentPositionsDerived.value[item.id].updatedIndex;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        if (
          draggedItemIdDerived.value !== null &&
          item.id === draggedItemIdDerived.value
        ) {
          translateX.value = withSpring(
            currentPositionsDerived.value[item.id].updatedIndex * COLUMN_WIDTH,
          );
        } else {
          translateX.value = withTiming(
            currentPositionsDerived.value[item.id].updatedIndex * COLUMN_WIDTH,
            {duration: 500},
          );
        }
      }
    },
  );
  // useAnimatedReaction(
  //   () => {
  //     return currentPositionsDerived.value[item.id].updatedTranslate;
  //   },
  //   (currentValue, previousValue) => {
  //     console.log('currentValue', currentValue);
  //     // if (currentValue !== previousValue) {
  //     //   translateX.value = withTiming(currentValue, {duration: 500});
  //     // }
  //   },
  // );

  const isCurrentDraggingItem = useDerivedValue(() => {
    return isDraggingDerived.value && draggedItemIdDerived.value === item.id;
  });

  const getKeyOfValue = (value, obj) => {
    'worklet';
    for (const [key, val] of Object.entries(obj)) {
      if (val.updatedIndex === value) {
        return Number(key);
      }
    }
    return undefined; // Return undefined if the value is not found
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      //start dragging
      isDragging.value = withSpring(1);

      //keep track of dragged item
      draggedItemId.value = item.id;

      //store dragged item id for future swap
      currentIndex.value = currentPositionsDerived.value[item.id].updatedIndex;
    })
    .onUpdate(e => {
      if (draggedItemIdDerived.value === null) {
        return;
      }

      const newTranslateX =
        currentPositionsDerived.value[draggedItemIdDerived.value]
          .updatedTranslate + e.translationX;

      if (
        currentIndex.value === null ||
        newTranslateX < MIN_BOUNDRY ||
        newTranslateX > MAX_BOUNDRY
      ) {
        //dragging out of bound
        return;
      }
      translateX.value = newTranslateX;

      //calculate the new index where drag is headed to
      newIndex.value = Math.floor(
        (newTranslateX + COLUMN_WIDTH / 2) / COLUMN_WIDTH,
      );

      //swap the items present at newIndex and currentIndex
      if (newIndex.value !== currentIndex.value) {
        //find id of the item that currently resides at newIndex
        const newIndexItemKey = getKeyOfValue(
          newIndex.value,
          currentPositionsDerived.value,
        );

        //find id of the item that currently resides at currentIndex
        const currentDragIndexItemKey = getKeyOfValue(
          currentIndex.value,
          currentPositionsDerived.value,
        );

        if (
          newIndexItemKey !== undefined &&
          currentDragIndexItemKey !== undefined
        ) {
          // update updatedTop and updatedIndex as next time we want to do calculations from new top value and new index
          currentPositions.value = {
            ...currentPositionsDerived.value,
            [newIndexItemKey]: {
              ...currentPositionsDerived.value[newIndexItemKey],
              updatedIndex: currentIndex.value,
              updatedTranslate: currentIndex.value * COLUMN_WIDTH,
            },
            [currentDragIndexItemKey]: {
              ...currentPositionsDerived.value[currentDragIndexItemKey],
              updatedIndex: newIndex.value,
            },
          };

          //update new index as current index
          currentIndex.value = newIndex.value;
        }
      }
    })
    .onEnd(() => {
      if (currentIndex.value === null || newIndex.value === null) {
        return;
      }
      translateX.value = withSpring(newIndex.value * COLUMN_WIDTH);
      //find original id of the item that currently resides at currentIndex
      const currentDragIndexItemKey = getKeyOfValue(
        currentIndex.value,
        currentPositionsDerived.value,
      );

      if (currentDragIndexItemKey !== undefined) {
        //update the values for item whose drag we just stopped
        currentPositions.value = {
          ...currentPositionsDerived.value,
          [currentDragIndexItemKey]: {
            ...currentPositionsDerived.value[currentDragIndexItemKey],
            updatedTranslate: newIndex.value * COLUMN_WIDTH,
          },
        };
      }
      //stop dragging
      isDragging.value = withDelay(200, withSpring(0));
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          scale: isCurrentDraggingItem.value
            ? interpolate(isDraggingDerived.value, [0, 1], [1, 1.025])
            : interpolate(isDraggingDerived.value, [0, 1], [1, 0.98]),
        },
      ],
      backgroundColor: isCurrentDraggingItem.value
        ? interpolateColor(isDraggingDerived.value, [0, 1], ['white', 'red'])
        : 'white',

      shadowColor: isCurrentDraggingItem.value
        ? interpolateColor(isDraggingDerived.value, [0, 1], ['black', 'white'])
        : undefined,
      shadowOffset: {
        width: 0,
        height: isCurrentDraggingItem.value
          ? interpolate(isDraggingDerived.value, [0, 1], [0, 7])
          : 0,
      },
      shadowOpacity: isCurrentDraggingItem.value
        ? interpolate(isDraggingDerived.value, [0, 1], [0, 0.2])
        : 0,
      shadowRadius: isCurrentDraggingItem.value
        ? interpolate(isDraggingDerived.value, [0, 1], [0, 10])
        : 0,
      elevation: isCurrentDraggingItem.value
        ? interpolate(isDraggingDerived.value, [0, 1], [0, 5])
        : 0, // For Android,
      zIndex: isCurrentDraggingItem.value ? 10 : 0,
    };
  }, [draggedItemIdDerived.value, isDraggingDerived.value]);

  return {
    animatedStyles,
    gesture,
  };
};
