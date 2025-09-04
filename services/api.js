import axios from "axios";
import Constants from "expo-constants";

const host = Constants.expoConfig?.hostUri?.split(":")[0] || "localhost";
export const API_BACKEND_URL = `http://${host}:8080`;

console.log("API URL:", API_BACKEND_URL);

const API = axios.create({
    baseURL: API_BACKEND_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Erreur API:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const backAPI = {
    uploadPhotos: async (photoFile, date, latitude, longitude) => {
        const formData = new FormData();

        formData.append("photo", {
            uri: photoFile.uri,
            type: photoFile.type || "image/jpeg",
            name: photoFile.name || "photo.jpg",
        });

        formData.append("date", date);
        formData.append("latitude", latitude.toString());
        formData.append("longitude", longitude.toString());

        const response = await API.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            timeout: 30000,
        });

        return response.data;
    },

    getPhotosById: async (photoId) => {
        const response = await API.get(`/photos?id=${photoId}`);
        return response.data;
    },

    getAllPhotos: async () => {
        const response = await API.get("/list");
        return response.data;
    },

    getAllGpsCoordinates: async () => {
        const response = await API.get("/photos/by-date");
        return response.data.map((photo) => ({
            id: photo.id,
            latitude: photo.latitude,
            longitude: photo.longitude,
            date: photo.date,
        }));
    },

    getAllPhotosByDate: async () => {
        const response = await API.get("/photos/by-date");
        return response.data;
    },

    getCountPhotos: async () => {
        const response = await API.get("/photos/count");
        return response.data["count"];
    },

    getGpsData: async () => {
        const response = await API.get("/gps");
        return response.data;
    },

    createUser: async (email, password) => {
        const response = await API.post("/createUser", { email, password });
        return response.data; // { id: string }
    },

    updateUser: async (email, updates) => {
        const response = await API.patch(
            `/updateUser?email=${encodeURIComponent(email)}`,
            updates
        );
        return response.data; // { message: "User updated successfully" }
    },

    getUser: async (email) => {
        const response = await API.get(
            `/getUser?email=${encodeURIComponent(email)}`
        );
        return response.data; // User object
    },

    getUserProfileImage: async (email) => {
        const response = await API.get(
            `/user/profilepicture?email=${encodeURIComponent(email)}`
        );
        return response;
    },

    updateUserProfileImage: async (email, photoFile) => {
        const formData = new FormData();
        formData.append("photo", {
            uri: photoFile.uri,
            type: photoFile.type || "image/jpeg",
            name: photoFile.name || "profile.jpg",
        });

        const response = await API.post(
            `/user/updateprofilepicture?email=${encodeURIComponent(email)}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 30000,
            }
        );

        return response.data;
    },
};

export const photoUtils = {
    formatDateForAPI: (date) => {
        return new Date(date).toISOString();
    },

    getPhotoUrl: (photoId, extension = ".jpg") => {
        return `${API_BACKEND_URL}/photos/${photoId}${extension}`;
    },

    validateCoordinates: (latitude, longitude) => {
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        return {
            isValid:
                !isNaN(lat) &&
                !isNaN(lon) &&
                lat >= -90 &&
                lat <= 90 &&
                lon >= -180 &&
                lon <= 180,
            latitude: lat,
            longitude: lon,
        };
    },
};

export { API };
