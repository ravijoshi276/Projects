import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import { Link, useOutletContext } from "react-router";
import axios from "axios";
import Heading from "./Heading";
import Section from "./Section";
import Modal from "./Modal";
import React from "react";

export default function Reservations() {
    const {reservationData,cancleReservation} = useOutletContext();
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const timeoutRef = useRef(null);

    // Cleanup timeout on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    
    const onClose = () => {
        setIsOpen(false);
        setSelectedId(null);
    };

    const itemModify = useCallback((id) => {
        console.log("Modify booking:", id);
    }, []);

    const cancleFunc = useCallback((id) => {
        setSelectedId(id);
        setIsOpen(true);
    }, []);

    const cancleFuncModal = async () => {
        if (!selectedId) return;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            }
        };

        try {
            await axios.patch(`http://localhost:8000/api/reservations/${selectedId}/`, { status: "Cancelled" }, config);
            
            cancleReservation(selectedId);
            
            setIsCancelled(true);
            timeoutRef.current = setTimeout(() => {
                setIsCancelled(false);
                onClose();
            }, 3000);
            
        } catch (err) {
            console.error("Failed to cancel reservation:", err);
        }
    };

    const itemCards = reservationData !== null ? reservationData.map(item => (
        <Card 
            key={item.id} 
            id={item.id} 
            customer_name={item.customer_name} 
            date={item.date} 
            time_slot={item.time_slot} 
            number_of_guests={item.number_of_guests} 
            phone={item.phone} 
            status={item.status} 
            email={item.email} 
            table={item.table} 
            modifyFunc={itemModify} 
            cancleFunc={cancleFunc}
        />
    )) : <div>Loading Data...!!!</div>;

    return (
        <main>
            <Heading>Reservations</Heading>
            {isCancelled && <div className="alert success">Reservation Cancelled successfully</div>}
            {itemCards}
            <Modal isOpen={isOpen} onClose={onClose} title="Cancel Reservation" className="reservation-modal">
                <p>Are you sure you want to cancel this reservation?</p>
                <button type="button" onClick={onClose}>No</button>
                <button type="button" onClick={cancleFuncModal}>Yes</button>
            </Modal>
        </main>
    );
}

// Wrapped in React.memo to prevent unnecessary re-renders when parent modal state changes
const Card = React.memo(({ id, table, customer_name, email, phone, number_of_guests, date, time_slot, status, cancleFunc, modifyFunc }) => {
    const isPending = status === "Pending";
    
    return (
        <Section sectionclass="customer-reservation-card">
            <div className="card-status-banner pending">
                <Heading>
                    <span className="status-icon">{isPending ? "⏳" : status === "Confirmed" ? "✅" : "❌"}</span>
                    <span className="status-text">{isPending ? "Reservation Pending" : status==="Cancelled"?"Reservation Cancelled ": "Reservation Confirmed"}</span>
                </Heading>
            </div>

            <Section sectionclass="card-body">
                <div className="restaurant-info">
                    <Heading className="title">Table Booking</Heading>
                    <span className="booking-ref">Booking ID: #{id}</span>
                </div>

                <div className="details-grid">
                    <div className="detail-item">
                        <span className="icon">📅</span>
                        <div>
                            <span className="label">Date</span>
                            <span className="value">{date}</span>
                        </div>
                    </div>

                    <div className="detail-item">
                        <span className="icon">⏰</span>
                        <div className="details">
                            <span className="label">Time Slot</span>
                            <span className="value">{time_slot}</span>
                        </div>
                    </div>

                    <div className="detail-item">
                        <span className="icon">🪑</span>
                        <div className="details">
                            <span className="label">Table</span>
                            <span className="value">{table}</span>
                        </div>
                    </div>

                    <div className="detail-item">
                        <span className="icon">👥</span>
                        <div className="details">
                            <span className="label">Guests</span>
                            <span className="value">{number_of_guests}</span>
                        </div>
                    </div>
                </div>

                <div className="customer-info-box">
                    <p className="booked-for-label">Booked for:</p>
                    <p className="customer-name">{customer_name}</p>
                    <p className="customer-contact">📞 {phone} &bull; ✉️ {email}</p>
                </div>
            </Section>

            {isPending && (
                <div className="card-footer">
                    <Link className="btn btn-secondary" to={`./${id}`}>Modify Booking</Link>
                    <button type="button" className="btn btn-danger" onClick={() => cancleFunc(id)}>Cancel Booking</button>
                </div>
            )}
        </Section>
    );
});

Card.displayName = "Card";