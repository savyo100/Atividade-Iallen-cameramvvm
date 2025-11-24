import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import useIndexViewModel from '../viewmodel/useIndexViewModel';
import { router } from 'expo-router';

export default function App() {

    const {
        facing,
        photos,
        cameraPermissionGranted,
        locationPermissionGranted,
        loading,
        toggleCameraFacing,
        requestCameraPermission,
        requestLocationPermission,
        takePhoto,
        cameraRef,
    } = useIndexViewModel();

    // ---- Tela pedindo permissão da câmera ----
    if (!cameraPermissionGranted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Nós precisamos de permissão para usar sua câmera</Text>
                <Button onPress={requestCameraPermission} title="Conceder permissão" />
            </View>
        );
    }

    // ---- Tela pedindo permissão da localização ----
    if (!locationPermissionGranted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Nós precisamos de permissão para obter sua localização</Text>
                <Button onPress={requestLocationPermission} title="Conceder permissão" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.cameraSection}>

                <CameraView
                    ref={cameraRef}
                    style={styles.camera}
                    facing={facing}
                />

                <View style={styles.controls}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={takePhoto}
                        disabled={loading}
                    >
                        <Text style={styles.text}>{loading ? "Fotografando..." : "Capturar"}</Text>
                    </TouchableOpacity>

                    <View style={styles.button}>
                        <TouchableOpacity style={styles.button} onPress={() => router.push('/galery')}>
                            <Text style={styles.text}>Ir para Galeria ({photos.length})</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

        </View>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    cameraSection: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    controls: {
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: 24,
    },
    button: {
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
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
    },
});
