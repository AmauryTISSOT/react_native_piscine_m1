import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, View } from "react-native";

export default function Photos() {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        try {
            const response = await fetch("http://192.168.1.199:8080/list");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
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
