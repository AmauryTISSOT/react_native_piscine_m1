// services/photoService.ts
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { backAPI, photoUtils } from "./api";

export async function saveAndUploadPhoto(photoBase64: string) {
    try {
        // Sauvegarde locale
        const newPath =
            FileSystem.documentDirectory + `photo_${Date.now()}.jpg`;
        await FileSystem.writeAsStringAsync(newPath, photoBase64, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Récupération localisation
        const { status } = await Location.requestForegroundPermissionsAsync();
        let latitude: number | null = null;
        let longitude: number | null = null;

        if (status === "granted") {
            const location = await Location.getCurrentPositionAsync({});
            latitude = location.coords.latitude;
            longitude = location.coords.longitude;
        } else {
            Alert.alert(
                "Permission localisation refusée",
                "Les coordonnées GPS ne seront pas ajoutées."
            );
        }

        // Upload API
        const currentDate = photoUtils.formatDateForAPI(new Date());
        const photoFile = {
            uri: newPath,
            type: "image/jpeg",
            name: `photo_${Date.now()}.jpg`,
        };

        const result = await backAPI.uploadPhotos(
            photoFile,
            currentDate,
            latitude,
            longitude
        );

        Alert.alert("Succès", `Photo envoyée avec succès !\nID: ${result.id}`, [
            { text: "OK" },
        ]);

        return result;
    } catch (err: any) {
        console.error("Erreur upload complète:", err);

        let errorMessage = "Erreur lors de l'upload";
        if (err.code === "NETWORK_ERROR" || err.message === "Network Error") {
            errorMessage =
                "Impossible de se connecter au serveur. Vérifiez votre connexion.";
        } else if (err.response?.status === 400) {
            errorMessage = "Données invalides envoyées au serveur.";
        } else if (err.response?.status === 500) {
            errorMessage = "Erreur serveur. Réessayez plus tard.";
        }

        Alert.alert("Erreur", errorMessage);
    }
}
