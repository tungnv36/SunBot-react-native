import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    Platform,
    StatusBar,
    Animated,
    ActivityIndicator
} from 'react-native'
import Constant from '../../constants/Constant'
import CallApi from '../../Api/CallApi'
import { CLIENT_ERROR } from 'apisauce'
import { BlurView, VibrancyView } from 'react-native-blur'
import { PlaySound, StopSound, PlaySoundRepeat, PlaySoundMusicVolume } from 'react-native-play-sound'
import Immersive from 'react-native-immersive'

export default class Courses extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr_courses: [],
            viewRef: null,
            bottomSunBot: new Animated.Value(0),
            scaleItem: new Animated.Value(0),
            isLoading: true,
        }
        if (Platform.OS === 'android') {
            StatusBar.setHidden(true)

            Immersive.on()
            Immersive.setImmersive(true)
        }
    }

    componentWillMount() {
        this.getCourses()
        // setTimeout(() => {
        Animated.spring(
            this.state.bottomSunBot,
            {
                toValue: 1,
                bounciness: 15,
                useNativeDriver: true
            }
        ).start()
        Animated.spring(
            this.state.scaleItem,
            {
                toValue: 1,
                bounciness: 15,
                useNativeDriver: true
            }
        ).start()
        // }, 500)
    }

    getCourses = async () => {
        const api = CallApi.createAPI()
        const taskGet = await api.getCourses()
        var items = []
        if (taskGet.ok) {
            console.log('taskGet', taskGet.data)
            var data = taskGet.data
            if (data === null) {
                setTimeout(() => {
                    alert('Không có khoá học nào')
                })
            } else {
                for (let i = 0; i < data.length; i++) {
                    items.push({
                        key: data[i].id.toString(),
                        name: data[i].name,
                        background: data[i].background,
                        description: data[i].description,
                    })
                }
                console.log(items)
                this.setState({
                    arr_courses: items
                })
                setTimeout(() => {
                    this.setState({
                        isLoading: false,
                    })
                }, 3000)
            }
        }
    }

    renderLoading() {
        return (
            <View
                style={{
                    backgroundColor: '#FFF',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                }}
            >
                {Platform.OS === 'android' ?
                    <ActivityIndicator
                        size={Platform.OS === 'ios' ? 1 : 80}
                    /> :
                    <Image
                        style={{
                            width: 80,
                            height: 80
                        }}
                        source={require('../../../assets/loading5.gif')}
                        resizeMode='contain'
                    />
                }
            </View>
        )
    }

    render() {
        const { navigate } = this.props.navigation
        return (
            <ImageBackground
                style={styles.constain}
                source={require('../../../assets/new-bg-sunbot.png')}
                ref={1}
            >
                {this.state.isLoading ? this.renderLoading() : null}
                {/* {this.state.isFinish === true ?
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: '#FF0'
                    }}
                >
                </Animated.View>:null} */}

                <FlatList
                    style={{
                        width: (this.state.arr_courses.length * (Dimensions.get('window').width / 3 - 40) + this.state.arr_courses.length * 20) > Dimensions.get('window').width ? '100%' : this.state.arr_courses.length * (Dimensions.get('window').width / 3 - 40) + this.state.arr_courses.length * 20,
                        height: '70%',
                        marginLeft: 10,
                        marginRight: 10,
                        marginTop: 40
                    }}
                    data={this.state.arr_courses}
                    renderItem={
                        ({ item, index }) => (
                            <TouchableOpacity
                                style={[styles.row, {
                                    transform: [{
                                        scale: this.state.scaleItem
                                    }]
                                }]}
                                onPress={() => {
                                    // PlaySound('press')
                                    navigate('LessonList', {
                                        key: item.key,
                                        description: item.description,
                                        index: index + 1
                                    })
                                }
                                }
                            >
                                <ImageBackground
                                    style={styles.subrow}
                                    source={require('../../../assets/new-pannel-course.png')}
                                    resizeMode='stretch'
                                >
                                    <Text
                                        style={{
                                            height: '25%',
                                            paddingTop: 18,
                                            fontSize: 16,
                                            color: '#8A3618',
                                            fontFamily: 'Pacifico',//Platform.OS==='ios'?'Pacifico':"r0c0i - Linotte Bold",
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {`Khoá ${index + 1}`}
                                    </Text>
                                    {item.background === '' ?
                                        <View
                                            style={{
                                                width: '30%',
                                                height: '30%',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#FFF',
                                                borderRadius: 5,
                                                padding: 10,
                                                marginTop: 20,
                                                marginBottom: 10
                                            }}
                                        />
                                        :
                                        <Image
                                            style={{
                                                width: '30%',
                                                height: '30%',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#FFF',
                                                borderRadius: 5,
                                                padding: 10,
                                                marginTop: 20,
                                                marginBottom: 10
                                            }}
                                            source={{ uri: item.background }}
                                            resizeMode='cover'
                                        />
                                    }

                                    <Text
                                        style={{
                                            height: '35%',
                                            marginLeft: Platform.OS === 'ios' ? 5 : 20,
                                            marginRight: Platform.OS === 'ios' ? 5 : 20,
                                            textAlign: 'center',
                                            color: '#FFFFFF'
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        )
                    }
                    horizontal={true}
                />
                <View
                    style={styles.bottomView}
                >
                    <TouchableOpacity
                        style={styles.buttonIcon}
                        onPress={() => navigate('PlayVideo', {
                            url: 'https://www.youtube.com/embed/XqZsoesa55w'
                        })}
                    >
                        <Image
                            style={styles.icon}
                            resizeMode='contain'
                            source={require('../../../assets/new-play.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonIcon}
                        onPress={() => navigate('PlayVideo', {
                            url: 'https://www.youtube.com/embed/v2nQOUL6hWs'
                        })}
                    >
                        <Image
                            style={styles.icon}
                            resizeMode='contain'
                            source={require('../../../assets/new-movie.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonIcon}
                    >
                        <Image
                            style={styles.icon}
                            resizeMode='contain'
                            source={require('../../../assets/new-about.png')}
                        />
                    </TouchableOpacity>
                </View>
                <Animated.Image
                    style={{
                        width: '20%',
                        height: '30%',
                        position: 'absolute',
                        left: 20,
                        bottom: 20,
                        transform: [{
                            translateY: this.state.bottomSunBot.interpolate({
                                inputRange: [0, 1],
                                outputRange: [Dimensions.get('window').height / 2, 10]
                            }),
                        }]
                    }}
                    source={require('../../../assets/sunbot-right.png')}
                    resizeMode='contain'
                />
                <ImageBackground
                    style={styles.viewText}
                    source={require('../../../assets/new-pannel-description.png')}
                    resizeMode='contain'
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontFamily: 'Pacifico',//Platform.OS==='ios'?'Pacifico':"r0c0i - Linotte Bold",
                            color: '#000',
                        }}
                    >
                        Sunbot xin chào!
                            </Text>
                    <Text
                        style={{
                            color: '#000',
                            fontSize: 12,
                        }}
                    >
                        Chúng ta cùng bắt đầu thử thách nhé!
                            </Text>
                </ImageBackground>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    constain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    viewTop: {
        flexDirection: 'row',
        width: '100%',
        height: '25%'
    },
    viewBot: {
        flexDirection: 'row',
        marginLeft: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        width: '20%',
        height: '100%',
        alignItems: 'flex-end',
    },
    viewText: {
        position: 'absolute',
        paddingLeft: 25,
        width: '45%',
        height: '20%',
        justifyContent: 'center',
        left: 150,
        bottom: 50
        // backgroundColor: '#FFF'
    },
    logo: {
        width: '20%',
        height: '150%',
        position: 'absolute',
        left: 0
    },
    row: {
        width: Dimensions.get('window').width / 3 - 40,
        height: 2.5 * Dimensions.get('window').height / 5 - 20,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    subrow: {
        width: Dimensions.get('window').width / 3 - 40,
        height: 2.5 * Dimensions.get('window').height / 5 - 20,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        // padding: 10
    },
    textRow: {
        fontSize: Constant.NUMBER.FONT_SIZE_LARGE,
        textAlign: 'center',
    },
    bottomView: {
        width: '100%',
        height: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 10
        // backgroundColor: '#DDDDDD'
    },
    buttonIcon: {
        padding: 5
    },
    icon: {
        width: 40,
        height: 40,
    }
})
