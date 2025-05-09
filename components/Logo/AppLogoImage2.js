import { View,StyleSheet, Image } from "react-native"
import { useState } from "react";


const AppLogoImage2 = () =>{
    return(
        <Image source={require("../../assets/logonobg.png")}
        style={styles.image}
        />
    );
    
};

export default AppLogoImage2;

const styles = StyleSheet.create({
    image: {
        marginbottom:10,
        height:20,
        width:20,
    },

})
