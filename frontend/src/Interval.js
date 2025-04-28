import { getInterval, postInterval } from "./api";
import { useState, useEffect } from "react";

export const Interval = () => {
    const [interval, setInterval] = useState(1000);
    const [updatedInterval, setUpdatedInterval] = useState();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadInterval();
    }, []);

    const loadInterval = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const dataInterval = await getInterval();
            if (dataInterval !== null) {
                setInterval(dataInterval);
            }
        } catch (err) {
            setError("Failed to load interval");
            console.error("Error loading interval:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const validateInterval = (value) => {
        if (typeof value === 'string' && value.includes('.')) {
            return "Interval must be an integer";
        }

        const num = parseInt(value);
        if (isNaN(num)) {
            return "Interval must be a number";
        }
        if (num < 0) {
            return "Interval must be a positive integer";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateInterval(updatedInterval)
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const message = await postInterval(updatedInterval);
            console.log(message);
            setInterval(updatedInterval);
        } catch (err) {
            setError("Failed to update interval");
            console.error("Error updating interval:", err);
        } finally {
            setUpdatedInterval("");
            setIsLoading(false);
        }
    };

    return (
        <div>
            <p>Current Interval: {interval}</p>
            <form onSubmit={handleSubmit}>
                <input
                    value={updatedInterval}
                    onChange={(e) => setUpdatedInterval(e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter interval (in ms)"
                />
                <button type="submit" disabled={isLoading}>
                    Change interval
                </button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </form>
        </div>
    );
};
