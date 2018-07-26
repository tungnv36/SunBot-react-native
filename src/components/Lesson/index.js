import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    ImageBackground,
    Dimensions,
    WebView,
    ScrollView,
    Animated,
    Platform,
    StatusBar
} from 'react-native'
import Constant from '../../constants/Constant'
import ImageSlider from 'react-native-image-slider';
import { BlurView, VibrancyView } from 'react-native-blur';
import Immersive from 'react-native-immersive'
import CallApi from '../../Api/CallApi';

export default class Lesson extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr_images: [],
            arr_info: [],
            position: 1,
            interval: null,
            bottomSunBot: new Animated.Value(0),
        }

        if (Platform.OS === 'android') {
            StatusBar.setHidden(true)

            Immersive.on()
            Immersive.setImmersive(true)
        }
    }

    componentWillMount() {
        setTimeout(() => {
            Animated.spring(
                this.state.bottomSunBot,
                {
                    toValue: 1,
                    bounciness: 10,
                    useNativeDriver: true
                }
            ).start()
        }, 100)

        // this.getSlider()
        // this.setState({
        //     interval: setInterval(() => {
        //         this.setState({ position: this.state.position === 2 ? 0 : this.state.position + 1 });
        //     }, 2000)
        // });
    }

    componentWillUnmount() {
        // clearInterval(this.state.interval);
    }

    getSlider = async () => {
        const { navigation } = this.props;
        const key = navigation.getParam('key', '0');

        const api = CallApi.createAPI()
        const taskGet = await api.getSlider(key)
        var items = []
        var items_info = []
        if (taskGet.ok) {
            console.log('taskGetSlider', taskGet.data)
            var data = taskGet.data
            if (data === null) {
                setTimeout(() => {
                    alert('Không có khoá học nào')
                })
            } else {
                for (let i = 0; i < data.length; i++) {
                    items_info.push({
                        key: data[i].id.toString(),
                        lessonId: data[i].lessonId,
                        pageNumber: data[i].pageNumber,
                    })
                    items.push(
                        data[i].imageUrl.toString()
                    )
                }
                console.log('items', items)
                this.setState({
                    arr_images: items,
                    arr_info: items_info
                })
            }
        }
    }

    render() {
        const { navigate, goBack } = this.props.navigation
        const { navigation } = this.props;
        const key = navigation.getParam('key', '0');
        const index = navigation.getParam('index', '0');
        const description = navigation.getParam('description', '');
        const content = navigation.getParam('content', '');
        return (
            <ImageBackground
                style={styles.container}
                source={require('../../../assets/new-bg-sunbot-3.png')}
            >
                <View
                    style={{
                        width: '70%',
                        height: '90%',
                        // backgroundColor: '#FFF',
                        alignItems: 'center',
                    }}
                >
                    <ImageBackground
                        style={{
                            width: 4 * Dimensions.get('window').width / 10,//'30%',
                            height: 1.5 * Dimensions.get('window').height / 10,//'16%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2,
                        }}
                        source={require('../../../assets/new-title-pannel.png')}
                        resizeMode='contain'
                    >
                        <Text
                            style={styles.title}
                        >
                            {`Bài ${index}`}
                        </Text>
                    </ImageBackground>
                    <ImageBackground
                        style={{
                            width: 6.5 * Dimensions.get('window').width / 10,
                            height: 7.5 * Dimensions.get('window').height / 10,
                            marginTop: -15,
                            // zIndex: 1,
                            alignItems: 'center',
                        }}
                        source={require('../../../assets/new-pannel-lesson.png')}
                        resizeMode='stretch'
                    >

                        <ScrollView
                            style={styles.description}
                        >
                            <Text
                                style={styles.textDescription}
                            >
                                {description}
                            </Text>
                        </ScrollView>
                        <View
                            style={{
                                width: '100%',
                                height: '35%'
                            }}
                        />
                    </ImageBackground>
                </View>
                <Animated.Image
                    style={[styles.sunbot, {
                        transform: [{
                            translateY: this.state.bottomSunBot.interpolate({
                                inputRange: [0, 1],
                                outputRange: [Dimensions.get('window').height / 2, 0]
                            }),
                        }]
                    }]}
                    source={require('../../../assets/sunbot-right.png')}
                    resizeMode='contain'
                />
                <View
                    style={styles.button}
                >
                    <Image
                        style={styles.column}
                        source={require('../../../assets/new-column.png')}
                        resizeMode='contain'
                    />
                    <View
                        style={styles.viewButton}
                    >
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => navigate('Slide', {
                                content
                            })}
                        >
                            <ImageBackground
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                source={require('../../../assets/new-menu-button-1.png')}
                                resizeMode='contain'
                            >
                                <Text
                                    style={{
                                        fontSize: Dimensions.get('window').width / 50,
                                        color:'#FFF',
                                        fontFamily: 'Pacifico',//Platform.OS==='ios'?'Pacifico':"r0c0i - Linotte Bold"
                                    }}
                                >
                                    Slide
                                </Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => navigate('GamePlay', {
                                lessonId: key
                            })}
                        >
                            <ImageBackground
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                source={require('../../../assets/new-menu-button-2.png')}
                                resizeMode='contain'
                            >
                                <Text
                                    style={{
                                        fontSize: Dimensions.get('window').width / 50,
                                        color:'#FFF',
                                        fontFamily: 'Pacifico',//Platform.OS==='ios'?'Pacifico':"r0c0i - Linotte Bold"
                                    }}
                                >
                                    Play
                                </Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuButton}
                            onPress={() => goBack(null)}
                        >
                            <ImageBackground
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                source={require('../../../assets/new-menu-button-1.png')}
                                resizeMode='contain'
                            >
                                <Text
                                    style={{
                                        fontSize: Dimensions.get('window').width / 50,
                                        color:'#FFF',
                                        fontFamily: 'Pacifico',//Platform.OS==='ios'?'Pacifico':"r0c0i - Linotte Bold"
                                    }}
                                >
                                    Back
                                </Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    panel: {
        width: '80%',
        height: '95%',
        alignItems: 'center',
    },
    title: {
        width: '100%',
        fontWeight: 'bold',
        // marginTop: 10,
        fontSize: Dimensions.get('window').width / 35,
        fontFamily: 'Pacifico',//Platform.OS==='ios'?'Pacifico':"r0c0i - Linotte Bold",
        textAlign: 'center',
        color: '#FFF'
        // backgroundColor: '#FFF'
    },
    description: {
        width: '80%',
        height: '50%',
        marginTop: 20,
        // backgroundColor: '#FFF'
    },
    textDescription: {
        width: '100%',
        height: '100%',
        fontSize: Dimensions.get('window').width / 40
    },
    sunbot: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        width: '25%',
        height: '35%',
        zIndex: 100
    },
    button: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '18%',
        height: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100
    },
    column: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: '100%',
        height: '100%',
        zIndex: 10,
    },
    viewButton: {
        position: 'absolute',
        right: 20,
        bottom: 60,
        width: '90%',
        height: '70%',
        zIndex: 10,
        // backgroundColor: '#FFF'
    },
    menuButton: {
        width: '100%',
        height: '30%',
        marginBottom: 2,
        marginTop: 2,
        zIndex: 10
    }
});