import React from "react";
import { Stack } from "expo-router";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

const Layout = () => {
    return (
        <GluestackUIProvider config={config}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="galery" options={{ title: "Galeria" }} />
            </Stack>
        </GluestackUIProvider>
    );
};

export default Layout;