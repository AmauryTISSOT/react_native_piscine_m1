import waterBackground from "@/assets/images/water_background.jpg";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

const App = () => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={waterBackground}
                resizeMode="cover"
                style={styles.image}
            >
                <Text style={styles.text}> Piscine 01 </Text>
            </ImageBackground>
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: "column" },
    text: {
        color: "white",
        fontSize: 42,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    image: {
        width: "100%",
        height: "100%",
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
});
