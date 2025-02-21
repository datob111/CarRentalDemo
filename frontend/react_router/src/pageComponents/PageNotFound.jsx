import { Link } from "react-router-dom"

export default function PageNotFound(){
    return <div className="flex flex-col align-middle text-center gap-2 mx-auto my-72 w-fit ">
        <h1 className="text-4xl text-slate-600 font-bold">Page Not Found</h1>
        <Link className="text-xl text-gray-600" to='/'>Go Back To Home Page</Link>
    </div>
}