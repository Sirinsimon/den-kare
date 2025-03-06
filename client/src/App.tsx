import { Button } from './components/ui/button'
import { Link } from 'react-router-dom'

function App() {

  return (
    <div>
      <Button> HIi</Button>
      <Link to="/patient-data-analyzer">Go to Patient Data Analyzer</Link>
    </div>
  )
}

export default App
