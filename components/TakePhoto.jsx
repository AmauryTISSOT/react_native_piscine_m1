import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, View } from "react-native";

export default function TakePhoto() {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        openCamera();
    }, []);

    const openCamera = async () => {
        // Demander la permission
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission caméra refusée !");
            return;
        }

        // Lancer la caméra
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const sourceUri = result.assets[0].uri;
            const newPath =
                FileSystem.documentDirectory + `photo_${Date.now()}.jpg`;

            try {
                await FileSystem.copyAsync({ from: sourceUri, to: newPath });

                setPhotos([newPath]);
            } catch (err) {
                console.log("Erreur sauvegarde:", err);
            }
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={photos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.photo} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    photo: {
        width: "100%",
        height: "100%",
    },
});
