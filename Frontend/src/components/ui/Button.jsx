import './Button.css'

export default function Button({ text, active }) {
    return (
        <button className={`button ${active ? 'active' : ''}`}><p style={{margin: 0}}>{text}</p></button>
    );
}
