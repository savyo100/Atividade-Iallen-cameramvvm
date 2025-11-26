import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import MyPhoto from "../model/entities/myPhoto";
import * as Location from "expo-location";
import PhotoRepository from "../model/repositories/photoRepository";

function useIndexViewModel() {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    const [facing, setFacing] = useState<CameraType>("back");
    const [photos, setPhotos] = useState<MyPhoto[]>([]);
    const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Escuta permissão da câmera
    useEffect(() => {
        if (permission) {
            setCameraPermissionGranted(permission.granted);
        }
    }, [permission]);

    // Escuta mudanças no repositório
    useEffect(() => {
        const unsub = PhotoRepository.subscribe(setPhotos);
        return unsub;
    }, []);

    const toggleCameraFacing = () => {
        setFacing(f => (f === "back" ? "front" : "back"));
    };

    const requestCameraPermission = async () => {
        await requestPermission();
    };

    const requestLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermissionGranted(status === "granted");
    };

    const takePhoto = async () => {
        setLoading(true);

        const result = await cameraRef.current?.takePictureAsync({ quality: 1 });
        if (!result?.uri) {
            setLoading(false);
            return;
        }

        let latitude: number | null = null;
        let longitude: number | null = null;

        if (locationPermissionGranted) {
            try {
                const loc = await Location.getCurrentPositionAsync({});
                latitude = loc.coords.latitude;
                longitude = loc.coords.longitude;
            } catch { }
        }

        const novaFoto: MyPhoto = {
            uri: result.uri,
            latitude,
            longitude,
            timestamp: Date.now(),
        };

        await PhotoRepository.addPhoto(novaFoto);

        setLoading(false);
    };

    return {
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
    };
}

export default useIndexViewModel;
