export default function CreditCardLabelInput({label, type, flex1, refP}){

    return (
        <div className={`${flex1 && 'flex-1'}`}>
             <label className="text-neutral-800 font-bold text-sm mb-2 block">{label.toUpperCase()}:</label>
                <input ref={refP} type={type}  className={`flex h-10 w-full 
                            rounded-md border-2 
                            px-4 py-1.5 text-lg 
                            ring-offset-background 
                            focus-visible:outline-none focus-visible:border-purple-600 focus-visible:ring-ring focus-visible:ring-offset-2 
                            disabled:cursor-not-allowed disabled:opacity-50`} />
        </div>
    )
}