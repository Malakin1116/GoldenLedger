import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from '../../styles';

export default function AuthLayout({children}) {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.mainWrapper]}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.select({android: 20, ios: 90})}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {children}
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}