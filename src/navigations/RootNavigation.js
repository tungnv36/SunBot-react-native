import { StackNavigator } from 'react-navigation';
import Courses from '../components/Courses/index'
import LessonList from '../components/LessonList/index'
import Lesson from '../components/Lesson/index'
import GamePlay from '../components/GamePlay/index2'
import Slide from '../components/Slide/index'
import PlayVideo from '../components/PlayVideo/index'

const RootNavigation = StackNavigator(
    {
        Courses: { screen: Courses },
        LessonList: { screen: LessonList },
        Lesson: { screen: Lesson },
        GamePlay: { screen: GamePlay },
        Slide: { screen: Slide },
        PlayVideo: { screen: PlayVideo },
    }, {
        headerMode: 'none'
    }
);

export default RootNavigation;