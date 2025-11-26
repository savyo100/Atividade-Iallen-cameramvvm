import { CameraView } from 'expo-camera';
import useIndexViewModel from '../viewmodel/useIndexViewModel';
import { router } from 'expo-router';

import {
    Box,
    Text,
    Button,
    ButtonText,
    Pressable,
    HStack,
    VStack,
} from "@gluestack-ui/themed";
import React from 'react';

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
            <Box flex={1} justifyContent="center" alignItems="center" px={20} bgColor="#0f0f0f">
                <VStack space="md" alignItems="center">
                    <Text color="white" textAlign="center" fontSize={18} opacity={0.9}>
                        Nós precisamos de permissão para usar sua câmera
                    </Text>

                    <Button
                        size="lg"
                        bgColor="#6C63FF"
                        borderRadius={10}
                        onPress={requestCameraPermission}
                    >
                        <ButtonText color="white">Conceder permissão</ButtonText>
                    </Button>
                </VStack>
            </Box>
        );
    }

    // ---- Tela pedindo permissão da localização ----
    if (!locationPermissionGranted) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center" px={20} bgColor="#0f0f0f">
                <VStack space="md" alignItems="center">
                    <Text color="white" textAlign="center" fontSize={18} opacity={0.9}>
                        Nós precisamos de permissão para obter sua localização
                    </Text>

                    <Button
                        size="lg"
                        bgColor="#6C63FF"
                        borderRadius={10}
                        onPress={requestLocationPermission}
                    >
                        <ButtonText color="white">Conceder permissão</ButtonText>
                    </Button>
                </VStack>
            </Box>
        );
    }

    return (
        <Box flex={1} bgColor="black">

            <Box flex={1}>
                <CameraView
                    ref={cameraRef}
                    style={{ flex: 1 }}
                    facing={facing}
                />

                {/* CONTROLES */}
                <HStack
                    position="absolute"
                    bottom={32}
                    left={0}
                    right={0}
                    justifyContent="space-evenly"
                    px={24}
                >
                    {/* Botão Flip */}
                    <Pressable
                        onPress={toggleCameraFacing}
                        bgColor="rgba(0,0,0,0.5)"
                        px={16}
                        py={10}
                        borderRadius={12}
                        minWidth={90}
                        alignItems="center"
                    >
                        <Text color="white" fontWeight="$bold" fontSize={14}>
                            Flip
                        </Text>
                    </Pressable>

                    {/* Capturar */}
                    <Pressable
                        onPress={takePhoto}
                        disabled={loading}
                        bgColor="rgba(255,255,255,0.15)"
                        px={20}
                        py={12}
                        borderRadius={50}
                        style={{ borderWidth: 2, borderColor: "white" }}
                        alignItems="center"
                    >
                        <Text color="white" fontWeight="$bold" fontSize={15}>
                            {loading ? "..." : "●"}
                        </Text>
                    </Pressable>

                    {/* Galeria */}
                    <Pressable
                        onPress={() => router.push('/galery')}
                        bgColor="rgba(0,0,0,0.5)"
                        px={16}
                        py={10}
                        borderRadius={12}
                        minWidth={110}
                        alignItems="center"
                    >
                        <Text color="white" fontWeight="$bold" fontSize={14}>
                            Galeria ({photos.length})
                        </Text>
                    </Pressable>
                </HStack>
            </Box>

        </Box>
    );
}
