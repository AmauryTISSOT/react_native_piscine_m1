import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, View } from "react-native";
import { backAPI, photoUtils } from "../services/api";

export default function TakePhoto() {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        openCamera();
    }, []);

    const uploadPhoto = async (photoAsset) => {
        try {
            const currentDate = photoUtils.formatDateForAPI(new Date());
            const fakeLatitude = 48.8566; // Utiliser des nombres, pas des strings
            const fakeLongitude = 2.3522;

            // Créer l'objet photoFile correctement
            const photoFile = {
                uri: photoAsset.uri,
                type: "image/jpeg",
                name: `photo_${Date.now()}.jpg`,
            };

            console.log("Tentative d'upload:", {
                photoFile,
                date: currentDate,
                latitude: fakeLatitude,
                longitude: fakeLongitude,
            });

            const result = await backAPI.uploadPhotos(
                photoFile, // Passer l'objet photoFile, pas le tableau photos
                currentDate,
                fakeLatitude,
                fakeLongitude
            );

            console.log("Upload réussi:", result);
            Alert.alert(
                "Succès",
                `Photo envoyée avec succès !\nID: ${result.id}`,
                [{ text: "OK" }]
            );

            return result;
        } catch (err) {
            console.error("Erreur upload complète:", err);

            let errorMessage = "Erreur lors de l'upload";

            if (
                err.code === "NETWORK_ERROR" ||
                err.message === "Network Error"
            ) {
                errorMessage =
                    "Impossible de se connecter au serveur. Vérifiez votre connexion.";
            } else if (err.response?.status === 400) {
                errorMessage = "Données invalides envoyées au serveur.";
            } else if (err.response?.status === 500) {
                errorMessage = "Erreur serveur. Réessayez plus tard.";
            }

            Alert.alert("Erreur", errorMessage, [
                {
                    text: "Réessayer",
                    onPress: () => uploadPhoto(photoAsset),
                },
                {
                    text: "Annuler",
                    style: "cancel",
                },
            ]);
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

                await uploadPhoto({ uri: newPath });
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
