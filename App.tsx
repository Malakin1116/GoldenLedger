import React from 'react';
import {
  SafeAreaView,
} from 'react-native';
import RootNavigation from './src/navigation';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{flex: 1}}>
      <RootNavigation/>
    </SafeAreaView>
  );
}

export default App;
