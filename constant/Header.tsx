import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const Header = () => {
    return (
        <View className='flex-row justify-center px-4' style={styles.container}>
            <View className=''>
                <Text style={styles.containerText}>Weather X</Text>
            </View>
            <View className='flex-1 flex-row justify-end' >
                <Image className='w-8 h-8 ' source={require("../assets/images/searchIcon.png")}/>
            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        // backgroundColor:"white/",
        // width:"100%",
        height: 50,
        gap:20,
        paddingLeft:8,
        alignItems:"center",
        justifyContent:"center",

    },
    containerText:{
        fontSize:24,
        fontWeight:"bold",
        // margin:"auto"


    }
})