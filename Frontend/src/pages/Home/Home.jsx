import { Header } from "../../components/Header/Header";
import { JsonVisualizer } from "../../components/JsonVisualizer/JsonVisualizer";
import ToggleSwitch from "../../components/ui/ToggleSwitch";

export default function Home() {
    return (
        <>
            <Header />
                <h1>God Of Api War</h1>
                <h6 className='font-gow'>All the information you need to know about God of War</h6>
                
                <div id='toggle-switch-json' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><p>Json</p><ToggleSwitch checked="true"/><p>Styled</p></div>
            <JsonVisualizer />
        </>
    );
}