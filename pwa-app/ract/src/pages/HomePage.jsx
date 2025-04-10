import { useNavigate } from "react-router-dom"

export default function HomePage(){
    const navigat = useNavigate()
    return(
        <>
        <h1> This is an Home Page</h1>
        <button onClick={ ()=> navigat('/pdf')}> Navigate to other page</button>
        </>
    )
} 