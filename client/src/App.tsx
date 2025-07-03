import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import Header from './components/ui/Header';

function App() {
  return (
    <div className="App">
      <RouterProvider router={router}></RouterProvider>
      {/* <div>Footer</div> */}
    </div>
  );
}

export default App;
