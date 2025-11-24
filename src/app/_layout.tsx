import { Stack } from "expo-router";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

const Layout = () => {
    return (
        <GluestackUIProvider config={config}>
            <Stack />
        </GluestackUIProvider>
    );
};

export default Layout;
