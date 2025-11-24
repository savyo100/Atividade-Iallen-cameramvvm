import MyPhoto from "../entities/myPhoto";
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "MobileFig:photos";

class PhotoRepository {
    private photos: MyPhoto[] = [];
    private listeners: Array<(photos: MyPhoto[]) => void> = [];

    constructor() {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw) as MyPhoto[];
                    this.photos = parsed.map(p => ({
                        uri: p.uri,
                        latitude: p.latitude ?? null,
                        longitude: p.longitude ?? null,
                        timestamp: typeof p.timestamp === 'number' ? p.timestamp : Date.parse(String(p.timestamp)) || Date.now(),
                    }));
                    this.emit();
                }
            } catch (e) {
                console.warn('Falhou ao carregar fotos', e);
            }
        })();
    }

    async addPhoto(photo: MyPhoto) {
        this.photos.push(photo);
        await this.persist();
        this.emit();
    }

    getPhotos(): MyPhoto[] {
        return [...this.photos];
    }

    subscribe(cb: (photos: MyPhoto[]) => void) {
        this.listeners.push(cb);
        cb(this.getPhotos());
        return () => this.unsubscribe(cb);
    }

    unsubscribe(cb: (photos: MyPhoto[]) => void) {
        this.listeners = this.listeners.filter((l) => l !== cb);
    }

    private emit() {
        const snapshot = this.getPhotos();
        this.listeners.forEach((l) => l(snapshot));
    }

    private async persist() {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.photos));
        } catch (e) {
            console.warn('Failed persisting photos', e);
        }
    }
}

const photoRepository = new PhotoRepository();
export default photoRepository;