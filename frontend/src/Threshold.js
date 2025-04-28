import { getThreshold, postThreshold } from "./api";
import { useState, useEffect } from "react";

export const Threshold = () => {
    const [threshold, setThreshold] = useState(0.5);
    const [updatedThreshold, setUpdatedThreshold] = useState();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadThreshold();
    }, []);

    const loadThreshold = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const dataThreshold = await getThreshold();
            if (dataThreshold !== null) {
                setThreshold(dataThreshold);
            }
        } catch (err) {
            setError("Failed to load threshold");
            console.error("Error loading threshold:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const validateThreshold = (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) {
            return "Threshold must be a number";
        }
        if (num < 0 || num > 1) {
            return "Threshold must be between 0 and 1";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateThreshold(updatedThreshold)
        if (validationError) {
            setError(validationError)
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const message = await postThreshold(updatedThreshold);
            console.log(message);
            setThreshold(updatedThreshold);
        } catch (err) {
            setError("Failed to update threshold");
            console.error("Error updating threshold:", err);
        } finally {
            setUpdatedThreshold("");
            setIsLoading(false);
        }
    };

    return (
        <div>
            <p>Current Threshold: {threshold}</p>
            <form onSubmit={handleSubmit}>
                <input
                    value={updatedThreshold}
                    onChange={(e) => setUpdatedThreshold(e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter threshold (0 to 1)"
                />
                <button type="submit" disabled={isLoading}>
                    Change threshold
                </button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </form>
        </div>
    );
};