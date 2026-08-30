import React from 'react';

export default function Alert({ type, heading, message }) {

  const isSuccess = type === 'success';

  const theme = isSuccess ? {
    container: "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-100/40",
    heading: "text-emerald-950",
    message: "text-emerald-700"
  } : {
    container: "bg-rose-50 border-rose-200 text-rose-800 shadow-rose-100/40",
    heading: "text-rose-950",
    message: "text-rose-700"
  };


  return (
    <div 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md p-4 border rounded-xl shadow-xl transition-all duration-300 ${theme.container}`} 
      role="alert"
    >
      <p className={`font-bold text-sm tracking-wide mb-0.5 ${theme.heading}`}>
        {heading}
      </p>
      <p className={`text-xs font-medium leading-relaxed ${theme.message}`}>
        {message}
      </p>
    </div>
  );
}
