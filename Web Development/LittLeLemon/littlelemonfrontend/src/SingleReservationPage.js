import { useOutletContext, useParams } from "react-router";
import BackButton from "./BackButton";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./context/AuthContext";

//  1. MOVE THIS OUTSIDE THE COMPONENT entirely.
// This prevents it from regenerating and breaking your useEffect loop!
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 10; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 23 && minute === 30) continue; 

      const h24 = hour < 10 ? `0${hour}` : `${hour}`;
      const m = minute === 0 ? "00" : `${minute}`;
      
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? "PM" : "AM";
      const label = `${displayHour}:${m} ${ampm}`;
      const value = `${h24}:${m}`;
      
      const totalMinutes = hour * 60 + minute;
      
      options.push({ label, value, totalMinutes });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();
const startTimeOptions = timeOptions.filter(t => t.totalMinutes <= 1350);

export default function SingleReservationPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const { reservationData } = useOutletContext();
  
  //  2. Initialize state fields with safe, blank defaults
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [tables, setTables] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  const [isValidEmail, setIsValidEmail] = useState(true);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // End time filtered options calculated on the fly
  const filteredEndTimeOptions = timeOptions.filter(t => {
    if (t.totalMinutes <= 600) return false; 
    if (!startTime) return true;
    const selectedStartObj = timeOptions.find(opt => opt.value === startTime);
    return selectedStartObj ? t.totalMinutes > selectedStartObj.totalMinutes : true;
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStartTimeChange = (e) => {
    const newStart = e.target.value;
    setStartTime(newStart);

    if (newStart && endTime) {
      const startObj = timeOptions.find(t => t.value === newStart);
      const endObj = timeOptions.find(t => t.value === endTime);
      if (startObj && endObj && endObj.totalMinutes <= startObj.totalMinutes) {
        setEndTime("");
      }
    }
  };

  useEffect(() => {
    axios.get("https://little-lemon-backend-afqk.onrender.com/api/tables")
      .then(response => setTables(response.data.results || response.data))
      .catch(err => console.error("Error fetching tables:", err));
  }, []);

  //  3. Clean dependency array prevents resetting your edits
  useEffect(() => {
    if (reservationData) {
      const item = reservationData.find(res => String(res.id) === String(id)) || {};
      setFormData(item);

      if (item.time_slot) {
        const timeslot = item.time_slot.split(" - ");
        const currentStartLabel = timeslot[0]?.trim();
        const currentEndLabel = timeslot[1]?.trim();

        const foundStart = timeOptions.find(t => t.label === currentStartLabel);
        const foundEnd = timeOptions.find(t => t.label === currentEndLabel);

        if (foundStart) setStartTime(foundStart.value);
        if (foundEnd) setEndTime(foundEnd.value);
      }
    }
  }, [reservationData, id]); // Removed timeOptions from here!

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const startObj = timeOptions.find(t => t.value === startTime);
    const endObj = timeOptions.find(t => t.value === endTime);
    const timeSlotString = startObj && endObj ? `${startObj.label} - ${endObj.label}` : formData.time_slot;

    const payload = {
      ...formData,
      time_slot: timeSlotString,
    };

    const config = {
      headers: {
        "Content-Type": "application/JSON",
        "Authorization": `Token ${token}`,
      }
    };

    try {
      await axios.patch(`https://little-lemon-backend-afqk.onrender.com/api/reservations/${id}/`, payload, config);
      setSubmitted(true);
      // NOTE: Removed setStartTime("") and setEndTime("") so choices don't disappear on submit click!
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data);
      } else if (err.request) {
        setError({ non_field_errors: ["No response received from the server."] });
      } else {
        setError({ non_field_errors: [err.message] });
      }
    }
  };

  const filteredTables = tables?.filter(
    table => !formData.number_of_guests || table.capacity >= Number(formData.number_of_guests)
  ) || [];

  return (
    <main>
      <BackButton />
        
      <div className="reservation-container">
        <h2 className="reservation-title">Edit Reservation</h2>
        
        {submitted && <div className="success-message">Reservation successfully updated!</div>}
        {error && (
          <div className="error-message">
            {typeof error === 'string' ? (
              <p>{error}</p>
            ) : (
              <ul>
                {Object.entries(error).map(([field, messages]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(", ") : String(messages)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name:</label>
            <input type="text" name="customer_name" value={formData.customer_name || ""} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email || ""} 
              onChange={handleChange}  
              onBlur={() => setIsValidEmail(emailRegex.test(formData.email))} 
              required 
            />
            {!isValidEmail && <div className="error">Please enter a valid email address.</div>}
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Number of Guests:</label>
            <input type="number" name="number_of_guests" min="1" value={formData.number_of_guests || ""} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Date (Available from tomorrow):</label>
            <input type="date" name="date" min={getTomorrowDate()} value={formData.date || ""} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-col">
              <label>Start Time:</label>
              <select value={startTime} onChange={handleStartTimeChange}>
                <option value="">-- Choose Start Time --</option>
                {startTimeOptions.map((t) => (
                  <option key={`start-${t.value}`} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="form-col">
              <label>End Time:</label>
              <select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                <option value="">-- Choose End Time --</option>
                {filteredEndTimeOptions.map((t) => (
                  <option key={`end-${t.value}`} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Table (Optional):</label>
            <select name="table" value={formData.table || ""} onChange={handleChange}>
              <option value="">No preference / Assign later</option>
              {filteredTables.map(table => (
                <option key={table.id} value={table.id}>Table #{table.id} (Seats: {table.capacity})</option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={!isValidEmail}>
            Update Reservation
          </button>
        </form>
      </div>
    </main>
  );
}
