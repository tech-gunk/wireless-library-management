import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import TransactionScreen from "./screens/BookTransactionScreen";
import SearchScreen from "./screens/SearchScreen";
import Login from "./screens/Login";

export default class App extends React.Component {
  render() {
    return (
    <View>
      <AppContainer />
    </View>
    )
  }
}

const TabNavigator = createBottomTabNavigator(
  {
    
    Transaction: { screen: TransactionScreen },
    Search: { screen: SearchScreen },
  },
  {
    tabBarOptions: {
      activeTintColor: '#9657d1',
      inactiveTintColor: '#7F7C82'
    },
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: () => {
        const routeName = navigation.state.routeName;
        if (routeName === "Transaction") {
          return (
            <Image
              source={require("./assets/book.png")}
              style={{
                width: "25px",
                height: "25px",
              }}
            />
          );
        } else if (routeName === "Search") {
          return (
            <Image
              source={require("./assets/search.png")}
              style={{
                width: "25px",
                height: "25px",
              }}
            />
          );
        }
      },
      
    }),
  }
);

const SwitchNavigator = createSwitchNavigator(
  {
    Login: {screen : Login},
    TabNavigator: { screen: TabNavigator }
  }
)

const AppContainer = createAppContainer(SwitchNavigator);