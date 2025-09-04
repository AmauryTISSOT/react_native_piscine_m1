import waterBackground from "@/assets/images/water_background.jpg";
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const App = () => {
    const navigation = useNavigation();

    const navigateTo = (screen) => {
        navigation.navigate(screen);
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={waterBackground}
                resizeMode="cover"
                style={styles.image}
            >
                <View style={styles.overlay}>
                    <Text style={styles.title}>Bienvenue sur l'application Piscine !</Text>

                    <View style={styles.buttonContainer}>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigateTo("calendar")}
                        >
                            <View style={styles.buttonContent}>
                                <Ionicons name="calendar" size={20} style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>Calendrier</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigateTo("camera")}
                        >
                            <View style={styles.buttonContent}>
                                <Ionicons name="camera" size={20} style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>Caméra</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigateTo("map")}
                        >
                            <View style={styles.buttonContent}>
                                <Ionicons name="map" size={20} style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>Carte</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigateTo("photos")}
                        >
                            <View style={styles.buttonContent}>
                                <Ionicons name="images" size={20} style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>Mes photos</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigateTo("profile")}
                        >
                            <View style={styles.buttonContent}>
                                <Ionicons name="person" size={20} style={styles.buttonIcon} />
                                <Text style={styles.buttonText}>Profil</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: "flex-start",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        marginTop: 100,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        paddingTop: 30,
    },
    title: {
        color: "#2c3e50",
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
        paddingTop: 10,
    },
    buttonContainer: {
        flex: 1,
    },
    button: {
        backgroundColor: "#fff",
        borderRadius: 15,
        marginBottom: 15,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonIcon: {
        color: "#3498db",
        marginRight: 15,
    },
    buttonText: {
        color: "#2c3e50",
        fontWeight: "500",
        fontSize: 18,
    },
});
