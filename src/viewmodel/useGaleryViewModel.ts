import { useState } from "react";
import MyPhoto from "../model/entities/myPhoto";

type GaleryState = {
    Photos: MyPhoto[];
    Loading: boolean;
};

function useGaleryViewModel(): GaleryState & { addPhoto: (photo: MyPhoto) => void } {
    const [Photos, setPhotos] = useState<MyPhoto[]>([]);
    const [Loading, setLoading] = useState<boolean>(false);

    // Função para adicionar fotos tiradas
    function addPhoto(photo: MyPhoto) {
        setPhotos((prev) => [...prev, photo]);

    }

    return {
        Photos,
        Loading,
        addPhoto,
    };
}

export default useGaleryViewModel;
