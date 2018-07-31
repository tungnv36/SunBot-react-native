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
    ScrollView,
    Platform,
    Animated,
    ActivityIndicator,
    PanResponder,
    BackHandler,
    StatusBar
} from 'react-native'
import TimerMixin from 'react-timer-mixin'
import { CLIENT_ERROR } from 'apisauce'
import { BlurView, VibrancyView } from 'react-native-blur'
import Svg, {
    Polyline, Stop
} from 'react-native-svg'
import Immersive from 'react-native-immersive'
import { PlaySound, StopSound, PlaySoundRepeat, PlaySoundMusicVolume } from 'react-native-play-sound'
import Constant from '../../constants/Constant'
import CallApi from '../../Api/CallApi'

const w = 7 * (Dimensions.get('window').width - 45) / 80
const h = 9 * (Dimensions.get('window').height - 10) / 80
const sizeTarget = 27 * (Dimensions.get('window').height - 10) / 80
const startX = 5
const startY = 5
const wBot = 3 * h / 4//9 * (Dimensions.get('window').height - 10) / 80
const hBot = 3 * h / 4//8 * (Dimensions.get('window').height - 45) / 80
const numberOfWidth = 8
const numberOfHeight = 8
const sunBotType = 1
const finishType = 2
const vatCanType = 3

class DrawSquare extends Component {
    constructor(props) {
        super(props);
        // console.log('IMG: ', this.props)
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', function () {
            StopSound()
            // if (!this.onMainScreen()) {
            //     this.goBack()
            //     return true
            // }
            // return false
        });
    }

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    width: w,
                    height: h,
                    left: this.props.col * w + startX,
                    bottom: this.props.row * h + startY,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* {
                    this.props.type !== 2 ? <View /> :
                        <Image
                            style={{
                                width: w * 3,
                                height: h * 3,
                                position: 'absolute',
                                left: -w,
                                top: -h
                            }}
                            source={require('../../../assets/light.png')}
                            resizeMode='stretch'
                        />
                } */}
                {
                    this.props.type === 4 ? <View /> :
                        this.props.type === 100 || this.props.type === sunBotType || this.props.img === '' || this.props.img === ' ' ?
                            <View
                                style={{
                                    width: w,
                                    height: h,
                                    borderRadius: 5
                                }}
                            >
                                <View
                                    style={{
                                        width: w - 2,
                                        height: h - 2,
                                        backgroundColor: this.props.row % 2 === 0 ? this.props.index % 2 === 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.6)' : this.props.index % 2 === 0 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)',
                                        borderRadius: 5
                                    }}
                                />
                            </View> :
                            <View
                                style={{
                                    width: w,
                                    height: h,
                                    borderRadius: 5
                                }}
                            >
                                <Image
                                    style={{
                                        width: w,
                                        height: h,
                                        position: 'absolute',
                                        left: 0,
                                        top: 0,
                                        // bottom: 0,
                                        // right: 0
                                    }}
                                    source={{ uri: `${this.props.img}?w=${w}&h=${h}` }}
                                    resizeMode='stretch'
                                />
                            </View>
                }
            </View>
        )
    }
}

var timeout
var timeout2

