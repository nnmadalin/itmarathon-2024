"use client"

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler} from "chart.js"
import { plugin } from "postcss"
import { Bar, Line, Scatter, Bubble } from "react-chartjs-2"
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
)

export default function card({name, price, value, direction, data}: {name:any, price:any, value:any, direction:any, data:any}) {

    const option = {
        plugins:{
            legend:{
                display:false,
            }
        },
        elements:{
            line:{
                tension: 0,
                borderWidth: 2,
                borderColor: "rgba(47, 97, 68, 1)",
                fill: "start",
                backgroundColor: "rgba(47, 97, 68, 0.3)"
            },
            point:{
                radius:2,
                hitRadius: 0,
            }
        },
        scales:{
            xAxes: {
                display:false
            }
        }
    }
    
    return (
        <>
        
            <div className="max-w-[500px] min-w-[400px] min-h-[150px] w-full p-5 rounded-md border-[#fffff] border-2 flex gap-2">
                <div className="flex flex-col justify-between flex-1">
                    <h2 className="text-[20px] tracking-widest font-bold text-[rgb(154,154,154)]">{name}</h2>
                    <h1 className="text-[30px] tracking-widest font-bold text-[rgb(67,67,67)]">{price.toFixed(2)} RON</h1>
                    <h2 className={"text-[18px] tracking-widest font-bold " + (direction == "top" ? "text-[rgb(136,179,107)]" : "text-[rgb(202,113,113)]" ) }>{value.toFixed(2)}%</h2>
                </div>

                <div className="flex-0">
                    {
                        data && (
                            <Line data={data} width={230} height={170} options={option}/>
                        )
                    }
                    
                </div>
            </div>

        </>
    )
}