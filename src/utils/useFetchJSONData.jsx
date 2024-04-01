import { useState, useEffect } from "react";
import NProgress from "nprogress";

function useFetchJSONData(folder, file, navigate) {
    const [data, setData] = useState(null);

    useEffect(() => {
        NProgress.start();
        const filePath = `/json/${folder}/${file}.json`;
        fetch(filePath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
                NProgress.done();
            })
            .catch((error) => {
                console.error("Fetch error: ", error.message);
                NProgress.done();
                navigate("/"); // Redirect to homepage on error
            });
    }, [folder, file, navigate]);

    return data;
}

export default useFetchJSONData;
