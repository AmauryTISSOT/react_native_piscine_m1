import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";

export default function Photos() {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            const files = await FileSystem.readDirectoryAsync(
                FileSystem.documentDirectory
            );
            const imageFiles = files
                .filter((file) => file.endsWith(".jpg"))
                .map((file) => FileSystem.documentDirectory + file);

            setPhotos(imageFiles);
        } catch (err) {
            console.log("Erreur lecture dossier photos:", err);
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
        width: 200,
        height: 200,
        margin: 5,
        borderRadius: 10,
    },
});
