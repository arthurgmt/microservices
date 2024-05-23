import './App.css';
import Logement from './component/Logement';
import Form from './component/Form';
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';


function App() {

  const [properties, setProperties] = useState([]);

  useEffect(() => {
  fetch("http://localhost:8000/getlogement", { method: 'GET', mode: 'cors' })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        const properties = Object.keys(data).map((key) => {
          const propertyData = data[key];
  
          return {
            id: key,
            adresse: propertyData[3], 
            type: propertyData[5],
            surface: propertyData[6],
            price: propertyData[10],
          };

        });
        setProperties(properties);
      })
      .catch((error) => console.error(error));
  }, []);
  

  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>
      <div className="App-body">
        <Logement props={properties}/>
        <Form />
      </div>
    </div>
  );
}

export default App;
