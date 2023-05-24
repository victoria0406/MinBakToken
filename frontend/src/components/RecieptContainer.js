export function RecieptContainer({title, author, date, status}) {
    return (
        <div className="reciept-container">
            <div>
                <b>{title}</b>
                <hr/>
                <p>Author: {author}</p>
                <p>Date: {date}</p>
            </div>
            <div className="status">Status: <div className={`bedge ${status.toLowerCase()}-case`}>{status}</div></div>
        </div>
    )
}