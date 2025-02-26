import React, {useContext} from 'react';
import { NavigationContainer } from "@react-navigation/native";

import {AppContext, AppProvider} from "./components/AppContext";
import AppNavigation from './navigation/AppNavigation';

export default function App() {
  return (
      <AppProvider>
          <NavigationContainer>
              <AppNavigation />
          </NavigationContainer>
      </AppProvider>
  );
}


