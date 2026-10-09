import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import {
  AuthProvider,
} from './src/context/AuthContext';

import {
  TodoProvider,
} from './src/context/TodoContext';

import {
  ThemeProvider,
} from './src/context/ThemeContext';

import RootNavigator from './src/navigation/RootNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <TodoProvider>
            <RootNavigator />
          </TodoProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;