export default class GamePlay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            impediments: [],
            itemGo: [],//[{ key: '0', style: 'first', c: 0, r: 0, d: 0, src: require('../../../assets/ic-up.png') }],
            numOfCol: 8,
            posBeginX: 0,
            posBeginY: 0,
            posBotX: new Animated.Value(w * 0 + w / 2 - wBot / 2 + startX),
            posBotY: new Animated.Value(h * 0 + h / 2 - hBot / 2 + startY),
            posTargetX: 0,
            posTargetY: 0,
            posSelected: new Animated.Value(0),
            marginEndGame: new Animated.Value(0),
            iAnimated: new Animated.Value(0),
            isFinish: false,
            firstData: {},
            isLoading: true,
            cIndex: 0,
            points: '',
            isPlay: true,
            count: 0,
            src: '',
            level: 1,
            isMounted: false,
            description: ''
        }
        this.deg = new Animated.Value(0);
        PlaySoundRepeat('sound')

        if (Platform.OS === 'android') {
            StatusBar.setHidden(true)

            Immersive.on()
            Immersive.setImmersive(true)
        }
    }

    componentWillMount() {
        this.setState({
            isMounted: false,
        })
    }

    componentDidMount() {
        this.setState({
            isMounted: true,
        })
        this.getMap(this.state.level)
        // this.initArray()
    }

    initArray(items) {
        // var items = []
        for (let i = 0; i < 64; i++) {
            items.push({
                id: (new Date()).getTime() + i,
                imageUrl: '',
                indexOfCell: i,
                mapId: this.props.lessonId,
                type: 100
            })
        }
        // return items
        // this.getMap(items)
    }

    getMap = async (level) => {//impediments
        const { navigation } = this.props;
        const key = navigation.getParam('lessonId', '0');
        const api = CallApi.createAPI()
        const taskGet = await api.getMap(key, level)
        var posX = 0
        var posY = 0
        var targetX = 0
        var targetY = 0
        var src = ''
        console.log('KKKK', taskGet)
        if (taskGet.ok) {
            this.setState({
                level
            })
            console.log('taskGetMap', taskGet.data)
            var data = taskGet.data
            if (data === null) {
                setTimeout(() => {
                    alert('Không có khoá học nào')
                })
            } else {
                // var items = []
                var item = []
                for (let j = 0; j < 64; j++) {
                    item.push({
                        id: (new Date()).getTime() + j,
                        imageUrl: '',
                        indexOfCell: j,
                        mapId: this.props.lessonId,
                        type: 100
                    })
                }
                for (let j = 0; j < data.impediments.length; j++) {
                    item.splice(data.impediments[j].indexOfCell, 1, {
                        id: data.impediments[j].id,
                        imageUrl: data.impediments[j].imageUrl,
                        indexOfCell: data.impediments[j].indexOfCell,
                        mapId: data.impediments[j].mapId,
                        type: data.impediments[j].type !== undefined ? data.impediments[j].type : sunBotType
                    })
                    if (data.impediments[j].type === undefined || data.impediments[j].type === sunBotType) {
                        posX = data.impediments[j].indexOfCell % this.state.numOfCol
                        posY = parseInt(data.impediments[j].indexOfCell / this.state.numOfCol)
                        src = `${data.impediments[j].imageUrl}?w=${w}&h=${h}`
                    }
                    if (data.impediments[j].type === finishType) {
                        targetX = data.impediments[j].indexOfCell % this.state.numOfCol
                        targetY = parseInt(data.impediments[j].indexOfCell / this.state.numOfCol)
                    }
                }

                // for (let i = 0; i < data.length; i++) {
                //     var item = []
                //     for (let j = 0; j < 64; j++) {
                //         item.push({
                //             id: (new Date()).getTime() + j,
                //             imageUrl: '',
                //             indexOfCell: j,
                //             mapId: this.props.lessonId,
                //             type: 100
                //         })
                //     }

                //     for (let j = 0; j < data[i].impediments.length; j++) {
                //         item.splice(data[i].impediments[j].indexOfCell, 1, {
                //             id: data[i].impediments[j].id,
                //             imageUrl: data[i].impediments[j].imageUrl,
                //             indexOfCell: data[i].impediments[j].indexOfCell,
                //             mapId: data[i].impediments[j].mapId,
                //             type: data[i].impediments[j].type !== undefined ? data[i].impediments[j].type : sunBotType
                //         })
                //         if (data[i].impediments[j].type === undefined || data[i].impediments[j].type === sunBotType) {
                //             posX.push(data[i].impediments[j].indexOfCell % this.state.numOfCol)
                //             posY.push(parseInt(data[i].impediments[j].indexOfCell / this.state.numOfCol))
                //             src.push(`${data[i].impediments[j].imageUrl}?w=${w}&h=${h}`)
                //         }
                //     }

                //     items.push({
                //         item,
                //         description: data[i].description,
                //         level: data[i].level
                //     })
                //     // console.log('DADADADA: ', items)
                // }
                if (this.state.isMounted) {
                    this.setState({
                        description: data.description,
                        // level: data.level,
                        impediments: item,
                        posBeginX: posX,
                        posBeginY: posY,
                        posTargetX: targetX,
                        posTargetY: targetY,
                        src,
                        firstData: { key: '0', style: 'first', c: posX, r: posY, d: 0, src: require('../../../assets/ic-up.png') },
                    }, () => {
                        console.log('impediments2', this.state.posTargetX + " - " + this.state.posTargetY)
                    })
                    setTimeout(() => {
                        this.setState({
                            isLoading: false,
                        })
                    }, 3000)
                }
                setTimeout(() => {
                    const anim1 = Animated.timing(
                        this.state.posBotX,
                        {
                            toValue: w * posX + w / 2 - wBot / 2 + startX,
                            duration: 10
                        }
                    )
                    const anim2 = Animated.timing(
                        this.state.posBotY,
                        {
                            toValue: h * posY + h / 2 - hBot / 2 + startY,
                            duration: 10
                        }
                    )
                    Animated.parallel([anim1, anim2]).start()
                })
            }
        }
    }

    runBot() {
        if (this.state.itemGo === null || this.state.itemGo.length === 0) {
            return
        }
        var anims = []
        var anims2 = []
        var countTime = 0
        var count = 0
        for (let i = parseInt(this.state.iAnimated._value); i < this.state.itemGo.length; i++) {
            if (this.state.itemGo[i].style === 'move') {
                if (this.state.itemGo[i].state === 0) {
                    const anim1 = Animated.timing(
                        this.state.posBotX,
                        {
                            toValue: w * this.state.itemGo[i].c + w / 2 - wBot / 2 + startX,
                            duration: 1000
                        }
                    )
                    const anim2 = Animated.timing(
                        this.state.posBotY,
                        {
                            toValue: h * this.state.itemGo[i].r + h / 2 - hBot / 2 + startY,
                            duration: 1000
                        }
                    )
                    const anim3 = Animated.timing(
                        this.state.iAnimated,
                        {
                            toValue: i + 1,
                            duration: 1000
                        }
                    )
                    const anim = Animated.parallel([anim1, anim2, anim3])
                    anims.push(anim)
                    countTime = countTime + 1000
                } else {
                    const anim1 = Animated.timing(
                        this.state.posBotX,
                        {
                            toValue: w * this.state.itemGo[i].c + w / 2 - wBot / 2 + startX,//
                            duration: 100
                        }
                    )
                    const anim2 = Animated.timing(
                        this.state.posBotY,
                        {
                            toValue: h * this.state.itemGo[i].r + h / 2 - hBot / 2 + startY,
                            duration: 100
                        }
                    )
                    const anim01 = Animated.parallel([anim1, anim2])
                    const anim3 = Animated.timing(
                        this.state.posBotX,
                        {
                            toValue: w * this.state.itemGo[i].c2 + w / 2 - wBot / 2 + startX,//
                            duration: 100
                        }
                    )
                    const anim4 = Animated.timing(
                        this.state.posBotY,
                        {
                            toValue: h * this.state.itemGo[i].r2 + h / 2 - hBot / 2 + startY,
                            duration: 100
                        }
                    )
                    const anim02 = Animated.parallel([anim3, anim4])
                    const anim03 = Animated.timing(
                        this.state.iAnimated,
                        {
                            toValue: i + 1,
                            duration: 200
                        }
                    )
                    const anim = Animated.sequence([anim02, anim01])
                    const animG = Animated.parallel([anim, anim03])
                    anims.push(animG)
                    countTime = countTime + 200
                }
            } else if (this.state.itemGo[i].style === 'back') {
                if (this.state.itemGo[i].state === 0) {
                    const anim1 = Animated.timing(
                        this.state.posBotX,
                        {
                            toValue: w * this.state.itemGo[i].c + w / 2 - wBot / 2 + startX,
                            duration: 1000
                        }
                    )
                    const anim2 = Animated.timing(
                        this.state.posBotY,
                        {
                            toValue: h * this.state.itemGo[i].r + h / 2 - hBot / 2 + startY,
                            duration: 1000
                        }
                    )
                    const anim3 = Animated.timing(
                        this.state.iAnimated,
                        {
                            toValue: i + 1,
                            duration: 1000
                        }
                    )
                    const anim = Animated.parallel([anim1, anim2, anim3])
                    anims.push(anim)
                    countTime = countTime + 1000
                } else {
                    const anim1 = Animated.timing(
                        this.state.posBotX,
                        {
                            toValue: w * this.state.itemGo[i].c + w / 2 - wBot / 2 + startX,//
                            duration: 100
                        }
                    )
                    const anim2 = Animated.timing(
                        this.state.posBotY,
                        {
                            toValue: h * this.state.itemGo[i].r + h / 2 - hBot / 2 + startY,
                            duration: 100
                        }
                    )
                    const anim01 = Animated.parallel([anim1, anim2])
                    const anim3 = Animated.timing(
                        this.state.posBotX,
                        {
                            toValue: w * this.state.itemGo[i].c2 + w / 2 - wBot / 2 + startX,//
                            duration: 100
                        }
                    )
                    const anim4 = Animated.timing(
                        this.state.posBotY,
                        {
                            toValue: h * this.state.itemGo[i].r2 + h / 2 - hBot / 2 + startY,
                            duration: 100
                        }
                    )
                    const anim03 = Animated.timing(
                        this.state.iAnimated,
                        {
                            toValue: i + 1,
                            duration: 1000
                        }
                    )
                    const anim02 = Animated.parallel([anim3, anim4])
                    const anim = Animated.sequence([anim02, anim01])
                    const animG = Animated.parallel([anim, anim03])
                    anims.push(anim)
                    countTime = countTime + 200
                }
            } else {
                const anim1 = Animated.timing(
                    this.deg,
                    {
                        toValue: this.state.itemGo[i].d,
                        duration: 1000
                    }
                )
                const anim3 = Animated.timing(
                    this.state.iAnimated,
                    {
                        toValue: i + 1,
                        duration: 1000
                    }
                )
                const anim = Animated.parallel([anim1, anim3])
                anims.push(anim)
                countTime = countTime + 1000
            }
        }
        timeout = setTimeout(() => {
            if (this.state.impediments.length > 0) {
                this.setState({
                    isFinish: true
                }, () => {
                    StopSound()
                    Animated.spring(
                        this.state.marginEndGame,
                        {
                            toValue: 1,
                            bounciness: 20,
                            useNativeDriver: true
                        }
                    ).start()
                })
            }
        }, countTime + 200)//anims.length * 1000
        Animated.sequence(anims).start()
    }

    getIcon(action) {
        if (action === 'up') {
            return require('../../../assets/new-up.png')
        } else if (action === 'down') {
            return require('../../../assets/new-down.png')
        } else if (action === 'left') {
            return require('../../../assets/new-left-2.png')
        } else {
            return require('../../../assets/new-right-2.png')
        }
    }

    getColumn(c, deg) {
        switch (deg) {
            case -4:
                return c
            case -3:
                if (c < this.state.numOfCol) {
                    return c + 1
                } else {
                    return c
                }
            case -2:
                return c
            case -1:
                if (c > 0) {
                    return c - 1
                } else {
                    return c
                }
            case 0:
                return c
            case 1:
                if (c < this.state.numOfCol) {
                    return c + 1
                } else {
                    return c
                }
            case 2:
                return c
            case 3:
                if (c > 0) {
                    return c - 1
                } else {
                    return c
                }
            case 4:
                return c
        }
    }

    getRow(r, deg) {
        switch (deg) {
            case -4:
                if (r < this.state.numOfCol - 1) {
                    return r + 1
                } else {
                    return r
                }
            case -3:
                return r
            case -2:
                if (r > 0) {
                    return r - 1
                } else {
                    return r
                }
            case -1:
                return r
            case 0:
                if (r < this.state.numOfCol - 1) {
                    return r + 1
                } else {
                    return r
                }
            case 1:
                return r
            case 2:
                if (r > 0) {
                    return r - 1
                } else {
                    return r
                }
            case 3:
                return r
            case 4:
                if (r < this.state.numOfCol - 1) {
                    return r + 1
                } else {
                    return r
                }
        }
    }

    getColumnBack(c, deg) {
        switch (deg) {
            case -4:
                return c
            case -3:
                if (c > 0) {
                    return c - 1
                } else {
                    return c
                }
            case -2:
                return c
            case -1:
                if (c < this.state.numOfCol - 1) {
                    return c + 1
                } else {
                    return c
                }
            case 0:
                return c
            case 1:
                if (c > 0) {
                    return c - 1
                } else {
                    return c
                }
            case 2:
                return c
            case 3:
                if (c > this.state.numOfCol - 1) {
                    return c + 1
                } else {
                    return c
                }
            case 4:
                return c
        }
    }

    getRowBack(r, deg) {
        switch (deg) {
            case -4:
                if (r > 0) {
                    return r - 1
                } else {
                    return r
                }
            case -3:
                return r
            case -2:
                if (r < parseInt(this.state.impediments.length / this.state.numOfCol)) {
                    return r + 1
                } else {
                    return r
                }
            case -1:
                return r
            case 0:
                if (r > 0) {
                    return r - 1
                } else {
                    return r
                }
            case 1:
                return r
            case 2:
                if (r < parseInt(this.state.impediments.length / this.state.numOfCol)) {
                    return r + 1
                } else {
                    return r
                }
            case 3:
                return r
            case 4:
                if (r > 0) {
                    return r - 1
                } else {
                    return r
                }
        }
    }

    goTop() {
        var arr = this.state.itemGo
        var item = this.state.firstData
        if (item.c === undefined || item.r === undefined) {
            return
        }
        if (arr.length > 0) {
            var item = arr[arr.length - 1]
        }
        var c = this.getColumn(item.c, item.d)
        var r = this.getRow(item.r, item.d)
        var c2 = this.getColumn(item.c, item.d)
        var r2 = this.getRow(item.r, item.d)
        var i = r * this.state.numOfCol + c
        var state = 0//ok
        // console.log('AJAJAJAAJAJ: ', this.state.impediments)
        if (this.state.impediments[i].type === vatCanType) {//là vật cản
            c = item.c
            r = item.r
            state = 1//di vao vat can
        }
        arr.push({
            key: (Number(item.key) + 1).toString(),
            style: 'move',
            c,
            r,
            c2,
            r2,
            d: item.d,
            src: 'up',//require('../../../assets/ic-up.png')
            state
        })

        this.setState({
            itemGo: arr
        }, () => {
            console.log('itemGo', this.state.itemGo)
        })
    }

    goLeft() {
        var arr = this.state.itemGo
        var item = this.state.firstData
        if (item.c === undefined || item.r === undefined) {
            return
        }
        if (arr.length > 0) {
            item = arr[arr.length - 1]
        }
        arr.push({
            key: (Number(item.key) + 1).toString(),
            style: 'rotate',
            c: item.c,
            r: item.r,
            d: item.d > -4 ? item.d - 1 : 0,
            src: 'left'//require('../../../assets/ic-left.png')
        })
        this.setState({
            itemGo: arr
        })
    }

    goRight() {
        var arr = this.state.itemGo
        var item = this.state.firstData
        if (item.c === undefined || item.r === undefined) {
            return
        }
        if (arr.length > 0) {
            item = arr[arr.length - 1]
        }
        arr.push({
            key: (Number(item.key) + 1).toString(),
            style: 'rotate',
            c: item.c,
            r: item.r,
            d: item.d > -4 ? item.d + 1 : 0,
            src: 'right'//require('../../../assets/ic-right.png')
        })
        this.setState({
            itemGo: arr
        })
    }

    goBottom() {
        var arr = this.state.itemGo
        var item = this.state.firstData
        if (item.c === undefined || item.r === undefined) {
            return
        }
        if (arr.length > 0) {
            var item = arr[arr.length - 1]
        }
        var c = this.getColumnBack(item.c, item.d)
        var r = this.getRowBack(item.r, item.d)
        var c2 = c
        var r2 = r
        var i = r * this.state.numOfCol + c
        var state = 0//ok
        if (this.state.impediments[i].type === vatCanType) {//là vật cản
            c = item.c
            r = item.r
            state = 1//di vao vat can
        }
        arr.push({
            key: (Number(item.key) + 1).toString(),
            style: 'back',
            c,
            r,
            c2,
            r2,
            d: item.d,
            src: 'down',//require('../../../assets/ic-down.png')
            state
        })

        this.setState({
            itemGo: arr
        })
    }

    clearGame() {
        this.setState({
            itemGo: [],
            points: ''
        })
        clearTimeout(timeout)
        const anim1 = Animated.timing(
            this.state.posBotX,
            {
                toValue: w * this.state.posBeginX + w / 2 - wBot / 2 + startX,
                duration: 1
            }
        )
        const anim2 = Animated.timing(
            this.state.posBotY,
            {
                toValue: h * this.state.posBeginY + h / 2 - hBot / 2 + startY,
                duration: 1
            }
        )
        const anim = Animated.timing(
            this.deg,
            {
                toValue: 0,
                duration: 1
            }
        )
        const anim3 = Animated.timing(
            this.state.iAnimated,
            {
                toValue: 0,
                duration: 1
            }
        )
        Animated.parallel([anim1, anim2, anim, anim3]).start()
    }

    pauseGame() {
        // if (this.state.isPlay === true) {
        this.state.posBotX.stopAnimation(this.callback)
        this.deg.stopAnimation(this.callback)
        // this.setState({
        //     isPlay: false
        // })
        clearTimeout(timeout)
        // clearTimeout(timeout2)
        // var arrGo = this.state.itemGo.splice(0, this.state.count - 1)
        // console.log('COUNT', this.state.count)
        // this.setState({
        //     itemGo: arrGo
        // }, () => {
        //     console.log('COUNT2', this.state.itemGo.length)
        // })
        // } else {
        //     // this.state.posBotX.interpolate
        //     // this.deg.start()
        //     this.runBot()
        //     this.setState({
        //         isPlay: true
        //     })
        // }
    }

    endGame() {
        this.setState({
            isFinish: false,
        })
        this.clearGame()
        PlaySoundRepeat('sound')
    }

    checkWin() {
        var item = this.state.itemGo[this.state.itemGo.length - 1]
        var r = item.r
        var c = item.c
        var lastItem = this.state.impediments[r * this.state.numOfCol + c]//this.state.impediments[this.state.level - 1].item[r * this.state.numOfCol + c]
        var type = lastItem.type
        if (type === finishType) {
            return true
        } else {
            return false
        }
    }

    renderPanelWin() {
        return (
            <Animated.View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: Dimensions.get('window').width / 2 + 100,
                    height: Dimensions.get('window').height / 2 + 100,
                    borderRadius: 10,
                    zIndex: 3,
                    transform: [{ scale: this.state.marginEndGame }],
                    // backgroundColor: '#E8C578'
                }}
            >
                <Image
                    style={{
                        position: 'absolute',
                        top: 50,
                        left: 50,
                        width: Dimensions.get('window').width / 2,
                        height: Dimensions.get('window').height / 2,
                    }}
                    source={require('../../../assets/new-pannel-1.png')}
                    resizeMode='stretch'
                />
                <Image
                    style={{
                        position: 'absolute',
                        top: Dimensions.get('window').height / 4 + 50,
                        left: - Dimensions.get('window').height / 8 + 80,
                        width: Dimensions.get('window').height / 4,
                        height: Dimensions.get('window').height / 4,
                    }}
                    source={require('../../../assets/sunbot.png')}
                    resizeMode='contain'
                />
                <Image
                    style={{
                        position: 'absolute',
                        width: Dimensions.get('window').width / 2,
                        height: Dimensions.get('window').width / 2,
                    }}
                    source={require('../../../assets/animated-fireworks-01.gif')}
                />
                <Text
                    style={{
                        fontSize: Dimensions.get('window').width / 30,
                        fontFamily: 'Pacifico',//Platform.OS==='ios'?'Pacifico':"r0c0i - Linotte Bold",
                        fontWeight: 'bold',
                        color: '#000000'//'#1A67EB'//'#032730'
                    }}
                >
                    Bé giỏi quá!
                                </Text>
                <Text
                    style={{
                        fontSize: Dimensions.get('window').width / 30,
                        fontFamily: 'Pacifico',//Platform.OS==='ios'?'Pacifico':"r0c0i - Linotte Bold",
                        fontWeight: 'bold',
                        color: '#000000'//'#1A67EB'//'#032730'
                    }}
                >
                    Cùng tiếp tục nào
                </Text>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        width: '40%',
                        height: 60,
                        bottom: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={() => this.endGame()}
                >
                    <Image
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                        source={require('../../../assets/new-play.png')}
                        resizeMode='contain'
                    />
                    {/* <Text
                        style={{
                            position: 'absolute',
                            fontFamily: 'Comic Kings',
                            fontSize: 14,
                            color: '#5F5F5F'
                        }}
                    >
                        NEXT
                    </Text> */}
                </TouchableOpacity>
            </Animated.View>
        )
    }

    renderPanelGameOver() {
        return (
            <Animated.View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: Dimensions.get('window').width / 2 + 100,
                    height: Dimensions.get('window').height / 2 + 100,
                    borderRadius: 10,
                    zIndex: 3,
                    transform: [{ scale: this.state.marginEndGame }],
                    // backgroundColor: '#E8C578'
                }}
            >
                <Image
                    style={{
                        position: 'absolute',
                        top: 50,
                        left: 50,
                        width: Dimensions.get('window').width / 2,
                        height: Dimensions.get('window').height / 2,
                    }}
                    source={require('../../../assets/new-pannel-1.png')}
                    resizeMode='stretch'
                />
                <Image
                    style={{
                        position: 'absolute',
                        top: Dimensions.get('window').height / 4 + 50,
                        left: - Dimensions.get('window').height / 8 + 60,
                        width: Dimensions.get('window').height / 4,
                        height: Dimensions.get('window').height / 4,
                    }}
                    source={require('../../../assets/sunbot-sad.png')}
                    resizeMode='contain'
                />
                <Text
                    style={{
                        fontSize: Dimensions.get('window').width / 30,
                        fontFamily: 'Pacifico',//Platform.OS==='ios'?'Pacifico':"r0c0i - Linotte Bold",
                        fontWeight: 'bold',
                        color: '#000000'//'#1A67EB'//'#032730'
                    }}
                >
                    Thua mất rồi!
                                </Text>
                <Text
                    style={{
                        fontSize: Dimensions.get('window').width / 30,
                        fontFamily: 'Pacifico',//Platform.OS==='ios'?'Pacifico':"r0c0i - Linotte Bold",
                        fontWeight: 'bold',
                        color: '#000000'//'#1A67EB'//'#032730'
                    }}
                >
                    Cùng thử lại nhé
                                </Text>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        width: '40%',
                        height: 60,
                        bottom: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={() => this.endGame()}
                >
                    <Image
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                        source={require('../../../assets/new-play.png')}//button3.png
                        resizeMode='contain'
                    />
                    {/* <Text
                        style={{
                            position: 'absolute',
                            fontFamily: 'Comic Kings',
                            fontSize: 14,
                            color: '#5F5F5F'
                        }}
                    >
                        REPLAY
                    </Text> */}
                </TouchableOpacity>
            </Animated.View>
        )
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
                {/* <Animation
                    ref={animation => {
                        this.animation = animation;
                    }}
                    style={{
                        width: 80,
                        height: 80
                    }}
                    loop={true}
                    source={anim}
                /> */}

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

    onPress(evt) {
        // const { locationX, locationY } = evt.nativeEvent
        // console.log('location', `${locationX}-${locationY}`)
        // var points = `${this.state.points} ${locationX},${locationY}`
        // this.setState({
        //     points
        // }, () => {
        //     console.log('points', this.state.points)
        // })
    }

    onMove(evt) {
        const { locationX, locationY } = evt.nativeEvent

        var posX = parseInt(locationX / w)
        var posY = parseInt(locationY / h)

        var locX = posX * w + w / 2 + startX
        var locY = posY * h + h / 2 + startY

        // console.log(`${locX} - ${locY}`)
        var points = `${locX},${locY}`

        var arrPoint = this.state.points.split(' ')
        if (arrPoint.length == 0) {
            this.setState({
                points
            })
        } else {
            if (this.state.points.indexOf(points) === -1) {
                var points2 = `${this.state.points} ${points}`
                this.setState({
                    points: points2
                }, () => {
                    console.log(this.state.points)
                })
            }
        }

        // if (arrPoint.length > 1) {
        //     var dis = Math.sqrt(locationX - X) * (locationX - X) + (locationY - Y) * (locationY - Y)
        //     if (dis > 50 || isNaN(dis)) {
        //         var points = `${this.state.points} ${locationX},${locationY}`
        //         this.setState({
        //             points
        //         })
        //     }
        // } else {
        //     var points = `${this.state.points} ${locationX},${locationY}`
        //     this.setState({
        //         points
        //     })
        // }
    }

    onRelease(evt) {
        // const { locationX, locationY } = evt.nativeEvent
        // console.log(locationX, locationY)
    }

    renderMainGame() {
        const posBotX = this.state.posBotX
        const posBotY = this.state.posBotY
        const posSelected = this.state.posSelected
        const rad = 0.0174532925
        const interpolateRotation = this.deg.interpolate({
            inputRange: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
            outputRange: ['-360deg', '-270deg', '-180deg', '-90deg', '0deg', '90deg', '180deg', '270deg', '360deg'],
        })
        return (
            <ImageBackground
                style={styles.viewGameBoard}
                source={require('../../../assets/new-green-bg.png')}
                resizeMode='stretch'
            >
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 10
                    }}
                    onStartShouldSetResponder={() => true}
                    onMoveShouldSetResponder={() => true}
                    onResponderGrant={this.onPress.bind(this)}
                    onResponderMove={this.onMove.bind(this)}
                    onResponderRelease={this.onRelease.bind(this)}
                />
                <Animated.Image
                    style={{
                        width: sizeTarget,
                        height: sizeTarget,
                        position: 'absolute',
                        left: startX + this.state.posTargetX * w - (sizeTarget - w)/2,
                        top: startY + (this.state.numOfCol - this.state.posTargetY - 1) * h - h,
                    }}
                    source={require('../../../assets/light.png')}
                    resizeMode='stretch'
                />
                {this.state.impediments.length > 0 ? this.state.impediments.map((item, index) =>
                    <DrawSquare
                        col={item.indexOfCell % this.state.numOfCol}
                        row={parseInt(item.indexOfCell / this.state.numOfCol)}
                        index={item.indexOfCell}
                        key={item.id}
                        type={item.type}
                        img={item.imageUrl}
                    />
                ) : <View />}
                <Animated.Image
                    style={{
                        position: 'absolute',
                        width: wBot,
                        height: hBot,
                        left: posBotX,
                        bottom: posBotY,
                        zIndex: 2,
                        transform: [{ rotate: interpolateRotation }]
                    }}
                    source={this.state.src === '' ? require('../../../assets/sunbot-icon.png') : { uri: this.state.src }}
                    // source={{ uri: `${this.state.impediments[]}?w=${w}&h=${h}` }}
                    resizeMode='cover'
                >
                </Animated.Image>
                {this.state.points !== '' ?
                    <Svg
                        width='100%'
                        height='100%'
                    >
                        <Polyline
                            points={this.state.points}
                            fill='none'
                            stroke='red'
                            strokeWidth='3'
                        />
                    </Svg> : null}
            </ImageBackground>
        )
    }

    erase() {
        this.setState({
            points: ''
        })
    }

    closeComponent() {
        const { navigate, goBack } = this.props.navigation
        goBack(null)
        StopSound()
    }

    backLevel() {
        this.getMap(this.state.level - 1)
        // if (this.state.level > 1) {
        //     this.setState({
        //         level: this.state.level - 1,
        //         // firstData: { key: '0', style: 'first', c: this.state.posBeginX, r: this.state.posBeginY, d: 0, src: require('../../../assets/ic-up.png') },
        //     }, () => {
        //         this.clearGame()
        //         this.getMap(this.state.level - 1)
        //     })
        // }
    }

    nextLevel() {
        this.getMap(this.state.level + 1)
        // if (this.state.level < this.state.impediments.length) {
        //     this.setState({
        //         level: this.state.level + 1,
        //         // firstData: { key: '0', style: 'first', c: this.state.posBeginX, r: this.state.posBeginY, d: 0, src: require('../../../assets/ic-up.png') },
        //     }, () => {
        //         this.clearGame()
        //         this.getMap(this.state.level + 1)
        //     })
        // }
    }

    render() {
        const posSelected = this.state.posSelected
        const { navigate, goBack } = this.props.navigation
        return (
            <ImageBackground
                style={styles.container}
                source={require('../../../assets/new-bg-main-game.png')}
                resizeMode='stretch'
            >
                {this.state.isFinish === true ?
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(52, 52, 52, 0.8)'
                        }}
                    >
                        {this.checkWin() === true ? this.renderPanelWin() : this.renderPanelGameOver()}
                    </Animated.View> : null}
                {this.state.isLoading ? this.renderLoading() : null}
                <View
                    style={styles.viewLeft}
                >
                    {this.renderMainGame()}
                    <View
                        style={styles.viewStep}
                    >
                        <View
                            style={styles.styleViewFlatlist}
                        >
                            <FlatList
                                style={styles.styleFlatlist}
                                ref={(ref) => { this.flatListRef = ref }}
                                data={this.state.itemGo}
                                extraData={this.state}
                                horizontal={true}
                                renderItem={({ item, index }) =>
                                    <View
                                        style={{
                                            width: (Dimensions.get('window').height - 10) / 13,
                                            height: (Dimensions.get('window').height - 10) / 14,
                                            marginLeft: 2,
                                            marginRight: 2,
                                            padding: 1,
                                            // borderRadius: (Dimensions.get('window').height - 10) / 28,
                                            // borderBottomWidth: 3,
                                            // borderColor: '#FFF'
                                        }}
                                    >
                                        <Image
                                            style={{
                                                width: '100%',//(Dimensions.get('window').height - 10) / 13,
                                                height: '100%',//(Dimensions.get('window').height - 10) / 13,
                                                borderRadius: (Dimensions.get('window').height - 10) / 28,
                                                borderBottomWidth: 3,
                                                borderColor: '#FFF'
                                            }}
                                            source={this.getIcon(item.src)}//{item.src}
                                            resizeMode='contain'
                                        />
                                    </View>
                                }
                            />
                        </View>
                    </View>
                </View>
                <View
                    style={styles.viewRight}
                >
                    <View
                        style={{
                            width: '70%',
                            height: 1 * Dimensions.get('window').height / 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: 10
                        }}
                    >
                        <TouchableOpacity
                            style={styles.NBButton}
                            onPress={() => this.backLevel()}
                        >
                            <Image
                                style={styles.bottomControlSmall}
                                source={require('../../../assets/new-back.png')}
                                resizeMode='stretch'
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize: Dimensions.get('window').width / 50,
                                color: '#FFF',
                                fontWeight: 'bold',
                            }}
                        >
                            {this.state.level}
                            {/* {this.state.impediments.length > 0 ? this.state.impediments.level : ''} */}
                        </Text>
                        <TouchableOpacity
                            style={styles.NBButton}
                            onPress={() => this.nextLevel()}
                        >
                            <Image
                                style={styles.bottomControlSmall}
                                source={require('../../../assets/new-next.png')}
                                resizeMode='stretch'
                            />
                        </TouchableOpacity>
                    </View>
                    <ImageBackground
                        style={styles.viewDescription}
                        source={require('../../../assets/new-pannel-course.png')}
                        resizeMode='stretch'
                    >
                        <Text
                            style={{
                                marginTop: 5,
                                marginBottom: 10,
                                fontWeight: 'bold',
                                fontSize: Dimensions.get('window').width / 50
                            }}
                        >
                            Nhiệm vụ
                        </Text>
                        <ScrollView
                            style={{
                                marginLeft: 10,
                                marginRight: 10,
                                marginBottom: 10
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: Dimensions.get('window').width / 60
                                }}
                            >
                                {this.state.description}
                                {/* {this.state.impediments.length > 0 ? this.state.impediments[this.state.level - 1].description : ''} */}
                            </Text>
                        </ScrollView>
                    </ImageBackground>
                    <View
                        style={styles.viewTopControl}
                    >
                        <TouchableOpacity
                            style={styles.bottomControlViewSmall}
                            onPress={() => this.erase()}
                        >
                            <Image
                                style={styles.bottomControlSmall}
                                source={require('../../../assets/new-earse.png')}
                                resizeMode='stretch'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.bottomControlViewSmall}
                            onPress={() => this.clearGame()}
                        >
                            <Image
                                style={styles.bottomControlSmall}
                                source={require('../../../assets/new-delete.png')}
                                resizeMode='stretch'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.bottomControlViewSmall}
                            onPress={() => this.pauseGame()}
                        >
                            <Image
                                style={styles.bottomControlSmall}
                                source={require('../../../assets/new-pause.png')}
                                resizeMode='stretch'
                            />
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                            style={styles.bottomControlViewSmall}
                            onPress={() => this.runBot()}
                        >
                            <Image
                                style={styles.bottomControlSmall}
                                source={require('../../../assets/new-play.png')}
                                resizeMode='stretch'
                            />
                        </TouchableOpacity> */}
                    </View>
                    <View
                        style={styles.viewBottomControl}
                    >
                        <View
                            style={styles.topControl}
                        >
                            <TouchableOpacity
                                style={styles.bottomControlBig}
                                onPress={() => this.goTop()}
                            >
                                <Image
                                    style={styles.bottomControlBig}
                                    source={require('../../../assets/new-up.png')}
                                    resizeMode='stretch'
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={styles.centerControl}
                        >
                            <TouchableOpacity
                                style={styles.bottomControlBig}
                                onPress={() => this.goLeft()}
                            >
                                <Image
                                    style={styles.bottomControlBig}
                                    source={require('../../../assets/new-left-2.png')}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.bottomControlBig}
                                onPress={() => this.runBot()}
                            >
                                <Image
                                    style={styles.bottomControlBig}
                                    source={require('../../../assets/new-play.png')}
                                    resizeMode='stretch'
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.bottomControlBig}
                                onPress={() => this.goRight()}
                            >
                                <Image
                                    style={styles.bottomControlBig}
                                    source={require('../../../assets/new-right-2.png')}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={styles.bottomControl}
                        >
                            <TouchableOpacity
                                style={styles.bottomControlBig}
                                onPress={() => this.goBottom()}
                            >
                                <Image
                                    style={styles.bottomControlBig}
                                    source={require('../../../assets/new-down.png')}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 60,
                            right: 5,
                            width: 30,
                            height: 30
                        }}
                        onPress={() => this.closeComponent()}
                    >
                        <Image
                            style={{
                                width: '100%',
                                height: '100%'
                            }}
                            source={require('../../../assets/new-delete.png')}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>
                <Image
                    style={{
                        position: 'absolute',
                        width: w * 1.2,
                        height: 2 * h,
                        bottom: 5,
                        left: 7 * Dimensions.get('window').width / 10 - w * 0.6
                    }}
                    source={require('../../../assets/sunbot.png')}
                    resizeMode='contain'
                />
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    viewLeft: {
        width: '70%',
        height: '100%',
        paddingTop: 10,
        paddingBottom: 0,
        paddingLeft: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    },
    viewRight: {
        width: '30%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewStep: {
        width: '100%',
        height: (Dimensions.get('window').height - 10) / 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#BFBFBF',
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
    },
    viewGameBoard: {
        width: 7 * (Dimensions.get('window').width - 30) / 10,
        height: 9 * (Dimensions.get('window').height) / 10,
        backgroundColor: '#FFF',
        marginLeft: 10
        // padding: 5
    },
    viewDescription: {
        width: '100%',//90%
        height: 3 * Dimensions.get('window').height / 8,
        marginTop: 5,
        padding: 5,
        alignItems: 'center',
        // borderBottomLeftRadius: 20,
        // borderBottomRightRadius: 20,
        // backgroundColor: '#EAC76C'
    },
    viewTopControl: {
        flexDirection: 'row',
        width: '95%',
        height: 1 * Dimensions.get('window').height / 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: (Platform.OS === 'ios' ? 10 : 1),
        // backgroundColor: '#DDD'
    },
    viewBottomControl: {
        width: '85%',
        height: 3 * Dimensions.get('window').height / 8,
        padding: 5,
        justifyContent: 'flex-start',
        // backgroundColor: '#DDD'
    },
    topControl: {
        width: '100%',
        height: '33%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerControl: {
        width: '100%',
        height: '34%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10
    },
    bottomControl: {
        width: '100%',
        height: '33%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    styleViewFlatlist: {
        width: '95%',
        height: '100%',
        // borderRightWidth: 0.5,
        // borderColor: '#DDD',
        justifyContent: 'center',
    },
    styleFlatlist: {
        flex: 1,
        width: '100%',
        height: (Dimensions.get('window').height - 10) / 13,
        // marginTop: 5,
        marginBottom: 5,
        // backgroundColor: '#FFF'
        // width: '90%',
        // height: '100%',
        // borderRightWidth: 0.5,
        // borderColor: '#DDD'
    },
    backButton: {
        margin: 5
    },
    bottomControlViewSmall: {
        margin: (Platform.OS === 'ios' ? 5 : 2),
        width: Dimensions.get('window').height / 9,
        height: Dimensions.get('window').height / 9,
        // backgroundColor: '#FFF'
    },
    NBButton: {
        margin: (Platform.OS === 'ios' ? 5 : 2),
        width: Dimensions.get('window').height / 8,
        height: Dimensions.get('window').height / 10,
        // backgroundColor: '#FFF'
    },
    bottomControlSmall: {
        // margin: (Platform.OS === 'ios' ? 5 : 2),
        width: '100%',
        height: '100%',
    },
    bottomControlBig: {
        margin: 1,
        width: Dimensions.get('window').height / 9,
        height: Dimensions.get('window').height / 9,
    }
})