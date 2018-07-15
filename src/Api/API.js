
const TIMA_API = 'http://150.95.105.77:8080/api';
// const URL_UPLOAD = 'http://192.168.1.254:8093/FileUpload';

exports.BASE_URL = `${TIMA_API}`;
// exports.BASE_UPLOAD = `${URL_UPLOAD}`;

//----------LOGIN----------
//Dang nhap (POST)
exports.GET_COURSES = `${TIMA_API}/courses/getcourses`;
exports.GET_LESSON = `${TIMA_API}/courses/getlesson`;
exports.GET_SLIDER = `${TIMA_API}/courses/getslider`;
exports.GET_MAP = `${TIMA_API}/courses/getmap`;
