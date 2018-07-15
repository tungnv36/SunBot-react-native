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
    Animated,
    Platform,
    ActivityIndicator,
    StatusBar
} from 'react-native'
import Constant from '../../constants/Constant'
import { BlurView, VibrancyView } from 'react-native-blur';
import Immersive from 'react-native-immersive'
import CallApi from '../../Api/CallApi';

export default class LessonList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr_lesson: [],
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
        this.getLesson()
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

    getLesson = async () => {
        const { navigation } = this.props;
        const key = navigation.getParam('key', '0');

        const api = CallApi.createAPI()
        const taskGet = await api.getLesson(key)
        var items = []
        if (taskGet.ok) {
            console.log('taskGet A', taskGet.data)
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
                        content: data[i].content
                    })
                }
                console.log('items', items)
                this.setState({
                    arr_lesson: items
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
        const { navigate, goBack } = this.props.navigation
        const { navigation } = this.props;
        const key = navigation.getParam('key', '0');
        const index = navigation.getParam('index', '0');
        const description = navigation.getParam('description', '');
        return (
            <ImageBackground
                style={styles.constain}
                source={require('../../../assets/new-bg-sunbot-2.png')}
            >
                {this.state.isLoading ? this.renderLoading() : null}
                <View
                    style={{
                        width: '100%',
                        height: '10%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <TouchableOpacity
                        style={styles.buttonIcon}
                        onPress={() => goBack(null)}
                    >
                        <Image
                            style={{
                                width: 30,
                                height: 30
                            }}
                            resizeMode='contain'
                            source={require('../../../assets/new-delete.png')}
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 22,
                            color: '#F00',
                            fontWeight: 'bold',
                            fontFamily: 'Pacifico',//Platform.OS==='ios'?'Pacifico':"r0c0i - Linotte Bold",
                        }}
                    >

                    </Text>
                    <View
                        style={{
                            width: 50,
                            height: 50
                        }}
                    />
                </View>
                <View
                    style={{
                        width: '100%',
                        height: '65%',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <FlatList
                        style={{
                            width: (this.state.arr_lesson.length * (Dimensions.get('window').width / 3 - 40) + this.state.arr_lesson.length * 20) > Dimensions.get('window').width ? '100%' : this.state.arr_lesson.length * (Dimensions.get('window').width / 3 - 40) + this.state.arr_lesson.length * 20,
                            height: '70%',
                            marginLeft: 10,
                            marginRight: 10,
                            marginTop: 10
                        }}
                        data={this.state.arr_lesson}
                        renderItem={
                            ({ item, index }) => (
                                <TouchableOpacity
                                    style={[styles.row, {
                                        transform: [{
                                            scale: this.state.scaleItem
                                        }]
                                    }]}
                                    onPress={() => navigate('Lesson', {
                                        key: item.key,
                                        description: item.description,
                                        index: index + 1,
                                        content: item.content
                                    })}
                                >
                                    <ImageBackground
                                        style={styles.subrow}
                                        source={require('../../../assets/new-pannel-lesson-list.png')}
                                        resizeMode='stretch'
                                    >
                                        <Text
                                            style={{
                                                height: '25%',
                                                paddingTop: 18,
                                                fontSize: 16,
                                                color: '#8A3618',
                                                fontFamily: 'Pacifico',//Platform.OS==='ios'?'Pacifico':"r0c0i - Linotte Bold"
                                            }}
                                        >
                                            {`Bài ${index + 1}`}
                                        </Text>
                                        {item.background === '' ?
                                            <View
                                                style={{
                                                    width: '30%',
                                                    height: '30%',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    // backgroundColor: '#FFF',
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
                                                    // backgroundColor: '#FFF',
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
                                                marginLeft: 5,
                                                marginRight: 5,
                                                textAlign: 'center',
                                                color: '#0C5050'
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
                </View>
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
                        {`Khoá ${index}`}
                    </Text>
                    <Text
                        style={{
                            color: '#000',
                            fontSize: 12,
                        }}
                    >
                        {description}
                    </Text>
                </ImageBackground>
                {/* <ImageBackground
                    style={styles.viewTop}
                    source={require('../../../assets/pannel-bottom.png')}
                >
                    <Animated.Image
                        style={[styles.logo, {
                            transform: [{
                                translateY: this.state.bottomSunBot.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [Dimensions.get('window').height / 2, 10]
                                }),
                            }]
                        }]}
                        source={require('../../../assets/sunbot-right.png')}
                        resizeMode='contain'
                    />
                    <View
                        style={styles.viewBot}
                    ></View>
                    <View
                        style={styles.viewText}
                    >
                        <Text
                            style={{
                                fontSize: 25,
                                fontFamily: 'Pacifico',
                                color: '#FFF',
                            }}
                        >
                            {`Khoá ${index}`}
                        </Text>
                        <Text
                            style={{
                                color: '#FFF',
                                fontSize: 12,
                            }}
                        >
                            {description}
                        </Text>
                    </View>
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
                                source={require('../../../assets/ic-stone-play.png')}
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
                                source={require('../../../assets/ic-stone-movie.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonIcon}
                        >
                            <Image
                                style={styles.icon}
                                resizeMode='contain'
                                source={require('../../../assets/ic-stone-about.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </ImageBackground> */}
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
        paddingLeft: 30,
        width: '50%',
        height: '20%',
        justifyContent: 'center',
        left: 150,
        bottom: 50
    },
    logo: {
        width: '20%',
        height: '150%',
        position: 'absolute',
        left: 0,
        bottom: -10
    },
    // row: {
    //     width: (Dimensions.get('window').width - 120) / 6,
    //     height: (Dimensions.get('window').width - 120) / 6,
    //     borderRadius: 10,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     margin: 10,
    //     backgroundColor: '#FFF'
    //     // borderWidth: 1,
    //     // borderColor: '#FFF'
    // },
    row: {
        width: Dimensions.get('window').width / 3 - 40,
        height: 2.5 * Dimensions.get('window').height / 5 - 20,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    subrow: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        // width: (Dimensions.get('window').width - 120) / 6,
        // height: (Dimensions.get('window').width - 120) / 6,
        // borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // margin: 10,
        // borderWidth: 1,
        // borderColor: '#FFF'
    },
    textRow: {
        color: '#525252',//'#737373',
        fontSize: Constant.NUMBER.FONT_SIZE_LARGE
    },
    bottomView: {
        width: '100%',
        height: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 10
        // paddingRight: 10,
        // paddingTop: 10,
        // backgroundColor: '#DDD'
    },
    buttonIcon: {
        padding: 5
    },
    icon: {
        width: 40,
        height: 40
    },
    iconSmall: {
        height: Dimensions.get('window').height / 7,
        width: Dimensions.get('window').height / 7,
    },
    titleView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 15,
        paddingBottom: 15
    },
    centerView: {
        height: '100%',
        justifyContent: 'center',
        paddingLeft: 10
    },
    title: {
        fontSize: Constant.NUMBER.FONT_SIZE_22,
        fontWeight: 'bold',
        fontFamily: 'Pacifico',//Platform.OS==='ios'?'Pacifico':"r0c0i - Linotte Bold",
        color: '#FFF'
    },
    subTitle: {
        fontSize: Constant.NUMBER.FONT_SIZE_12,
        color: '#FFF'
    }
})