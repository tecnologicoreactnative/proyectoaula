import { View,StyleSheet, Image } from "react-native"
import { useState } from "react";


const Brand = () =>{
    return(
        <Image source={require("../../assets/logotitlenobg.png")}
        style={styles.image}
        />
    );
    
};

export default Brand;

const styles = StyleSheet.create({
    image: {
        height:70,
        width:240,
    },

})