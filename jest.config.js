module.exports = {
  preset: 'react-native',
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    // './node_modules/react-native-reanimated/src/reanimated2/jestUtils.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|rollbar-react-native|@fortawesome|@react-native|@react-navigation|@react-native-async-storage/async-storage|api|react-redux|@react-navigation/stack|react-native-safe-area-context|react-native-screens|react-native-reanimated|@react-native-picker/picker|@react-native-picker|@react-native-picker/datepicker)',
  ],
};
