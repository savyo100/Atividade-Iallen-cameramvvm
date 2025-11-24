import { StyleSheet, FlatList, View, Image, Text } from "react-native";
import { useEffect, useState } from "react";
import PhotoRepository from "../model/repositories/photoRepository";
import MyPhoto from "../model/entities/myPhoto";

export default function Galery() {
    const [photos, setPhotos] = useState<MyPhoto[]>([]);

    useEffect(() => {
        const unsub = PhotoRepository.subscribe((list) => setPhotos(list));
        return unsub;
    }, []);

    return (
        <View style={styles.listSection}>
            <FlatList
                contentContainerStyle={styles.listContent}
                data={photos}
                keyExtractor={(item) => `${item.timestamp}-${item.uri}`}
                renderItem={({ item }) => (
                    <View style={styles.itemRow}>

                        <Image source={{ uri: item.uri }} style={styles.thumb} />

                        <View style={styles.itemTextBlock}>
                            <Text style={styles.itemTitle}>Foto</Text>

                            <Text style={styles.itemCoords}>
                                {item.latitude != null
                                    ? `Lat: ${item.latitude.toFixed(6)}  Lon: ${item.longitude?.toFixed(6)}`
                                    : "Sem localização"}
                            </Text>
                        </View>

                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    listSection: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        padding: 12,
        gap: 12,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    thumb: {
        width: 64,
        height: 64,
        borderRadius: 6,
        backgroundColor: '#ddd',
        marginRight: 12,
    },
    itemTextBlock: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemCoords: {
        fontSize: 12,
        color: '#333',
    }
});
