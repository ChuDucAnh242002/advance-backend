export const getEmotes = async () => {
    try {
        const response = await fetch('/api/settings/allowed-emotes');
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const data = await response.json()
        if (data.emotes !== null || data.emotes !== undefined) {
            return data.emotes;
        } else {
            console.error("Data emotes is null or undefined")
            return null;
        }

    } catch (error) {
        console.error('Error getEmotes:', error);
        return null;
    }
}

export const getInterval = async () => {
    try {
        const response = await fetch('/api/settings/interval');
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const data = await response.json()
        if (data.interval !== null || data.interval !== undefined) {
            return data.interval;
        } else {
            console.error("Data interval is null or undefined")
            return null;
        }
    }
    catch (error) {
        console.error('Error getInterval:', error);
        return null
    }
}

export const getThreshold = async () => {
    try {
        const response = await fetch('/api/settings/threshold');
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const data = await response.json()
        if (data.threshold !== null || data.threshold !== undefined) {
            return data.threshold;
        } else {
            console.error("Data threshold is null or undefined")
            return null;
        }
    }
    catch (error) {
        console.error('Error getThreshold:', error);
        return null
    }
}

export const postEmotes = async (emote) => {
    try {
        const response = await fetch('/api/settings/allowed-emotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                value: emote.value,
                action: emote.active ? "allow" : "disable",
                id: emote.id
            })
        })

        const data = await response.json()
        if (data.message !== null || data.message !== undefined) {
            console.log(data.message)
        } else {
            console.error("Data message is null or undefined")
        }
    }
    catch (error) {
        console.error('Error postEmotes:', error);
        return null
    }
}

export const postInterval = async (updatedInterval) => {
    try {
        const response = await fetch('/api/settings/interval', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                interval: updatedInterval
            })
        });

        const data = await response.json()
        if (data.message !== null || data.message !== undefined) {
            console.log(data.message)
        } else {
            console.error("Data message is null or undefined")
        }

    }
    catch (error) {
        console.error('Error postInterval:', error);
        return null
    }
}

export const postThreshold = async (updatedThreshold) => {
    try {
        const response = await fetch('/api/settings/threshold', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                threshold: updatedThreshold
            })
        });

        const data = await response.json()
        if (data.message !== null || data.message !== undefined) {
            console.log(data.message)
        } else {
            console.error("Data message is null or undefined")
        }
    }
    catch (error) {
        console.error('Error postThreshold:', error);
        return null
    }
}