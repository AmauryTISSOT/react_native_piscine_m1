import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, View } from "react-native";

export default function TakePhoto() {
    const [photos, setPhotos] = useState([]);

    const backendUrl = "http://192.168.1.199:8080/upload";

    useEffect(() => {
        openCamera();
    }, []);

    const uploadPhoto = async (uri) => {
        try {
            // Crée un FormData pour le multipart upload
            const formData = new FormData();
            formData.append("photo", {
                uri,
                name: `photo_${Date.now()}.jpg`,
                type: "image/jpeg",
            });

            formData.append("date", new Date().toISOString());
            formData.append("latitude", "48.8566"); //TODO: récupérer la latitude du gps
            formData.append("longitude", "2.3522"); //TODO: récupérer la longitude du gps

            const response = await fetch(backendUrl, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = await response.json();
            console.log("Upload réussi:", data);
            Alert.alert("Photo envoyée avec succès !");
        } catch (err) {
            console.log("Erreur upload:", err);
            Alert.alert("Erreur lors de l’upload");
        }
    };

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

                // Upload vers le backend
                await uploadPhoto(sourceUri);
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
