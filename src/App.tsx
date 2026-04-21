import { useNavigate } from 'react-router-dom';
import './App.css'

function App() {
  const navigate = useNavigate();

  return (
    <>
      <section id="center">
        <div>
          <h1>Your Next Movie</h1>
          <h3>Sponsored by Tubi</h3>
          <p>
            Look up a movie, rate it, and we'll find you your next great experience. 
          </p>
        </div>
        <button onClick={() => navigate('/movies')}>
          <h2>Search Now</h2>
        </button>

        <p>
          Keep getting recommended movies you've already watched? Want more personalized results? Create an account today. We will never sell or share your personal data.
        </p>
      </section>
    </>
  )
}

export default App