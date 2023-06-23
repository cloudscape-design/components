import React from 'react';
import ReactDOM from 'react-dom/client';
import * as components from '@cloudscape-design/components';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function App() {
  console.log(components);
  return <></>;
}
