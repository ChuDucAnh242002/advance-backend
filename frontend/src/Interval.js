import { getInterval, postInterval } from "./api"
import { useState, useEffect } from "react"

export const Interval = () => {
    const [interval, setInterval] = useState(1000)
    const [updatedInterval, setUpdatedInterval] = useState(1000)

    useEffect(() => {
        loadInterval()
    }, [])

    const loadInterval = async () => {
        const dataInterval = await getInterval()
        console.log(dataInterval)
        if (dataInterval !== null && dataInterval !== undefined) {
            setInterval(dataInterval)
            setUpdatedInterval(dataInterval)
        }
    }

    const updateInterval = () => {
        if (updatedInterval !== null && updatedInterval !== undefined) {
            setInterval(updatedInterval)
        }
    }

    const handleOnClickIntervalButton = (e) => {
        postInterval(updatedInterval)
        updateInterval()
    }
    return (
        <>
            <p>
                Interval: {interval}
            </p>
            <div>
                <input
                    type="text"
                    onChange={(event) => setUpdatedInterval(event.target.value)}
                    placeholder='Type to change interval, interval is in second'>
                </input>
                <button onClick={handleOnClickIntervalButton}>Change Interval</button>
            </div>
        </>
    )
}
