import { Navigation } from 'react-native-navigation';
import HomeScreen from './HomePage';
import DemoScreen from './DemoPage';

// register all screens of the app (including internal ones)
export default function registerScreens() {
  Navigation.registerComponent('RNBoot.HomeScreen', () => HomeScreen);
  Navigation.registerComponent('RNBoot.DemoScreen', () => DemoScreen);
}
