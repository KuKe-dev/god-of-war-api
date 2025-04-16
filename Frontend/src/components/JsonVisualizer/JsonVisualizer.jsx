/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import ReactJson from 'react-json-view';
import './JsonVisualizer.css'
import Button from '../ui/Button';


export function JsonVisualizer() {

    const serverUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api/';
    console.log(serverUrl);
    const [jsonData, setJsonData] = useState(null); // Initialize as null or an empty object
    const [jsonVisualizerValue, setJsonVisualizerValue] = useState(
    'characters/kratos'
    );

    function fetchJson(jsonFile) {
    fetch(serverUrl + jsonFile, {
        method: 'GET',
        mode: 'cors', 
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
    })
        .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Return the parsed JSON
        })
        .then((data) => {
        setJsonData(data); // Set the JSON data to state
        })
        .catch((error) => {
        console.error('Error fetching JSON:', error);
        setJsonData({ error: 'Failed to fetch JSON data. Try again' }); // Handle errors
        });
    }

    // Use useEffect to fetch data when the component mounts
    useEffect(() => {
        fetchJson(jsonVisualizerValue);
    }, []); // Run once on mount, without dependencies


    useEffect(() => {
        const switchToggle = document.getElementById('toggle-switch');
        switchToggle.addEventListener('click', handleCheckboxChange);
    }, []);

    // eslint-disable-next-line no-unused-vars
    const [isActive, setIsActive] = useState(false);
    
    const handleCheckboxChange = useCallback(() => {
        const switchToggle = document.getElementById('toggle-switch');
        const newState = switchToggle.getAttribute('aria-checked') === 'false';
        setIsActive(newState);
        if (!newState) {
            document.getElementById('json-visualizer-json').style.display = "block";
            document.getElementById('json-visualizer-styled').style.display = "none";
        } else {
            document.getElementById('json-visualizer-json').style.display = "none";
            document.getElementById('json-visualizer-styled').style.display = "block";
        }
    }, [setIsActive]);
    
    function handleCopy() {
        const input = document.querySelector(".json-visualizer-form-input");
        const form = document.querySelector(".json-visualizer-form");
        const text = serverUrl + input.value;
        navigator.clipboard.writeText(text)
            .then(() => {
                const p = document.createElement('p');
                p.textContent = 'Text copied';
                p.setAttribute('class', 'popup-copy');
                if (document.querySelector('.popup-copy')) {
                    document.querySelector('.popup-copy').remove();
                }
                form.insertAdjacentElement('afterend', p);
                setTimeout(() => {
                    p.remove();
                }, 1500);
            })
            .catch(err => {
                console.log('Something went wrong', err);
            });
    }

