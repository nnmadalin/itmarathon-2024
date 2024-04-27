import { NextRequest, NextResponse, userAgent} from 'next/server';
import { PrismaClient} from "@prisma/client"
import { cp } from 'fs';
import { ObjectEnumValue } from '@prisma/client/runtime/library';
import { redirect } from 'next/navigation';


const requestIp = require('request-ip');
const bcrypt = require('bcrypt');


const prisma = new PrismaClient();


export async function GET(request: Request) {
    const uuid = new URL(request.url).searchParams.get("uuid");

    try{
        const fetchDataAuthUser = await prisma.users.findMany({
            where:{
                uuid: uuid ? uuid : "",
                is_verified: false
            }
        });

       if(Object.keys(fetchDataAuthUser).length != 0){

            const updateUser = await prisma.users.updateMany({
                where:{
                    uuid: uuid ? uuid : ""
                },
                data:{
                    is_verified: true
                }
            });

            return NextResponse.json({ message: "User verified!" }, { status: 200 });
        }
        else{
            return NextResponse.json({ message: "No user found!" }, { status: 404 });
        }

        
    }catch(error : any){
        return NextResponse.json({ message: error.message }, { status: 400 });
    }finally{
        prisma.$disconnect();
    }
}