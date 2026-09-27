import React from "react";
import styles from "./styles/form.module.css";

export default function Form(children: React.ReactNode, props: {buttonText: string, header: string, onFormSubmit: React.SubmitEventHandler<HTMLFormElement>}){
    return (
    <div className={styles.container}>
        <h1 className={styles.header}>{props.header}</h1>
        <form onSubmit={props.onFormSubmit} className={styles.form}>
            {children}
            <button type="submit">{props.buttonText}</button>
        </form>
    </div>)
}