import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    position: 'absolute',
    // textAlign: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 5,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'semibold',
  },
  inputWrapper: {
    marginTop: 24,
  },
  save: {
    backgroundColor: 'pink',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  dropDown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  imageContainer: {
    width: 150,
    height: 200,
    backgroundColor: 'grey',
  },
  image: {
    flex: 1,
  },
});
