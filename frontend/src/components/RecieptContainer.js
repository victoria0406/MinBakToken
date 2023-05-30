import { toStringByFormatting } from "../utils/dateParser"

export function RecieptContainer({title, club, date, state, onClick}) {
    if (!title && !club && !date) {
        return (
            <div className="reciept-container">
                <div>
                    <h5 className='placeholder'>
                        <span className='content'>p</span>
                    </h5>
                    <hr/>
                    <p className='placeholder'>
                        <span className='label'>p</span><span className='content'>p</span>
                    </p>
                    <p className='placeholder'>
                    <span className='label'>p</span><span className='content'>p</span>
                    </p>
                </div>
                <p className='placeholder'>
                    <span className='label'>p</span><span className='content'>p</span>
                </p>
            </div>
        )
    } else {
        return (
            <div className="reciept-container" onClick={onClick}>
                <div>
                    <h5>{title}</h5>
                    <hr/>
                    <p>club: {club}</p>
                    <p>Date: {toStringByFormatting(date)}</p>
                </div>
                <div className="status">Status: <div className={`bedge ${state.toLowerCase()}-case`}>{state}</div></div>
            </div>
        )
    }
}