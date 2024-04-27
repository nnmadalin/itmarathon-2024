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

export async function POST(request: Request) {
    try{
        const body = await request.json();

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


            if(Object.keys(fetchData).length == 0){
                return NextResponse.json({ message: "failed" }, { status: 400 });
            }
            else{
                if(body.coin == undefined || body.amount == undefined){
                    return NextResponse.json({ message: "INVALID" }, { status: 400 });
                }

                const coinUser:any = fetchData[0].coins;

                if(coinUser[body.coin] == undefined){
                    coinUser[body.coin] = body.amount;
                }
                else
                    coinUser[body.coin] += body.amount;

                

                var updatedate = await prisma.users.update({
                    where:{
                        email: verifyJWT(token).email,
                        uuid: verifyJWT(token).uuid,
                        token: (String)(token ? token : ""),
                        is_verified: true
                    },
                    data:{
                        coins: coinUser,
                        balance: body.amount >= 0 ? fetchData[0].balance - body.total : fetchData[0].balance + body.total
                    }
                });

                if(body.amount >= 0){
                    const logs = await prisma.logs.create({
                        data: {
                            date: new Date(),
                            actionUser: "COIN: BUY - UUID: " + verifyJWT(token).uuid +" bought coin: " + body.coin +" quantity: " + body.amount +" date:" + new Date()
                        }
                    });
                }
                else{
                    const logs = await prisma.logs.create({
                        data: {
                            date: new Date(),
                            actionUser: "COIN: SELL - UUID: " + verifyJWT(token).uuid +" bought coin: " + body.coin +" quantity: " + body.amount +" date:" + new Date()
                        }
                    });
                }

                return NextResponse.json({ message: "ok" }, { status: 200 });
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