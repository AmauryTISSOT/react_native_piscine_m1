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
                <Text style={styles.title}> Piscine 01 </Text>
            </ImageBackground>
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: "column" },
    title: {
        color: "white",
        fontSize: 42,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        marginBottom: 20,
    },
    image: {
        width: "100%",
        height: "100%",
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    link: {
        color: "white",
        fontSize: 42,
        fontWeight: "bold",
        textAlign: "center",
        textDecorationLine: "underline",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 4,
    },
    button: {
        height: 60,
        borderRadius: 20,
        backgroundColor: "rgba(0,0,0,0.75)",
        padding: 6,
        justifyContent: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        padding: 4,
    },
});
