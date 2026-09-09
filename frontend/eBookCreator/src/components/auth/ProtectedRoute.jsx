//import React from 'react'
import {useLocation,Navigate} from 'react-router-dom'
const ProtectedRoute = ({children}) => {
 const isAuthenticated = true;
 const loading=false;
 const location=useLocation();

 if(loading){
    // Loaidng spinner
    return(
        <div>
            Loading....
        </div>
    )
 }

 if(!isAuthenticated){
    return <Navigate to='/login' state={{from:location}} replace />
 }
 return children;
}

export default ProtectedRoute