return (
    <section className="json-visualizer">
            <form id='json-visualizer-form' className='json-visualizer-form' 
                onSubmit={(e) => { e.preventDefault(); fetchJson(jsonVisualizerValue); }}
            >
                <label className='json-visualizer-form-label'>
                    {serverUrl}
                </label>
                <input className='json-visualizer-form-input' type="text" placeholder="characters/kratos"
                value={jsonVisualizerValue}
                onChange={(e) => setJsonVisualizerValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        document.querySelector('#json-visualizer-form-button').click();
                    }
                }}
                />
                <button className='json-visualizer-form-copy' onClick={handleCopy}>
                    <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 16.5L19.5 4.5L18.75 3.75H9L8.25 4.5L8.25 7.5L5.25 7.5L4.5 8.25V20.25L5.25 21H15L15.75 20.25V17.25H18.75L19.5 16.5ZM15.75 15.75L15.75 8.25L15 7.5L9.75 7.5V5.25L18 5.25V15.75H15.75ZM6 9L14.25 9L14.25 19.5L6 19.5L6 9Z" fill="#080341"></path> </g></svg>
                </button>
                <button id='json-visualizer-form-button' className='json-visualizer-form-button' type="submit">Submit</button>
            </form>
            <aside style={{margin: "20px 0",justifyContent: "center", display: "flex",width: "100%",alignItems: "center",flexWrap: "wrap",gap: "20px", padding: "0 100px"}}>
                <small>Try:</small>
                <a href='' onClick={(e) => { e.preventDefault(); setJsonVisualizerValue('characters/kratos'); fetchJson('characters/kratos'); }}><Button active={jsonVisualizerValue === 'characters/kratos'} text={".../characters/kratos"} /></a>
                <a href='' onClick={(e) => { e.preventDefault(); setJsonVisualizerValue('characters/zeus'); fetchJson('characters/zeus'); }}><Button active={jsonVisualizerValue === 'characters/zeus'} text={".../characters/zeus"} /></a>
                <a href='' onClick={(e) => { e.preventDefault(); setJsonVisualizerValue('characters/poseidon'); fetchJson('characters/poseidon'); }}><Button active={jsonVisualizerValue === 'characters/poseidon'} text={".../characters/poseidon"} /></a>
                <a href='' onClick={(e) => { e.preventDefault(); setJsonVisualizerValue('characters/athena'); fetchJson('characters/athena'); }}><Button active={jsonVisualizerValue === 'characters/athena'} text={".../characters/athena"} /></a>
            </aside>
        <div className='json-visualizer-content' style={{width: "100%", padding: "30px 0px"}}>
            <div id='json-visualizer-json' className='json-visualizer-json' style={{display: "none"}}>
                <ReactJson
                collapsed={1}
                collapseStringsAfterLength={50}
                displayDataTypes={false} displayObjectSize={false}
                enableClipboard={false}
                indentWidth={5}
                theme={"apathy"}
                name={false}
                style={{
                    width: "100%",
                    minHeight: "300px",
                    height: "max-content",
                    padding: "8px 15px 8px 16px",
                }}
                src={ jsonData && jsonData.error ? {"Wrong_Path":"Try another path"} :
                    jsonData ? jsonData : ['Loading...']} />
            </div>

            <div id='json-visualizer-styled' style={{width: "100%", backgroundColor: "rgb(var(--red-c) / 5%)", padding: "15px"}}>
                {jsonData && jsonData.error ? <h4 className='font-normal text-gold'>Wrong path</h4>:
                jsonData ? 
                !jsonData.name ? "":
                <>
                <article className='styled-article' style={{padding: "30px"}}>

                    <h2 style={{marginLeft: "28%"}} className='styled-name text-left text-gold'>{jsonData.name ? jsonData.name : "No name"}</h2>

                    <section style={{display: "flex",gap: "50px", justifyContent: "space-between", alignItems: "flex-start"}}>

                        <div style={{padding: "30px"}}>{String(jsonData.description).split('\n').map((line, index) => <p style={{fontSize: "1.2rem", textIndent: "1rem",}} key={index}>{line}<br /></p>)}</div>

                        { jsonData && jsonData.image && Object.keys(jsonData.biographicalInformation).length > 0 && Object.keys(jsonData.physicalInformation).length > 0 ?
                        <aside style={{backgroundColor: "rgb(0 0 0 / 30%)", padding: "30px"}}>

                            <img src={jsonData.image} style={{width: "auto", height: "max-content", objectFit: "contain", maskImage: "linear-gradient(to bottom,var(--deep-purple) 30%, transparent)", borderRadius: "10px"}} alt='' referrerPolicy='no-referrer'></img>
                            
                            <section style={{margin: "10px 0"}}>
                            <h5 style={{margin: "40px 0 10px"}} className='text-center text-indent-none text-gold'>{jsonData.biographicalInformation && Object.keys(jsonData.biographicalInformation).length > 0 ? "Biographical Information" : ""}</h5>
                                <ul>
                                    {jsonData.biographicalInformation && Object.entries(jsonData.biographicalInformation).map(([key, value]) => (
                                        <li key={key} style={{listStyle: "inside", textIndent: "2rem"}}>
                                            <p style={{margin: "5px 0px", textIndent: "0", display: "inline-block"}}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong></p><p style={{display: "inline"}}> {value} </p>
                                        </li>
                                    ))}
                                </ul>
                            <div style={{height: "0px", width: "100%", border: "1px dashed rgb(var(--gold-c) / 30%)", margin: "30px 0"}}></div>
                            <h5 style={{margin: "0 0 10px"}} className='text-center text-indent-none text-gold'>{jsonData.biographicalInformation && Object.keys(jsonData.biographicalInformation).length > 0 ? "Physical Information" : ""}</h5>
                                <ul>
                                    {jsonData.physicalInformation && Object.entries(jsonData.physicalInformation).map(([key, value]) => (
                                        <li key={key} style={{listStyle: "inside", textIndent: "2rem"}}>
                                            <p style={{margin: "5px 0px", textIndent: "0", display: "inline-block"}}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong></p><p style={{display: "inline"}}> {value} </p>
                                        </li>
                                    ))}
                                </ul>
                                    
                            </section>

                        </aside>
                        : ""
                        }

                    </section>   

                </article>
                </>
                :
                <h2>Loading...</h2>}
            </div>

            <footer style={{width: "100%",marginTop: "20px", display: "flex", alignItems: "flex-end", justifyContent: "flex-end"}}>
                <a href={jsonData && jsonData.wiki} target='_blank' rel='noreferrer' style={{textDecoration: "none"}}><Button active={false} text={"Go to Wiki"} /></a>
            </footer>
        </div>

    </section>
);}