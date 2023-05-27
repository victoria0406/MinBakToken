import { RecieptContainer } from "./RecieptContainer";

const statusIndex = {
    Reject: 0,
    Progress: 1,
    Done: 2
};
const statusSortFunc= (r1, r2) => {
    return statusIndex[r1.status] - statusIndex[r2.status]
}

export function RecieptList({reciepts}){
    
    return (
        <div className="reciept-list">
            {reciepts.sort(statusSortFunc).map(({title, club, date, state}, i) => {
                return <RecieptContainer 
                    title={title}
                    club={club}
                    date={date}
                    state={state}
                    key={i} 
                />;
            })}
        </div>
    )
}