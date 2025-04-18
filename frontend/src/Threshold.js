import { getThreshold, postThreshold } from "./api";
import { useState, useEffect } from "react"

export const Threshold = () => {
    const [threshold, setThreshold] = useState(0.5)
    const [updatedThreshold, setUpdatedThreshold] = useState(0.5)

    useEffect(() => {
        loadThreshold();
    }, [])

    const updateThreshold = () => {
        if (updatedThreshold !== null && updatedThreshold !== undefined) {
            setThreshold(updatedThreshold)
        }
    }

    const loadThreshold = async () => {
        const dataThreshold = await getThreshold()
        if (dataThreshold !== null && dataThreshold !== undefined) {
            setThreshold(dataThreshold)
            setUpdatedThreshold(dataThreshold)
        }
    }

    const handleOnClickThresholdButton = (e) => {
        postThreshold(updatedThreshold)
        updateThreshold()
    }

    return (
        <>
            <p>
                Threshold: {threshold}
            </p>
            <div>
                <input
                    type="text"
                    onChange={(event) => setUpdatedThreshold(event.target.value)}
                    placeholder='Type to change threshold, threshold from 0 to 1'>
                </input>
                <button onClick={handleOnClickThresholdButton}>Change threshold</button>
            </div>
        </>
    )
}