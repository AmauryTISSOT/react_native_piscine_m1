import { backAPI } from "@/services/api";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
    const webViewRef = useRef(null);
    const [mapReady, setMapReady] = useState(false);

    const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Carte Leaflet</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            body, html { margin: 0; padding: 0; height: 100%; font-family: Arial, sans-serif; }
            #map { height: 100vh; width: 100vw; }
            .custom-control {
                position: absolute; top: 10px; right: 10px; z-index: 1000;
                background: white; padding: 5px 10px; border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2); font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            var map = L.map('map').setView([48.8566, 2.3522], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map);

            map.on('click', function(e) {
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                    type: 'mapClick',
                    lat: e.latlng.lat,
                    lng: e.latlng.lng
                }));
            });

            map.whenReady(function() {
                window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'mapReady' }));
            });

            window.moveToLocation = function(lat, lng, zoom = 13) {
                map.setView([lat, lng], zoom);
            };

            window.addMarker = function(lat, lng, popup) {
                L.marker([lat, lng]).addTo(map).bindPopup(popup);
            };
        </script>
    </body>
    </html>
  `;

    const handleWebViewMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            switch (data.type) {
                case "mapReady":
                    setMapReady(true);
                    break;
                case "mapClick":
                    console.log(
                        `📍 Clic sur la carte: ${data.lat.toFixed(
                            4
                        )}, ${data.lng.toFixed(4)}`
                    );
                    break;
            }
        } catch (error) {
            console.log("Erreur parsing message:", error);
        }
    };

    const addMarkerOnMap = (lat, lng, popupText, imageUrl) => {
        let content = popupText;
        if (imageUrl) {
            content += `<br><img src="${imageUrl}" style="width:150px;height:auto;" />`;
        }
        const safeContent = JSON.stringify(content);
        const script = `window.addMarker(${lat}, ${lng}, ${safeContent});`;
        webViewRef.current?.injectJavaScript(script);
    };

    const fetchGpsData = async () => {
        try {
            const dataList = await backAPI.getGpsData();
            console.log("GPD coord: ", dataList);

            if (Array.isArray(dataList)) {
                for (const d of dataList) {
                    if (d.latitude && d.longitude) {
                        // Récupérer la photo via l'ID
                        const imageResponse = await backAPI.getPhotosById(d.id);
                        console.log("image_url: ", imageResponse);
                        const imageUrl = imageResponse?.url || null;

                        const popupText = `📍 ID: ${d.id}\n🕒 ${new Date(
                            d.date
                        ).toLocaleString()}`;
                        addMarkerOnMap(
                            d.latitude,
                            d.longitude,
                            popupText,
                            imageUrl
                        );
                    }
                }

                if (dataList.length > 0) {
                    const first = dataList[0];
                    const script = `window.moveToLocation(${first.latitude}, ${first.longitude}, 13);`;
                    webViewRef.current?.injectJavaScript(script);
                }
            }
        } catch (error) {
            console.log("Erreur API GPS:", error);
        }
    };

    useEffect(() => {
        if (mapReady) fetchGpsData();
    }, [mapReady]);

    return (
        <View style={styles.container}>
            <View style={styles.controlBar}>
                <Text style={styles.status}>
                    {mapReady ? "" : "⏳ Chargement..."}
                </Text>
            </View>

            <WebView
                ref={webViewRef}
                source={{ html: leafletHTML }}
                style={styles.webview}
                onMessage={handleWebViewMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    controlBar: {
        height: 50,
        backgroundColor: "#f8f8f8",
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    status: { fontSize: 14, fontWeight: "bold" },
    webview: { flex: 1 },
    bottomControls: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
        backgroundColor: "#f8f8f8",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
});
