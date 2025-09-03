import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../Profile/styles/profile.styles";

const initialProfile = {
    nom: "Fouquet",
    prenom: "Adrien",
    email: "adrien.fouquet@example.com",
    tel: "+33 6 12 34 56 78",
    pays: "France",
    bio: "Passionné de voyage et de nouvelles technologies. J’aime explorer le monde et capturer des moments uniques à travers mes photos.",
};

const Profile = () => {
    const [profile, setProfile] = useState(initialProfile);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditPress = () => {
        setIsEditing(true);
    };

    const handleSavePress = () => {
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setProfile({ ...profile, [field]: value });
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{
                            uri: "https://randomuser.me/api/portraits/men/1.jpg",
                        }}
                        style={styles.avatar}
                    />
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
                                onChangeText={(text) =>
                                    handleChange("email", text)
                                }
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
                            style={[
                                styles.input,
                                { height: 100, textAlignVertical: "top" },
                            ]}
                            value={profile.bio}
                            onChangeText={(text) => handleChange("bio", text)}
                            multiline
                        />
                    ) : (
                        <Text style={styles.bio}>{profile.bio}</Text>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    {!isEditing ? (
                        <TouchableOpacity
                            style={[styles.button, styles.editButton]}
                            onPress={handleEditPress}
                        >
                            <Text style={styles.buttonText}>Modifier</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSavePress}
                        >
                            <Text style={styles.buttonText}>Enregistrer</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

export default Profile;
