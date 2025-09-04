import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    scrollContainer: {
        padding: 20,
        paddingTop: 70,
        flexGrow: 1,
        paddingBottom: 100
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 20,
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: "#666",
        marginBottom: 10,
    },
    infoContainer: {
        marginBottom: 15,
    },
    infoLabel: {
        fontSize: 14,
        color: "#888",
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 16,
        color: "#333",
    },
    bio: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: "center",
        marginTop: 20,
        color: "#555",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#007bff",
        minWidth: 120,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    editButton: {
        backgroundColor: "#6c757d",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    changePhotoButton: {
        marginTop: 10,
        backgroundColor: "#28a745",
        padding: 8,
        borderRadius: 5,
    },
    photoOptionsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    photoOptionButton: {
        backgroundColor: "#17a2b8",
        padding: 8,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    statsBanner: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: "#eaf4ff",
        alignItems: "center",
        justifyContent: "center",
    },
    statsText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#007bff",
    },
});
