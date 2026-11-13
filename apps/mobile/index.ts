import React from 'react';
import {registerRootComponent} from 'expo';
import {SafeAreaProvider,SafeAreaView} from 'react-native-safe-area-context';
import App from './App';
function Root(){return React.createElement(SafeAreaProvider,null,React.createElement(SafeAreaView,{style:{flex:1,backgroundColor:'#f5f6ee'},edges:['top','bottom']},React.createElement(App)));}
registerRootComponent(Root);
