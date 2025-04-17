import React, { useEffect, useState } from 'react';
import Emoji from './Emoji';

import { socket } from './socket';
import { ConnectionState } from './ConnectionState';


const App = () => {

  const [isConnected, setIsConnected] = useState(socket.connected)
  const [emotes, setEmotes] = useState([])
  const [interval, setInterval] = useState(0)
  const [threshold, setThreshold] = useState(0)
  const [aggregatedEmotes, setAggregatedEmotes] = useState([])


  useEffect(() => {
    socket.connect()

    socket.on("connect", (data) => {
      setIsConnected(true)
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false)
      if (reason === "transport close") {
        socket.connect()
      }
    })

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

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on("error", (err) => {
      console.log("General socket error:", err);
    });

    let dataEmotes = getEmotes()
    if (dataEmotes !== null && dataEmotes !== undefined) {
      setEmotes(dataEmotes)
    }

    // let dataInterval = getInterval()
    // setInterval(dataInterval)

    // let dataThreshold = getThreshold()
    // setThreshold(dataThreshold)

    return () => {
      socket.off("connect");
      socket.off("aggregatedEmoteData");
      socket.off("connect_error");
      socket.off("error");
      socket.disconnect();
    }
  }, [])

  const getEmotes = () => {
    fetch('/api/emote')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        console.log(data)
        if (data.emotes !== null || data.emotes !== undefined) {
          console.log(data.emotes)
          return data.emotes
        }
        else {
          console.error("Data emotes is null or undefined")
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const getInterval = () => {
    fetch('http://localhost:8000/settings/interval')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        if (data.interval !== null || data.interval !== undefined) {
          return data.interval
        }
        else {
          console.error('Data interval is null or undefined')
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const getThreshold = () => {
    fetch('http://localhost:8000/settings/threshold')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(data => {
        if (data.threshold !== null || data.threshold !== undefined) {
          return data.threshold
        }
        else {
          console.error('Data threshold is null or undefined')
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
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
        {emotes.map((emoji, index) => {
          return <Emoji key={index} symbol={emoji} />
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

  return (
    <div>
      <div>
        List of emojis:
        {renderEmotes()}
      </div>
      <div>
        Aggregated emoji:
        {renderAggregatedEmotes()}
      </div>
      <div>
        <ConnectionState isConnected={isConnected} />
      </div>
      <p>
        Interval: {interval}
      </p>
      <div>
        <input placeholder='Type to change interval'></input>
        <button>Change Interval</button>
      </div>
      <p>
        Threshold: {threshold}
      </p>
      <div>
        <input placeholder='Type to change threshold'></input>
        <button>Change threshold</button>
      </div>

    </div >
  );
}

export default App;