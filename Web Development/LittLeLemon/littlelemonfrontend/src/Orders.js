import Heading from "./Heading";
import { ordersApi } from "./services/api";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import placeholder_image from "./assets/images/menuitem-placeholder.png";

export default function Orders() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [orders, setOrders] = useState([]);
    const [count, setCount] = useState(0);
    const { token } = useAuth();

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchAndStitchOrders = async () => {
            setLoading(true);
            setError(false);

            try {
                const cartData = await ordersApi.getOrders(token);
                
                if (cartData && cartData.count > 0 && Array.isArray(cartData.results)) {
                    setCount(cartData.count);
                    const itemsData = await ordersApi.getAllOrders(cartData);
                    
                    const fullOrderDetails = [...cartData.results].reverse().map((order) => ({
                        ...order,
                        orderitem: order.orderitem.map((item) => {
                            const matchedItem = itemsData?.results?.find(p => p.id === item.menuitem);
                            return {
                                ...item,
                                image_url: matchedItem?.image_url || placeholder_image,
                                title: matchedItem?.title || "Unknown"
                            };
                        })
                    }));

                    setOrders(fullOrderDetails);
                } else if (cartData?.count === 0) {
                    setOrders([]);
                    setCount(0);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Failed to fetch orders:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchAndStitchOrders();
    }, [token]);

    return (
        <main className="max-w-3xl mx-auto px-4 py-8 text-[var(--text-main)] space-y-6">
            <Heading>Your Orders</Heading>

            {loading ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <p className="text-[var(--text-muted)] animate-pulse">Loading orders...</p>
                </div>
            ) : error ? (
                <div 
                    style={{ backgroundColor: 'var(--color-error)' }}
                    className="p-4 text-sm font-medium text-white rounded-lg shadow-sm border border-[var(--border-color)] text-center"
                >
                    Some Error Occurred while fetching orders.
                </div>
            ) : orders.length > 0 && count > 0 ? (
                <div className="space-y-6">
                    {orders.map((item) => (
                        <Card 
                            key={item.id} 
                            id={item.id} 
                            count={item.orderitem.length} 
                            date={item.date} 
                            total={item.total} 
                            orderitems={item.orderitem} 
                            status={item.status} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-[var(--bg-surface)] rounded-xl border border-[var(--border-color)] shadow-sm">
                    <p className="text-[var(--text-muted)]">There are no orders to show.</p>
                </div>
            )}
        </main>
    );
}

const Card = ({ id, count, status, date, total, orderitems }) => {
    const [year, month, day] = date.split('-');
    const newDate = new Date(year, month - 1, day);

    return (
        <article className="border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl p-5 shadow-sm space-y-4">
            {/* Card Header Info */}
            <div className="flex flex-wrap justify-between items-center pb-4 border-b border-[var(--border-color)] gap-4 text-sm">
                <div>
                    <div className="font-bold text-[var(--text-muted)] text-xs uppercase tracking-wider">Ordered On</div>
                    <div className="text-[var(--text-main)] font-medium mt-0.5">{newDate.toDateString()}</div>
                </div>
                <div>
                    <div className="font-bold text-[var(--text-muted)] text-xs uppercase tracking-wider">Items</div>
                    <div className="text-[var(--text-main)] font-medium mt-0.5">{count}</div>
                </div>
                <div>
                    <div className="font-bold text-[var(--text-muted)] text-xs uppercase tracking-wider">Total</div>
                    <div className="text-[var(--text-main)] font-medium mt-0.5">{total}</div>
                </div>
                <div>
                  
                    <span 
                        style={{
                            backgroundColor: status ? 'rgba(46, 125, 50, 0.12)' : 'rgba(237, 108, 2, 0.12)',
                            color: status ? 'var(--color-success)' : 'var(--color-warning)',
                            borderColor: status ? 'var(--color-success)' : 'var(--color-warning)'
                        }}
                        className="px-3 py-1 rounded-full text-xs font-semibold border border-opacity-40 shadow-xs"
                    >
                        {status ? "Delivered" : "Not Delivered"}
                    </span>
                </div>
            </div>

            {/* Order Items List */}
            <div className="space-y-3">
                {orderitems.map((item, index) => (
                    <div key={item.id || index} className="flex items-center gap-4 p-3 rounded-lg bg-[var(--bg-container)] border border-[var(--border-color)]">
                        <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 border border-[var(--border-color)]">
                            <img 
                                src={item.image_url || placeholder_image} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                                loading="lazy" 
                            />
                        </div>
                        <div className="flex-grow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <div>
                                <h4 className="font-semibold text-[var(--text-main)]">{item.title}</h4>
                                <p className="text-xs text-[var(--text-muted)]">Quantity: {item.quantity}</p>
                            </div>
                            <div className="font-medium text-[var(--text-main)]">{item.price}</div>
                        </div>
                    </div>
                ))}
            </div>
        </article>
    );
};