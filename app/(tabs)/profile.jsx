import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { styles } from "../Profile/styles/profile.styles";
import { backAPI } from "@/services/api";

const initialProfile = {
    nom: "Fouquet",
    prenom: "Adrien",
    email: "adrien.fouquet@example.com",
    tel: "+33 6 12 34 56 78",
    pays: "France",
    bio: "Passionné de voyage et de nouvelles technologies. J’aime explorer le monde et capturer des moments uniques à travers mes photos.",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
};

const Profile = () => {
    const [profile, setProfile] = useState(initialProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [photoCount, setPhotoCount] = useState(0);

    useEffect(() => {
        if (isEditing) {
            loadPhotos();
        }
    }, [isEditing]);

    useEffect(() => {
        loadPhotoCount();
    }, []);


    const loadPhotos = async () => {
        try {
            const data = await backAPI.getAllPhotos();
            setPhotos(data);
        } catch (err) {
            console.log("Erreur chargement photos:", err);
            Alert.alert("Erreur chargement photos", err.message);
        }
    };

    const loadPhotoCount = async () => {
        try {
            const count = await backAPI.getCountPhotos();
            setPhotoCount(count);
        } catch (err) {
            console.log("Erreur chargement nombre de photos:", err);
            Alert.alert("Erreur chargement du nombre de photos", err.message);
        }
    };

    const handleEditPress = () => {
        setIsEditing(true);
    };

    const handleSavePress = () => {
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setProfile({ ...profile, [field]: value });
    };

    const pickImageFromGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfile({ ...profile, avatar: result.assets[0].uri });
        }
    };

    const pickImageFromAppPhotos = (photoUri) => {
        setProfile({ ...profile, avatar: photoUri });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={true}
            >
                <View style={styles.card}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: profile.avatar }} style={styles.avatar} />
                        {isEditing && (
                            <>
                                <TouchableOpacity style={styles.changePhotoButton} onPress={pickImageFromGallery}>
                                    <Text style={styles.buttonText}>Choisir depuis la galerie</Text>
                                </TouchableOpacity>
                                <View style={styles.photoOptionsContainer}>
                                    <ScrollView
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={true}
                                        style={{ marginTop: 10 }}
                                    >
                                        {photos.map((photoUri, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={styles.photoOptionButton}
                                                onPress={() => pickImageFromAppPhotos(photoUri)}
                                            >
                                                <Image source={{ uri: photoUri }} style={{ width: 50, height: 50, borderRadius: 5 }} />
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </>
                        )}
                        {isEditing ? (
                            <>
                                <TextInput
                                    style={styles.input}
                                    value={`${profile.prenom} ${profile.nom}`}
                                    onChangeText={(text) => {
                                        const [prenom, nom] = text.split(" ");
                                        handleChange("prenom", prenom || "");
                                        handleChange("nom", nom || "");
                                    }}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={profile.email}
                                    onChangeText={(text) => handleChange("email", text)}
                                    keyboardType="email-address"
                                />
                            </>
                        ) : (
                            <>
                                <Text style={styles.name}>
                                    {profile.prenom} {profile.nom}
                                </Text>
                                <Text style={styles.email}>{profile.email}</Text>
                            </>
                        )}
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoLabel}>Téléphone</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={profile.tel}
                                onChangeText={(text) => handleChange("tel", text)}
                                keyboardType="phone-pad"
                            />
                        ) : (
                            <Text style={styles.infoValue}>{profile.tel}</Text>
                        )}
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoLabel}>Pays</Text>
                        {isEditing ? (
                            <TextInput
                                style={styles.input}
                                value={profile.pays}
                                onChangeText={(text) => handleChange("pays", text)}
                            />
                        ) : (
                            <Text style={styles.infoValue}>{profile.pays}</Text>
                        )}
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoLabel}>Bio</Text>
                        {isEditing ? (
                            <TextInput
                                style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                                value={profile.bio}
                                onChangeText={(text) => handleChange("bio", text)}
                                multiline
                            />
                        ) : (
                            <Text style={styles.bio}>{profile.bio}</Text>
                        )}
                    </View>

                    <View style={styles.statsBanner}>
                        <Text style={styles.statsText}>
                            Nombre de photos prises sur application : {photoCount}
                        </Text>
                    </View>


                    <View style={styles.buttonContainer}>
                        {!isEditing ? (
                            <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEditPress}>
                                <Text style={styles.buttonText}>Modifier</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={handleSavePress}>
                                <Text style={styles.buttonText}>Enregistrer</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Profile;
