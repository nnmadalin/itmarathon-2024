import { NextRequest, NextResponse, userAgent} from 'next/server';

import { PrismaClient} from "@prisma/client"
const jwt = require('jsonwebtoken');
import { cookies } from 'next/headers'

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

export async function POST(request: Request) {

    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;


    var getUser = await prisma.users.findMany({
        where:{
            email: verifyJWT(token).email,
            uuid: verifyJWT(token).uuid,
        },
    })
      var updatedate = await prisma.users.update({
        where:{
            email: verifyJWT(token).email,
            uuid: verifyJWT(token).uuid,
        },
        data:{
            balance: getUser[0].balance + 500
        }
    });
    
    const logs = await prisma.logs.create({
        data: {
            date: new Date(),
            actionUser: "USER: ADD MONEY - UUID: " + verifyJWT(token).uuid +" money: 500 date:" + new Date()
        }
    });
    

    return NextResponse.json({ message: "OK" }, { status: 200 });
}

