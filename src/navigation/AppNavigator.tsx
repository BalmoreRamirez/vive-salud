import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChartColumnBig, House, UserRound } from 'lucide-react-native';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { HabitDetailScreen } from '@/screens/HabitDetailScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { ProgressScreen } from '@/screens/ProgressScreen';
import { SplashScreen } from '@/screens/SplashScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { RegisterScreen } from '@/screens/RegisterScreen';
import { MainTabParamList, RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.success,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 66,
          paddingTop: 6,
          paddingBottom: 10,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          backgroundColor: colors.surface,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconSize = focused ? size + 1 : size;

          if (route.name === 'Dashboard') {
            return <House size={iconSize} color={color} strokeWidth={2.2} />;
          }

          if (route.name === 'Perfil') {
            return <UserRound size={iconSize} color={color} strokeWidth={2.2} />;
          }

          return <ChartColumnBig size={iconSize} color={color} strokeWidth={2.2} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Progreso" component={ProgressScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Registro' }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HabitDetail"
          component={HabitDetailScreen}
          options={{
            title: 'Detalle de hábito',
            headerTintColor: colors.success,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
