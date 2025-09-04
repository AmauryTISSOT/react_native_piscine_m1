import { StyleSheet, View } from "react-native";
import MapViewLeaflet from "../../components/MapViewLeaflet";

export default function Map() {
    return (
        <View style={styles.container}>
            <MapViewLeaflet />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});
