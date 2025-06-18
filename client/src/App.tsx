import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
  return (
    <div className="App">
      {/* <div>Header</div> */}
      <RouterProvider router={router}></RouterProvider>
      {/* <div>Footer</div> */}
    </div>
  );
}

export default App;
