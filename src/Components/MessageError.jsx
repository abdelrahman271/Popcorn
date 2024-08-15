export default function MessageError({message}){
    return (
        <p className="error">
            <span>⛔️</span> {message}
        </p>
    );
}