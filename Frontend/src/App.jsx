import './style/App.css'

import { JsonVisualizer } from './components/JsonVisualizer/JsonVisualizer.jsx'
import { Header } from './components/Header/Header.jsx';
import ToggleSwitch from './components/ui/ToggleSwitch.jsx';

function App() {

  

  return (
    <>
    <Header />
    <h1>God Of Api War</h1>
    <h6 className='font-gow'>All the information you need to know about God of War</h6>
    
    <div id='toggle-switch-json' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><p>Json</p><ToggleSwitch/><p>Styled</p></div>
    <JsonVisualizer />
    </>
  );
}

export default App;