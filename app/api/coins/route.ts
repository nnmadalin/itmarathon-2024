import { NextRequest, NextResponse, userAgent} from 'next/server';
import { PrismaClient} from "@prisma/client"
import { cp } from 'fs';
import { ObjectEnumValue } from '@prisma/client/runtime/library';
import { redirect } from 'next/navigation';


const requestIp = require('request-ip');
const bcrypt = require('bcrypt');


const prisma = new PrismaClient();


export async function GET(request: Request) {
    try{
        const fetchData:any = await prisma.coin.findMany({
            orderBy:{
                name:"asc"
            }
        });

        for(let i = 0; i < Object.keys(fetchData).length; i++){
            const fetchDataHistory = await prisma.historyCoin.findMany({
                where:{
                    name:fetchData[i].name
                }
            });

            const dataHistory:any= {
                labels: [],
                datasets: [
                    {
                        data:[]
                    }
                ]
            };

            const vector:any = [];

            for(let j = 0; j < Object.keys(fetchDataHistory).length; j++){
                var date =fetchDataHistory[j].data;
                dataHistory["labels"][j] = new Date(date ? date : "").toLocaleTimeString();
                vector[j] = Number(fetchDataHistory[j].value);
                
                
            }
            dataHistory["datasets"][0]["data"] = vector;
            fetchData[i]["dataHistory"] = dataHistory;
        }

        

        return NextResponse.json({ message: fetchData }, { status: 200 });

        
    }catch(error : any){
        return NextResponse.json({ message: error.message }, { status: 400 });
    }finally{
        prisma.$disconnect();
    }
}