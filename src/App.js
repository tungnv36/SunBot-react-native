/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Courses from './components/Courses/index'
import LessonList from './components/LessonList/index'
import RootNavigation from './navigations/RootNavigation'

export default class App extends Component {
  render() {
    return (
      <RootNavigation/>
    );
  }
}
