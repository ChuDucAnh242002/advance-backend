import { getEmotes, postEmotes } from "./api";
import { useState, useEffect } from "react";
import { socket } from "./socket";
import Emoji from "./Emoji";

export const Emote = () => {

    const [emotes, setEmotes] = useState([]);
    const [aggregatedEmotes, setAggregatedEmotes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleSocketMessage = (message) => {
            // This function get the message as json from socket. Decode the message and get the aggregated emote
            try {
                const decoder = new TextDecoder("utf-8");
                const jsonstring = decoder.decode(message.value);
                const parsedData = JSON.parse(jsonstring);
                setAggregatedEmotes(parsedData);
            } catch (error) {
                console.error("Failed to parse socket data:", error);
                setError("Failed to handle socket aggregated emotes");
            }
        };

        const loadData = async () => {
            // This function first load the Emotes that fetched from server_b then put the socket to listen to "aggregatedEmoteData"
            try {
                setError(null);
                await loadEmotes();
                socket.on("aggregatedEmoteData", handleSocketMessage);
            } catch (error) {
                console.error("Failed to load emotes:", error);
                setError("Failed to load emotes");
            }
        }

        loadData();

        return () => {
            // Event listener registered must be removed in order to prevent duplicate event registrations.
            socket.off("aggregatedEmoteData");
        }
    }, []);

    const loadEmotes = async () => {
        try {
            const dataEmotes = await getEmotes();
            if (dataEmotes) {
                setEmotes(dataEmotes);
            }
        } catch (error) {
            throw error;
        }

    };

    const getEmoteStatus = (emojiStatus) => {
        return emojiStatus ? "Active" : "Inactive";
    };

    const handleOnClickEmote = async (changedEmote) => {
        try {
            setEmotes(prevEmotes =>
                prevEmotes.map((emote) => {
                    if (emote.id === changedEmote.id) {
                        return { ...emote, active: !emote.active };
                    } else {
                        return emote;
                    }
                }));
            const message = await postEmotes({ ...changedEmote, active: !changedEmote.active });
            console.log(message);
            setError(null);
        } catch (error) {
            console.error("Failed to update emote status:", error);
            setError("Failed to update emote status");
        }

    };

    const renderEmotes = () => {
        // When the Emote component fails to get the allowed-emotes from server_b, 4 default emotes will be displayed
        if (emotes.length === 0) {
            return (
                <div>
                    {["❤️", "👍", "😢", "😡"].map((emoji, index) => {
                        <Emoji key={index} symbol={emoji} />
                    })}
                </div>
            );
        }

        return (
            <div>
                {emotes.map((emote, index) => {
                    return (
                        <div>
                            <Emoji key={emote.id} symbol={emote.value} />
                            <button onClick={() => handleOnClickEmote(emote)}>{getEmoteStatus(emote.active)}</button>
                        </div>
                    )
                })}
            </div>
        );
    };

    const renderAggregatedEmotes = () => {
        if (aggregatedEmotes.length === 0) {
            return (<div></div>);
        }
        else {
            return (
                <div>
                    {aggregatedEmotes.map((aggregatedEmote, index) => {
                        return <Emoji key={index} symbol={aggregatedEmote.emote} />
                    })}
                </div>
            );
        }
    };

    return (
        <>
            <div>
                List of emojis:
                {renderEmotes()}
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
            <div>
                Aggregated emoji:
                {renderAggregatedEmotes()}
            </div>
        </>
    );
}