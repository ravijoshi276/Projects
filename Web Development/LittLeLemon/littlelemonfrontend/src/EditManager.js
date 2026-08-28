import AddEditGroups from "./AddEditGroups";
const BASE_URL = process.env.REACT_APP_API_URL;

export default function EditManager({props}){
    return <AddEditGroups link={`${BASE_URL}/api/groups/manager/users`} title='Manager'/>
}
