import {
  NavigationContainer,
} from '@react-navigation/native';

import Loader from '../components/common/Loader';
import useAuth from '../hooks/useAuth';

import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';

function RootNavigator() {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <DrawerNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

export default RootNavigator;