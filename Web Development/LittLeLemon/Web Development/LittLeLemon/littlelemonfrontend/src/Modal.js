import { useRef ,useEffect } from "react";


export default function Modal({isOpen,onClose,title,children,className}){
    const dialogRef = useRef(null);
    
    //Sync the dialog Dom state with isOpen prop
    useEffect(()=>{
        const dialog= dialogRef.current;
        if(!dialog)  return ;
        if (isOpen){
            dialog.showModal();
        }else{
            dialog.close();
        }

    },[isOpen]);
    
    //Close when clicking on backdrop area
    const handleBackdropClick = (e)=>{
         const dialog = dialogRef.current;
        if (!dialog || e.target !== dialog) return;
        
        const rect = dialogRef.current.getBoundingClientRect();
        const isInDialog = e.clientX >= rect.left &&
                            e.clientY >= rect.top &&
                            e.clientX <= rect.right &&
                            e.clientY <= rect.bottom;
        if( !isInDialog){
            onClose();
        }};
        const handleCancel = (e) => {
        e.preventDefault(); // Stop native close to let React handle it via state
        onClose();
    };
        return(
            <dialog ref={dialogRef}
                onClose={onClose}
                onClick={handleBackdropClick}
                onCancel={handleCancel}
                className={className}>
                    <div className="modal-header">
                        <h2>{title}</h2>
                    <button onClick={onClose} type="button" className="close-btn" aria-label="Close">&times;</button>
                    </div>
                    <div className="modal-body">{children}</div>
                </dialog>
        )
    }

