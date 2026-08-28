import AddEditGroups from "./AddEditGroups"
const BASE_URL = process.env.REACT_APP_API_URL;

export default function EditDeliveryCrew(){
    return <AddEditGroups link={`${BASE_URL}/api/groups/delivery-crew/users`}  title='Delivery Crew'/>
}