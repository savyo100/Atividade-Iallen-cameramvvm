import { useEffect, useState } from "react";
import MyPhoto from "../model/entities/myPhoto";
import PhotoRepository from "../model/repositories/photoRepository";

type GaleryState = {
    Photos: MyPhoto[];
    Loading: boolean;
};

function useGaleryViewModel(): GaleryState {
    const [Photos, setPhotos] = useState<MyPhoto[]>([]);
    const [Loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsub = PhotoRepository.subscribe((list) => {
            setPhotos(list);
            setLoading(false);
        });

        return unsub;
    }, []);

    return {
        Photos,
        Loading,
    };
}

export default useGaleryViewModel;
