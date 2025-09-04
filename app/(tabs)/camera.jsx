import PhotoPreviewSection from "@/components/PhotoPreviewSection";
import { saveAndUploadPhoto } from "@/services/photoService";
import { AntDesign } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Camera() {
    const isFocused = useIsFocused();
    const [facing, setFacing] = useState("back");
    const [permission, requestPermission] = useCameraPermissions();
    const [isPreview, setIsPreview] = useState(false);
    const [photo, setPhoto] = useState(null);
    const cameraRef = useRef(null);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    Nous avons besoin de votre permission pour montrer la caméra
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing((current) => (current === "back" ? "front" : "back"));
    }

    const handleTakePhoto = async () => {
        if (cameraRef.current) {
            const takedPhoto = await cameraRef.current.takePictureAsync({
                quality: 1,
                base64: true,
                exif: false,
            });

            setPhoto(takedPhoto);
            setIsPreview(true);
        }
    };

    const handleRetakePhoto = () => {
        setPhoto(null);
        setIsPreview(false);
    };

    const handleSavePhoto = async () => {
        if (photo?.base64) {
            await saveAndUploadPhoto(photo.base64);
            setPhoto(null);
            setIsPreview(false);
        }
    };

    return (
        <View style={styles.container}>
            {photo && isPreview ? (
                <PhotoPreviewSection
                    photo={photo}
                    handleRetakePhoto={handleRetakePhoto}
                    handleSavePhoto={handleSavePhoto}
                />
            ) : isFocused ? (
                <CameraView
                    style={styles.camera}
                    facing={facing}
                    ref={cameraRef}
                >
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={toggleCameraFacing}
                        >
                            <AntDesign name="retweet" size={44} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleTakePhoto}
                        >
                            <AntDesign name="camera" size={44} color="black" />
                        </TouchableOpacity>
                    </View>
                </CameraView>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center",
        marginHorizontal: 10,
        backgroundColor: "gray",
        borderRadius: 10,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
});
