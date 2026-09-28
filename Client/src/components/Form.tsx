import React from "react";
import styles from "./styles/form.module.css";

interface FormProps{
    children: React.ReactNode, 
    buttonText: string, 
    header: string, 
    onFormSubmit: React.SubmitEventHandler<HTMLFormElement>
    className?: string | undefined
}

export default function Form({children, buttonText, header, onFormSubmit, className}: FormProps){
    return (
        <div className={`${styles.container} ${className ?? ''}`}>
            <h1 className={styles.header}>{header}</h1>
            <form onSubmit={onFormSubmit} className={styles.form}>
                {children}
                <button type="submit">{buttonText}</button>
            </form>
        </div>)
}