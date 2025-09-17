import { useState } from 'react'
import './App.css'
import ProductCard from './component/Productcard'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Jnaneswar</h1>
    
      <div>
        <h2>Products List</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <ProductCard name="Wireless Mouse" price="25.99" status="In Stock" />
          <ProductCard name="Keyboard" price="45.50" status="Out of Stock" />
          <ProductCard name="Monitor" price="199.99" status="In Stock" />
        </div>
      </div>
    </>
  )
}

export default App
