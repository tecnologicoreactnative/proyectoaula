// App.js
import React from 'react';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import InvocationNavigation from './src/navigation/Invocation';

const App = () => {
  return (
    <PaperProvider>
      <Portal.Host>
        <InvocationNavigation />
      </Portal.Host>
    </PaperProvider>
  );
};

export default App;
