import { create } from 'apisauce';
import API from './API';
/*eslint-disable quote-props*/
const createAPI = (baseURL = API.BASE_URL) => {
    const api = create({
        // base URL is read from the "constructor"
        baseURL,
        // here are some default headers
        headers: {
            'Content-Type': 'application/json',
            // 'token': 'lshdkcdsalcds',
            // 'deviceId': 1
        },
        // 10 second timeout...
        timeout: 10000
    });
    const apiMultipart = create({
        // base URL is read from the "constructor"
        baseURL,
        // here are some default headers
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        // 10 second timeout...
        timeout: 300000
    });
    // api.setHeaders({'token': '', 'deviceId': 2});

    const getCourses = () => api.get(`${API.GET_COURSES}`);
    const getLesson = (CoursesID) => api.get(`${API.GET_LESSON}/${CoursesID}`);
    const getSlider = (LessonID) => api.get(`${API.GET_SLIDER}/${LessonID}`);
    const getMap = (LessonID, Level) => api.get(`${API.GET_MAP}/${LessonID}/${Level}`);
    
    
    return {
        getCourses,
        getLesson,
        getSlider,
        getMap
    };
};

export default {
    createAPI
};

