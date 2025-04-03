import React from 'react';
import EmojiButton from './EmojiButton';

function App() {
  return (
    <div>
      <div>
        This is the fronend
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
