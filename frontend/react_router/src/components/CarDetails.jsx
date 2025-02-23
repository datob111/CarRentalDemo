export default function CarDetails({car}){
    return <>
        {car && (
            <div className="flex flex-col justify-start gap-2 font-sans font-extrabold w-4/6">
                <p className="text-gray-700"><span className="text-gray-950">NAME:</span> {car.name}</p>
                <p className="text-gray-700"><span className="text-gray-950">BRAND:</span> {car.brand}</p>
                <p className="text-gray-700"><span className="text-gray-950">DESCRIPTION:</span> {car.description}</p>
                <p className="text-gray-700"><span className="text-gray-950">Year:</span> {car.release_year}</p>
                <p className="text-gray-700"><span className="text-gray-950">Price:</span> {car.price}</p>
            </div>
        )}
    </>
}