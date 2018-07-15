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
    Platform
} from 'react-native'
import Constant from '../../constants/Constant'
import ImageSlider from 'react-native-image-slider';
import { BlurView, VibrancyView } from 'react-native-blur';
import CallApi from '../../Api/CallApi';

export default class Lesson extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr_images: [
                // 'https://placeimg.com/640/640/nature',
                // 'https://placeimg.com/640/640/people',
                // 'https://placeimg.com/640/640/animals',
                // 'https://placeimg.com/640/640/beer',
            ],
            arr_info: [],
            position: 1,
            interval: null
        }
    }

    componentWillMount() {
        this.getSlider()
        this.setState({
            interval: setInterval(() => {
                this.setState({ position: this.state.position === 2 ? 0 : this.state.position + 1 });
            }, 2000)
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
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
        return (
            <ImageBackground
                style={styles.container}
                source={require('../../../assets/bg-sunbot-3.png')}
            >
                <View
                    style={styles.viewTop}
                >
                    <View
                        style={styles.viewBot}
                    >
                        <TouchableOpacity
                            style={{
                                marginLeft: 10,
                                height: Dimensions.get('window').height / 7,
                                width: Dimensions.get('window').height / 7,
                            }}
                            onPress={() => goBack(null)}
                        >
                            <Image
                                style={styles.iconSmall}
                                source={require('../../../assets/ic-back.png')}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                        <View
                            style={styles.centerView}
                        >
                            <Text
                                style={styles.title}
                            >
                                {`Bài ${index}`}
                            </Text>
                            <Text
                                style={styles.subTitle}
                            >
                                {description}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={styles.topRightView}
                    >
                        <TouchableOpacity
                            style={styles.buttonIcon}
                        >
                            <Image
                                style={styles.icon}
                                resizeMode='contain'
                                source={require('../../../assets/ic-play.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonIcon}
                        >
                            <Image
                                style={styles.icon}
                                resizeMode='contain'
                                source={require('../../../assets/ic-movie.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonIcon}
                        >
                            <Image
                                style={styles.icon}
                                resizeMode='contain'
                                source={require('../../../assets/ic-about.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={styles.viewSlider}
                >
                    <WebView
                        style={{
                            width: Dimensions.get('window').width,
                            height: 200,
                            // borderRadius: 20,
                            // paddingTop: 10,
                            // paddingBottom: 10,
                            // paddingLeft: 20,
                            // paddingRight: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        source={{uri: 'http://www.lavazza.com/en/lavazza-world/photography/'}}
                    />
                    {/* {this.state.arr_images.length === 0 ?
                        <View
                            style={{
                                // position: 'absolute',
                                // top: 0,
                                // bottom: 0,
                                // left: 0,
                                // right: 0,
                                borderRadius: 20,
                                paddingTop: 10,
                                paddingBottom: 10,
                                paddingLeft: 20,
                                paddingRight: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            blurType='light'
                            blurAmount={8}
                        >
                            <Text
                                style={{
                                    fontSize: Constant.NUMBER.FONT_SIZE_22
                                }}
                            >
                                Không có bài học nào
                            </Text>
                        </View> :
                        <ImageSlider
                            images={this.state.arr_images}
                            customSlide={({ index, item, style, width }) => (
                                <View key={index} style={[style, styles.customSlide]}>
                                    <Image source={{ uri: item }} style={styles.customImage} resizeMode='contain' />
                                </View>
                            )}
                        />
                    } */}
                    {/* <SafeAreaView style={styles.viewSlider}>
                        <ImageSlider
                            // loopBothSides
                            // autoPlayWithInterval={3000}
                            // images={this.state.arr_images}
                            images={[
                                `http://placeimg.com/640/480/any`,
                                `http://placeimg.com/640/480/any`,
                                `http://placeimg.com/640/480/any`,
                            ]}
                            customSlide={({ index, item, style, width }) => (
                                <View key={index} style={[style, styles.customSlide]}>
                                    <Image source={{ uri: item }} style={styles.customImage} resizeMode='contain' />
                                </View>
                            )}
                            // customButtons={(position, move) => (
                            //     <View style={styles.buttons}>
                            //         {this.state.arr_images.map((image, index) => {
                            //             return (
                            //                 <TouchableOpacity
                            //                     key={index}
                            //                     underlayColor="#ccc"
                            //                     onPress={() => move(index)}
                            //                     style={styles.button}
                            //                 >
                            //                     <Text style={position === index && styles.buttonSelected}>
                            //                         {index + 1}
                            //                     </Text>
                            //                 </TouchableOpacity>
                            //             );
                            //         })}
                            //     </View>
                            // )}
                        />
                    </SafeAreaView> */}
                </View>
                <View
                    style={styles.bottomView}
                >
                    <TouchableOpacity
                        style={{
                            width: Dimensions.get('window').height / 7,
                            height: Dimensions.get('window').height / 7
                        }}
                    >
                        <Image
                            style={{
                                width: Dimensions.get('window').height / 7,
                                height: Dimensions.get('window').height / 7
                            }}
                            source={require('../../../assets/ic-play-1.png')}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: Dimensions.get('window').height / 6,
                            height: Dimensions.get('window').height / 6
                        }}
                        onPress={() => navigate('GamePlay', {
                            lessonId: key
                        })}
                    >
                        <Image
                            style={{
                                width: Dimensions.get('window').height / 6,
                                height: Dimensions.get('window').height / 6
                            }}
                            source={require('../../../assets/ic-play-2.png')}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: Dimensions.get('window').height / 7,
                            height: Dimensions.get('window').height / 7
                        }}
                    >
                        <Image
                            style={{
                                width: Dimensions.get('window').height / 7,
                                height: Dimensions.get('window').height / 7
                            }}
                            source={require('../../../assets/ic-play-3.png')}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentSlider: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewSlider: {
        width: '100%',
        height: '50%',
        margin: 10,
        backgroundColor: 'transparent',
        // borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
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
        width: '65%',
        height: '100%',
        backgroundColor: '#EAC76C',
        alignItems: 'center',
    },
    centerView: {
        height: '100%',
        justifyContent: 'center',
        paddingLeft: 10
    },
    slider: { backgroundColor: '#000', height: 350 },
    content1: {
        width: '100%',
        height: 50,
        marginBottom: 10,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content2: {
        width: '100%',
        height: 100,
        marginTop: 10,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentText: { color: '#fff' },
    buttons: {
        zIndex: 1,
        height: 15,
        marginTop: -25,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    button: {
        margin: 3,
        width: 15,
        height: 15,
        opacity: 0.9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSelected: {
        opacity: 1,
        color: 'red',
    },
    customSlide: {
        // width: '100%',
        // height: '100%',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    customImage: {
        width: '100%',
        height: '100%',
    },
    bottomView: {
        width: '45%',
        height: '25%',
        flexDirection: 'row',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#E68F84',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topRightView: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: Constant.NUMBER.FONT_SIZE_22,
        fontWeight: 'bold',
        fontFamily: 'Pacifico',
        color: '#FFF'
    },
    subTitle: {
        width: '75%',
        fontSize: Constant.NUMBER.FONT_SIZE_12,
        color: '#FFF'
    },
    iconSmall: {
        height: Dimensions.get('window').height / 7,
        width: Dimensions.get('window').height / 7,
    },
    buttonIcon: {
        padding: 10
    },
    icon: {
        width: 47,
        height: 47
    },
});