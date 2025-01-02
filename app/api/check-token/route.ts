import { NextRequest, NextResponse, userAgent} from 'next/server';
import { PrismaClient} from "@prisma/client"
import { cookies } from 'next/headers'
import { cp } from 'fs';
const jwt = require('jsonwebtoken');


const requestIp = require('request-ip');
const bcrypt = require('bcrypt');


const prisma = new PrismaClient();

const verifyJWT = (token:any) => {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (payload.exp <= currentTimestamp) {
        return null;
      }
      return payload;
    } catch (error) {
      return null;
    }
};

export async function GET(request: Request) {
    try{
        const cookieStore = cookies()
        const token = cookieStore.get('token')?.value;
        if(verifyJWT(token) != null){
            var fetchData = await prisma.users.findMany({
                where:{
                    email: verifyJWT(token).email,
                    uuid: verifyJWT(token).uuid,
                    token: (String)(token ? token : ""),
                    is_verified: true
                }
            });

            var jsonUser = fetchData[0];

            if(Object.keys(fetchData).length == 0){
                return NextResponse.json({ message: "failed" }, { status: 400 });
            }
            else{
                return NextResponse.json({ message: jsonUser}, { status: 200 });
            }
        }
        else{
            return NextResponse.json({ message: "failed" }, { status: 400 });
        }
        
        
        
        
    }catch(error : any){
        return NextResponse.json({ message: error.message }, { status: 400 });
    }finally{
        prisma.$disconnect();
    }
}