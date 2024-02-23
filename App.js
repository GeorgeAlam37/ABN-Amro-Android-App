import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RepoListScreen from './RepoListScreen';
import RepoDetailScreen from './RepoDetailScreen';



const Stack = createStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RepoList">
        <Stack.Screen name="RepoList" component={RepoListScreen} options={{ title: 'Repositories' }} />
        <Stack.Screen name="RepoDetail" component={RepoDetailScreen} options={{ title: 'Repository Detail' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
