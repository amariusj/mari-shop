
//Routing
import { BrowserRouter as Router } from 'react-router-dom'

//Allows the state to be provided within the entire app
import { DataProvider } from './GlobalState'

//Components
import Header from './components/Headers/Header'
import Pages from './components/Mainpages/Pages'

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <Header />
          <Pages />
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
