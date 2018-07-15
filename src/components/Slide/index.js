import React, { Component } from 'react'
import {
    View,
    WebView,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    Platform,
    StatusBar
} from 'react-native'
import Immersive from 'react-native-immersive'
// import HTML from 'react-native-render-html';

const html = ``

export default class Slide extends Component {
    constructor(props) {
        super(props)
        const { navigation } = this.props;
        const content = navigation.getParam('content', '');
        console.log(content);
        html = content
        if (Platform.OS === 'android') {
            StatusBar.setHidden(true)

            Immersive.on()
            Immersive.setImmersive(true)
        }
    }

    render() {
        const { goBack } = this.props.navigation
        const { navigation } = this.props;
        const content = navigation.getParam('content', '');
        return (
            <View
                style={styles.constain}
            >
                <WebView
                    style={styles.constain}
                    source={{ html, baseUrl: 'web/' }}
                    mixedContentMode='always'
                />
                {/* <HTML
                    style={{
                        flex: 1,
                        marginLeft: 50,
                        marginRight: 50,
                    }}
                    html={'<!DOCTYPE html>\n<!--[if lt IE 7]>      <html class=\"no-js lt-ie9 lt-ie8 lt-ie7\"> <![endif]-->\n<!--[if IE 7]>         <html class=\"no-js lt-ie9 lt-ie8\"> <![endif]-->\n<!--[if IE 8]>         <html class=\"no-js lt-ie9\"> <![endif]-->\n<!--[if gt IE 8]><!-->\n<html class=\"no-js\">\n<!--<![endif]-->\n\n<head>\n    <title>Sunbot - Level 1 - Episode 1</title>\n    <!-- Meta -->\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"description\" content=\"\">\n    <meta name=\"viewport\" content=\"width=device-width\">\n    <!-- Favicon -->\n    <link rel=\"shortcut icon\" href=\"http://ipd.edu.vn\\Scripts\\sunbot/img/favicon.ico\">\n    <!-- CSS Customization -->\n    <link rel=\"stylesheet\" href=\"http://ipd.edu.vn\\Scripts\\sunbot/css/sunbot.min.css\">\n    <!-- JS modernizr + Jquery + Components JS-->\n    <script src=\"http://ipd.edu.vn\\Scripts\\sunbot/Jscripts/sunbot.min.js\"></script>\n</head>\n\n<body>\n    <!-- main content -->\n    <!-- header area -->\n    <div class=\"area area-01\" id=\"area1\">\n        <div class=\"container-fluid\">\n            <h3 class=\"episode__header text-center animated fadeInDown\">Ngôi nhà Sunbot <img src=\"http://ipd.edu.vn/fig-image/sunbot/images/mini-character.png\" alt=\"\" class=\"img-responsive\"></h3>\n            <div class=\"area__bg\">\n                <img class=\"img-responsive\" src=\"http://ipd.edu.vn/fig-image/sunbot/images/lv01-ep01-sc01.png\" alt=\"\">\n                <a href=\"#area2\" class=\"area__clickable\">\n                    <div class=\"area__button\"><img src=\"http://ipd.edu.vn/fig-image/sunbot/images/hint.png\" alt=\"\"></div>\n                </a>\n            </div>\n        </div>\n    </div>\n    <!-- .end header area -->\n    <!-- normal area -->\n    <div class=\"area area-02\" id=\"area2\">\n        <div class=\"container-fluid\">\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-sm-6 col-md-3 col-md-offset-2\">\n                    <img src=\"http://ipd.edu.vn/fig-image/sunbot/images/lv01-ep01-character01.png\" alt=\"\" class=\"img-responsive pt64\">\n                </div>\n                <div class=\"col-xs-12 col-sm-6 col-md-5 col-md-offset-1\">\n                    <h4 class=\"area__header\">Bình minh rồi bé ơi!</h4>\n                    <div class=\"area__paragraph\">\n                        <p>Dưới sương sớm</p>\n                        <p>Những nụ hoa</p>\n                        <p>Đang hé nở</p>\n                        <p>Thức dậy nhé</p>\n                        <p>Bé con ơi</p>\n                        <p>Nắng mai ấm</p>\n                        <p>Cho ngày vui!</p>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <!-- normal area -->\n    <div class=\"area area-03\" id=\"area3\">\n        <div class=\"container-fluid\">\n            <div class=\"area__bg\">\n                <img class=\"img-responsive\" src=\"http://ipd.edu.vn/fig-image/sunbot/images/lv01-ep01-sc03.png\" alt=\"\">\n                <a href=\"#area4\" class=\"area__clickable-01\">\n                    <div class=\"area__button\"><img src=\"http://ipd.edu.vn/fig-image/sunbot/images/hint.png\" alt=\"\"></div>\n                </a>\n                <a href=\"#area5\" class=\"area__clickable-02\">\n                    <div class=\"area__button\"><img src=\"http://ipd.edu.vn/fig-image/sunbot/images/hint.png\" alt=\"\"></div>\n                </a>\n            </div>\n        </div>\n    </div>\n    <div class=\"area area-04\" id=\"area4\">\n        <div class=\"container-fluid\">\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-sm-6 col-md-3 col-md-offset-2\">\n                    <img src=\"http://ipd.edu.vn/fig-image/sunbot/images/lv01-ep01-character02.png\" alt=\"\" class=\"img-responsive\">\n                </div>\n                <div class=\"col-xs-12 col-sm-6 col-md-5 col-md-offset-1\">\n                    <h4 class=\"area__header\">Đánh răng</h4>\n                </div>\n                <a class=\"close-btn\"><img src=\"http://ipd.edu.vn/fig-image/sunbot/images/close-btn.png\" alt=\"\"></a>\n            </div>\n        </div>\n    </div>\n    <div class=\"area area-05\" id=\"area5\">\n        <div class=\"container-fluid\">\n            <div class=\"row\">\n                <div class=\"col-xs-12 col-sm-6 col-md-3 col-md-offset-2\">\n                    <img src=\"http://ipd.edu.vn/fig-image/sunbot/images/lv01-ep01-character03.png\" alt=\"\" class=\"img-responsive\">\n                </div>\n                <div class=\"col-xs-12 col-sm-6 col-md-5 col-md-offset-1\">\n                    <h4 class=\"area__header\">Rửa mặt</h4>\n                </div>\n                <a class=\"close-btn\"><img src=\"http://ipd.edu.vn/fig-image/sunbot/images/close-btn.png\" alt=\"\"></a>\n            </div>\n        </div>\n    </div>\n    <!-- .end normal area -->\n    <!-- JS Global Customise -->\n    <script src=\"http://ipd.edu.vn\\Scripts\\sunbot/Jscripts/custom.js\"></script>\n    <!-- Js Dev plugin -->\n    <!--[if lt IE 9]>\n        <script src=\"../Jscripts/vendor/respond.js\"></script>\n    <![endif]-->\n</body>\n\n</html>'}
                    imagesMaxWidth={Dimensions.get('window').width}
                /> */}
                <TouchableOpacity
                    style={styles.buttonBack}
                    onPress={() => goBack(null)}
                >
                    <Image
                        style={styles.imageStyle}
                        source={require('../../../assets/new-delete.png')}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    constain: {
        flex: 1,

    },
    buttonBack: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: 30,
        height: 30
    },
    imageStyle: {
        width: '100%',
        height: '100%'
    }
})