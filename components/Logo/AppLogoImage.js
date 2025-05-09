import { View,StyleSheet, Image } from "react-native"
import { useState } from "react";


const AppLogoImage = () =>{
    return(
        <Image source={require("../../assets/logonobg.png")}
        style={styles.image}
        />
    );
    
};

export default AppLogoImage;

const styles = StyleSheet.create({
    image: {
        height:140,
        width:140,
    },

})
