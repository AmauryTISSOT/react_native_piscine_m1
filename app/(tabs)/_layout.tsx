import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    const ICONSIZE = 28;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        position: "absolute",
                    },
                    default: {},
                }),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={ICONSIZE}
                            name="house.fill"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: "Calendar",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={ICONSIZE}
                            name="calendar"
                            color={color}
                        />
                    ),
                }}
            />{" "}
            <Tabs.Screen
                name="camera"
                options={{
                    title: "Camera",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={ICONSIZE}
                            name="camera.fill"
                            color={color}
                        />
                    ),
                }}
            />{" "}
            <Tabs.Screen
                name="map"
                options={{
                    title: "Map",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={ICONSIZE}
                            name="map.fill"
                            color={color}
                        />
                    ),
                }}
            />{" "}
            <Tabs.Screen
                name="photos"
                options={{
                    title: "Photos",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={ICONSIZE}
                            name="photo.fill"
                            color={color}
                        />
                    ),
                }}
            />{" "}
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profil",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={ICONSIZE}
                            name="person.fill"
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
