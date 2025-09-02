import TakePhoto from "@/components/TakePhoto";
import React from "react";
import { StyleSheet, View } from "react-native";

const Camera = () => {
    return (
        <View style={styles.container}>
            <TakePhoto />
        </View>
    );
};

export default Camera;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
