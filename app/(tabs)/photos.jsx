import { backAPI } from "@/services/api";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, View } from "react-native";

export default function Photos() {
    const [photos, setPhotos] = useState([]);

    useFocusEffect(
        useCallback(() => {
            loadPhotos();
        }, [])
    );

    const loadPhotos = async () => {
        try {
            const data = await backAPI.getAllPhotos();
            setPhotos(data);
        } catch (err) {
            console.log("Erreur chargement photos:", err);
            Alert.alert("Erreur chargement photos", err.message);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={photos}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
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
        padding: 5,
    },
    photo: {
        width: 160,
        height: 160,
        margin: 5,
        borderRadius: 10,
    },
});
