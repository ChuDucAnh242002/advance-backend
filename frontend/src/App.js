import React, { useState } from 'react';
import EmojiButton from './EmojiButton';

import { socket } from './socket';
import { ConnectionState } from './ConnectionState';

socket.on("connect", (data) => {
  console.log("Client connected")
});

const App = () => {

  const [isConnected, setIsConnected] = useState(socket.connected)

  socket.on("connect", (data) => {
    setIsConnected(true)
  });

  socket.on("rawEmoteData", (data) => {
    console.log(`Raw emote data: ${data.value}`)
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on("error", (err) => {
    console.log("General socket error:", err);
  });

  return (
    <div>
      <div>
        This is the fronend
      </div>
      <div>
        <ConnectionState isConnected={isConnected} />
      </div>
      <div >
        <EmojiButton symbol="❤️" label="heart" />
        <EmojiButton symbol="👍" label="like" />
        <EmojiButton symbol="😢" label="cry" />
        <EmojiButton symbol="😡" label="angry" />
      </div >
    </div >
  );
}

export default App;