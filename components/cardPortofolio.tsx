"use client"


export default function cardPortofolio({name, cantitate}: {name:any, cantitate:any}) {

    
    
    return (
        <>
        
            <div className="max-w-[500px] min-w-[400px] min-h-[150px] w-full p-5 rounded-md border-[#fffff] border-2 flex gap-2">
                <div className="flex flex-col justify-center flex-1">
                    <h1 className="text-[40px] tracking-widest font-bold text-[rgb(67,67,67)]">{name}</h1>
                </div>

                <div className="flex-0 flex items-center justify-center flex-col">
                    {
                        <>
                            <h3 className="text-[20px] tracking-widest font-bold text-[gb(111,111,111)]">Cantitate</h3>
                            <h1 className="text-[30px] tracking-widest font-bold text-[rgb(111,111,111)]">{cantitate}</h1>
                        </>
                    }
                    
                </div>
            </div>

        </>
    )
}