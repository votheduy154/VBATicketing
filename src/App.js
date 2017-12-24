import { Navigation } from 'react-native-navigation';
import registerScreens from './Screens';

registerScreens(); // this is where you register all of your app's screens

// start the app
Navigation.startSingleScreenApp({
  screen: {
    screen: 'RNBoot.HomeScreen', // unique ID registered with Navigation.registerScreen
    title: 'Welcome', // title of the screen as appears in the nav bar (optional)
  },
});
