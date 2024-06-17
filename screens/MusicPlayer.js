import { View, Text ,Dimensions,StyleSheet,SafeAreaView,TouchableOpacity} from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Image } from 'react-native';
const { width, height} = Dimensions.get('window');

const MusicPlayer = () => {
  return (
    <SafeAreaView style= {style.container}>
    <View style= {style.maincontainer}>
        <View style={[style.imageWrapper, style.elevation]}>
            <Image source={require('../assets/img/img1.jpg')} 
                style = {style.musicImage}
            />
        </View>
      
    </View>

 <View style={style.bottomContainer}>
    <View style={style.bottomIconWrapper}>

        <TouchableOpacity onPress={()=>{}}>
        <Ionicons name='heart-outline' size={30} color="#888888" />
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{}}>
        <Ionicons name='repeat' size={30} color="#888888" />
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{}}>
        <Ionicons name='share-outline' size={30} color="#888888" />
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{}}>
        <Ionicons name='ellipsis-horizontal' size={30} color="#888888" />
        </TouchableOpacity>
    </View>
    
 
 </View>
 
    </SafeAreaView>
  )
}

export default MusicPlayer

const style = StyleSheet.create({
    container: { 
        flex:1,
        backgroundColor: '#222831',
        
    },

    maincontainer: {
        flex:1,
        alignContent: 'center',
        justifyContent: 'center',
    },

    bottomContainer: {
        width: width,
        alignItems: 'center',
        paddingVertical:15,
        borderTopColor: '#393E46',
        borderWidth:1,

    },

    bottomIconWrapper:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '88%',
    },

    imageWrapper:{
        width: 300,
        height: 340,
        marginBottom: 25,

    },
    musicImage:{
        width: '100%',
        height:'100%',
        borderRadius:15,
    }
    ,
    elevation:{
        elevation:5,
        shadowColor:'#ccc',
        shadowOffset:{
            width:5,
            height:5,
            
        },
        shadowOpacity:0.5,
        shadowRadius:3.86,
    }
  })