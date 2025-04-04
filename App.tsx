// App.tsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import RootNavigation from './src/navigation/index';
import { LanguageProvider } from './src/context/LanguageContext';

function App(): React.JSX.Element {
  return (
    <LanguageProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <RootNavigation />
      </SafeAreaView>
    </LanguageProvider>
  );
}

export default App;