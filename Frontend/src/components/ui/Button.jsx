import './Button.css'

export default function Button({ text, active }) {
    return (
        <button className={`button ${active ? 'active' : ''}`}><p className='font-normal text-indent-none' style={{margin: 0}}>{text}</p></button>
    );
}
