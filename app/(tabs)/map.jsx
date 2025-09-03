// app/(tabs)/map.jsx
import { StyleSheet, View } from "react-native";
import MapPreview from "../../components/MapPreview";
import { usePhotoLocation } from "../../constants/PhotoLocationContext";

export default function MapTab() {
  const { coords } = usePhotoLocation();

  return (
    <View style={styles.container}>
      <MapPreview coords={coords} /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
