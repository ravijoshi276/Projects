import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./context/AuthContext";
import { Link, useOutletContext } from "react-router";
import axios from "axios";
import Heading from "./Heading";
import Section from "./Section";
import Modal from "./Modal";
import React from "react";
import Alert from "./Alert";


const BASE_URL = process.env.REACT_APP_API_URL;

export default function Reservations({isManager=false}) {
    const {reservationData,cancleReservation,confirmReservation} = useOutletContext();
    const { token,group } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const timeoutRef = useRef(null);
    const [isConfirmed,setIsConfirmed] = useState(false);
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
            await axios.patch(`${BASE_URL}/api/reservations/${selectedId}/`, { status: "Cancelled" }, config);
            
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

    const confirmFunc = async () => {
        if (!selectedId) return;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            }
        };
        setIsConfirmed(false);
        try {
            await axios.patch(`${BASE_URL}/api/reservations/${selectedId}/`, { status: "Confirmed" }, config);
            
            confirmReservation(selectedId);
            
            setIsConfirmed(true);
            timeoutRef.current = setTimeout(() => {
                setIsConfirmed(false);
                onClose();
            }, 3000);
            
        } catch (err) {
            console.error("Failed to cancel confirm:", err);
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
            isManager={isManager}
            cancleFunc={cancleFunc}
            confirmationFunc={confirmFunc}
        />
    )) : <div>Loading Data...!!!</div>;
    
     if (isManager && group !== "manager") {
        return (
            <main>
                <Heading>Access Denied</Heading>

                <p>
                    You don't have permission to access this page.
                </p>

                <Link to="/">
                    Return Home
                </Link>
            </main>
        );
    }

    return (
        <main>
            <Heading>Reservations</Heading>
            {isCancelled && <Alert type='success' message="Reservation Cancelled successfully" />}
            {isConfirmed && <Alert type='success' message="Reservation Confirmed successfully" />}
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
const Card = React.memo(({ id, table, customer_name, email, phone, number_of_guests, date, time_slot, status, cancleFunc, isManager,confirmationFunc }) => {
    const isPending = status === "Pending";
    //Check is the date has passed 
    const isValidDate = (new Date(date))> (new Date())
    
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

            {isPending && isValidDate &&(
                <div className="flex w-full h-[20%] justify-evenly  flex-wrap mt-5 items-center gap-10 text-center text-sm text-[var(--text-main)]">
                    {isManager&&<Link className="p-1  max-w-auto md:max-w-[25%] bg-[var(--bg-container)] grow hover:text-[var(--color-secondary)] hover:scale-105 text-[var(--text-main)] " to={`./${id}`}>Modify Booking</Link>}
                    {isManager&& <button className="p-1 h-full max-w-auto  bg-[var(--bg-container)] grow hover:text-[var(--color-secondary)] hover:scale-105 text-[var(--text-main)] " onClick={()=>confirmationFunc(id)}>Confirme Reservation</button>}
                    <button type="button" className="p-1 h-full max-w-auto md:max-w-[25%] bg-[#FFF1F2] grow hover:bg-[#FF6670] hover:scale-105 text-[var(--text-main)] " onClick={() => cancleFunc(id)}>Cancel Booking</button>
                </div>
            )}
        </Section>
    );
});

Card.displayName = "Card";