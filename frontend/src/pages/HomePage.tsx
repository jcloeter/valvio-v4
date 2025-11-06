import '../App.css'
import QuizList from '../components/QuizList'

function HomePage() {

  return (
    <>
      <div className="card">
        <h1>Valvio</h1>
        <div className = "info-card">
          <h2>Introducing Valvio, the fastest way to learn trumpet🎺🎶⚡</h2>
          <p> Made by a trumpet teacher for trumpet players. </p>
        </div>
      </div>
        <QuizList/>
    </>
  )
}

export default HomePage;