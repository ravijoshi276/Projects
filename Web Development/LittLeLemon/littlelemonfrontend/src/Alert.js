
export default function Alert({ type, heading, message }) {
    const Card = type === 'success' ? (
        <div className="fixed w-full bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 z-50" role="alert">
            <p className="font-bold">{heading}</p>
            <p className="text-sm">{message}</p>
        </div>
    ) : (
        <div className="fixed w-full bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 z-50" role="alert">
            <p className="font-bold">{heading}</p>
            <p className="text-sm">{message}</p>
        </div>
    );
    
    return Card;
}