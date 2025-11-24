import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import MyPhoto from "../model/entities/myPhoto";
import * as Location from "expo-location";
import PhotoRepository from "../model/repositories/photoRepository";

type IndexState = {
    facing: CameraType;
    photos: MyPhoto[];
    cameraPermissionGranted: boolean;
    locationPermissionGranted: boolean;
    loading: boolean;
};

type IndexActions = {
    toggleCameraFacing: () => void;
    requestCameraPermission: () => Promise<void>;
    requestLocationPermission: () => Promise<void>;
    takePhoto: () => Promise<void>;
};

function useIndexViewModel(): IndexState & IndexActions & { cameraRef: any } {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>("back");
    const [photos, setPhotos] = useState<MyPhoto[]>(() => PhotoRepository.getPhotos());
    const cameraRef = useRef<CameraView>(null);
    const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Atualiza permissão da câmera
    useEffect(() => {
        if (permission) {
            setCameraPermissionGranted(permission.granted);
        }
    }, [permission]);

    useEffect(() => {
        const unsub = PhotoRepository.subscribe((list) => setPhotos(list));
        return unsub;
    }, []);

    const toggleCameraFacing = () => {
        setFacing((current) => (current === "back" ? "front" : "back"));
    };

    const requestCameraPermission = async () => {
        await requestPermission();
    };

    const requestLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        const granted = status === "granted";
        setLocationPermissionGranted(granted);
    };

    async function takePhoto() {
        setLoading(true);

        const result = await cameraRef.current?.takePictureAsync({ quality: 1 });
        if (!result?.uri) {
            setLoading(false);
            return;
        }

        let latitude: number | null = null;
        let longitude: number | null = null;

        try {
            if (locationPermissionGranted) {
                const loc = await Location.getCurrentPositionAsync({});
                latitude = loc.coords.latitude;
                longitude = loc.coords.longitude;
            }
        } catch { }

        let novaFoto = { uri: result.uri, latitude: latitude, longitude: longitude, timestamp: Date.now() };

        PhotoRepository.addPhoto(novaFoto);
        setPhotos(PhotoRepository.getPhotos());
        setLoading(false);
    }

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

