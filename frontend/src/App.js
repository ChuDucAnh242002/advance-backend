import React, { useEffect, useState } from 'react';
import EmojiButton from './EmojiButton';

import { socket } from './socket';
import { ConnectionState } from './ConnectionState';

const App = () => {

  const [isConnected, setIsConnected] = useState(socket.connected)

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true)
    }

    socket.on('connect', onConnect)

    return () => {
      socket.off('connect', onConnect)
    };
  }, [])

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
    </div>
  );
}

export default App;
