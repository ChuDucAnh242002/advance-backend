const handleResponse = async (response) => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
};

const fetchData = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        const data = await handleResponse(response);
        return data;
    } catch (error) {
        console.error(`Error in fetchData (${url}):`, error);
        throw error;
    }
};

export const getEmotes = async () => {
    const data = await fetchData('/api/settings/allowed-emotes');
    if (data.emotes == null) {
        console.error("Data emotes is null or undefined");
        return null;
    }
    return data.emotes;
};

export const getInterval = async () => {
    const data = await fetchData('/api/settings/interval');
    if (data.interval == null) {
        console.error("Data interval is null or undefined");
        return null;
    }
    return data.interval;
};

export const getThreshold = async () => {
    const data = await fetchData('/api/settings/threshold');
    if (data.threshold == null) {
        console.error("Data threshold is null or undefined")
        return null;
    }
    return data.threshold;
};

export const postEmotes = async (emote) => {
    const data = await fetchData('/api/settings/allowed-emotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            value: emote.value,
            action: emote.active ? "allow" : "disable",
            id: emote.id
        }),
    });
    if (data.message == null) {
        console.error("Data message is null or undefined");
    }
    return data.message;
};

export const postInterval = async (updatedInterval) => {
    const data = await fetchData('/api/settings/interval', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            interval: updatedInterval
        }),
    });
    if (data.message == null) {
        console.error("Data message is null or undefined");
    }
    return data.message;
};

export const postThreshold = async (updatedThreshold) => {
    const data = await fetchData('/api/settings/threshold', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            threshold: updatedThreshold
        }),
    });
    if (data.message == null) {
        console.error("Data message is null or undefined");
    }
    return data.message;
};