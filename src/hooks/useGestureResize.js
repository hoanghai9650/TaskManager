import {Gesture} from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export const useGestureResize = (initWidth, header, currentTaskPositions) => {
  const width = initWidth;

  const animatedStyles = useAnimatedStyle(() => ({width: width.value}));

  const initialWidth = useSharedValue(width.value);

  const resizeGesture = Gesture.Pan()
    .onBegin(() => {
      initialWidth.value = width.value;
    })
    .onUpdate(event => {
      const newWidth = Math.max(30, initialWidth.value + event.translationX);
      width.value = newWidth;
    })

    .onEnd(() => {
      width.value = withSpring(width.value);
    });

  return {
    animatedStyles,
    resizeGesture,
  };
};

// export const useGestureResize = (item, header, currentTaskPositions) => {
//   const currentWidthDerived = useDerivedValue(() => {
//     return currentTaskPositions.value;
//   });

//   const width = useSharedValue(100);

//   const resizeGesture = Gesture.Pan()
//     .onBegin(() => {
//       width.value = width.value;
//     })
//     .onUpdate(event => {
//       const newWidth = Math.max(
//         30,
//         currentWidthDerived.value[header.id].updatedWidth + event.translationX,
//       );
//       width.value = newWidth;
//     })

//     .onEnd(() => {
//       currentWidthDerived.value[header.id].updatedWidth = withSpring(
//         currentWidthDerived.value[header.id].updatedWidth,
//       );
//     });

//   const animatedStyles = useAnimatedStyle(() => ({width: width.value}));
//   return {
//     animatedStyles,
//     resizeGesture,
//   };
// };
