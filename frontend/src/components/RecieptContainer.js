function leftPad(value) {
    if (value >= 10) {
        return value;
    }

    return `0${value}`;
}

function toStringByFormatting(source, delimiter = '-') {
    const year = source.getFullYear();
    const month = leftPad(source.getMonth() + 1);
    const day = leftPad(source.getDate());

    return [year, month, day].join(delimiter);
}

export function RecieptContainer({title, club, date, state}) {
    return (
        <div className="reciept-container">
            <div>
                <b>{title}</b>
                <hr/>
                <p>club: {club}</p>
                <p>Date: {toStringByFormatting(new Date(date))}</p>
            </div>
            <div className="status">Status: <div className={`bedge ${state.toLowerCase()}-case`}>{state}</div></div>
        </div>
    )
}