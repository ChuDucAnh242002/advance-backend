import React, { useEffect, useState } from 'react';

import { socket, connectSocket, disconnectSocket } from './socket';
import { ConnectionState } from './ConnectionState';
import { Emote } from './Emote';
import { Interval } from './Interval';
import { Threshold } from './Threshold';

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    connectSocket(setIsConnected);

    return () => {
      disconnectSocket();
    }
  }, []);

  return (
    <div>
      <Emote />
      <ConnectionState isConnected={isConnected} />
      <Interval />
      <Threshold />
    </div >
  );
}

export default App;