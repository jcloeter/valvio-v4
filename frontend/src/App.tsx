import './App.css'

function App() {

  return (
    <>
      <div className="card">
        <h1>Valvio</h1>

        <img 
          src="./public/headshot-2.jpg" 
          alt="john" 
          style={{ width: '200px', height: '300px', objectFit: 'cover', borderRadius: '15px' }} 
        />

        <h2>Introducing Valvio, the fastest way to learn trumpet.</h2>

        <p>Valvio is the world's most popular Trumpet Note Quiz App. Made by a trumpet teacher for trumpet players. </p>
          {/* <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button> */}
      </div>
    </>
  )
}

export default App
