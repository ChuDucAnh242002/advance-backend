import { getEmotes, postEmotes } from "./api";
import { useState, useEffect } from "react";
import { socket } from "./socket";
import Emoji from "./Emoji";

export const Emote = () => {

    const [emotes, setEmotes] = useState([])
    const [aggregatedEmotes, setAggregatedEmotes] = useState([])

    useEffect(() => {
        loadEmotes()

        socket.on("aggregatedEmoteData", (message) => {
            try {
                const decoder = new TextDecoder("utf-8");
                const jsonstring = decoder.decode(message.value)
                const parsedData = JSON.parse(jsonstring)
                setAggregatedEmotes(parsedData)
            } catch (error) {
                console.error("Failed to parse socket data:", error);
            }
        });

        return () => {
            socket.off("aggregatedEmoteData");
        }
    }, [])

    const loadEmotes = async () => {
        const dataEmotes = await getEmotes();
        if (dataEmotes !== null && dataEmotes !== undefined) {
            setEmotes(dataEmotes)
        }
    }

    const getEmoteStatus = (emojiStatus) => {
        if (emojiStatus) {
            return "Active"
        } else {
            return "Inactive"
        }
    }

    const renderEmotes = () => {
        if (emotes.length === 0) {
            return (<div>
                <Emoji symbol="❤️" label="heart" />
                <Emoji symbol="👍" label="like" />
                <Emoji symbol="😢" label="cry" />
                <Emoji symbol="😡" label="angry" />
            </div>)
        }
        else {
            return (<div>
                {emotes.map((emote, index) => {
                    return <div>
                        <Emoji key={emote.id} symbol={emote.value} />
                        <button onClick={() => handleOnClickEmote(emote)}>{getEmoteStatus(emote.active)}</button>
                    </div>
                })}
            </div>)
        }
    }

    const renderAggregatedEmotes = () => {
        if (aggregatedEmotes.length === 0) {
            return (<div></div>)
        }
        else {
            return (<div>
                {aggregatedEmotes.map((aggregatedEmote, index) => {
                    return <Emoji key={index} symbol={aggregatedEmote.emote} />
                })}
            </div>)
        }
    }

    const handleOnClickEmote = (changedEmote) => {

        const updatedEmotes = emotes.map((emote) => {
            if (emote.id === changedEmote.id) {
                changedEmote.active = !changedEmote.active
                return changedEmote
            }
            else {
                return emote
            }
        })
        postEmotes(changedEmote)
        setEmotes(updatedEmotes)
    }

    return (
        <>
            <div>
                List of emojis:
                {renderEmotes()}
            </div>
            <div>
                Aggregated emoji:
                {renderAggregatedEmotes()}
            </div>
        </>
    )
}