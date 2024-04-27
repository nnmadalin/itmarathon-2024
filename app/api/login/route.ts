import { NextRequest, NextResponse, userAgent} from 'next/server';
import { PrismaClient} from "@prisma/client"
import { cookies } from 'next/headers'
import { cp } from 'fs';
const jwt = require('jsonwebtoken');


const requestIp = require('request-ip');
const bcrypt = require('bcrypt');


const prisma = new PrismaClient();

const generateJWT = (uuid:any, email:any, type:any, fname:any, lname:any) => {
    const payload = {
      uuid: uuid, 
      email: email,
      fname: fname,
      lname: lname,
      type: type,
      exp: Math.floor(Date.now() / 1000) + (90 * 60)
    };
  
    const token = jwt.sign(payload, process.env.JWT_SECRET);
  
    return token;
  };
  

function isSamePassword(unHashPass:string, hashPass:string){
    return bcrypt.compare(unHashPass, hashPass).then(function(result: boolean){
        return result;
    });
}

export async function POST(request: Request) {
    const body = await request.json();
    const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
    const userAgent = request.headers.get('User-Agent');

    try{
        if(body.email == undefined || body.password == undefined){
            return NextResponse.json({ message: "You must fill in all the boxes!" }, { status: 400 });
        }

        if(body.email.trim() == "" || body.password.trim() == ""){
            return NextResponse.json({ message: "You must fill in all the boxes!" }, { status: 400 });
        }

        const fetchData = await prisma.users.findMany({
            where:{
                email: body.email,
            }
        });

        if(Object.keys(fetchData).length == 0){
            return NextResponse.json({ message: "The email and/or password is wrong!" }, { status: 404 });
        }
        if(fetchData[0].is_verified == false){
            return NextResponse.json({ message: "You must verify your account!" }, { status: 406 });
        }
        if(await isSamePassword(body.password, fetchData[0].password) == false){
            return NextResponse.json({ message: "The email and/or password is wrong!" }, { status: 406 });
        }
        else{

            const fetchDataAuthUser = await prisma.authUser.findMany({
                where:{
                    uuidUser: fetchData[0]?.uuid,
                    ipTry:ip
                }
            });

            let countAuth = 0;
            let dateNow: Date = new Date();

            for (var i = 0; i < Object.keys(fetchDataAuthUser).length; i++) {
                let date: Date = new Date(fetchDataAuthUser[i].dateTry);
                if ((Math.floor(dateNow.getTime() - date.getTime()) / 60000) <= 10) {
                    countAuth++;
                }
            }


            if(countAuth >= 3){
                return NextResponse.json({ message: "You have created too many accounts! Wait 10 min!" }, { status: 401 });
            }

            var generateJWTvalue = generateJWT(fetchData[0]?.uuid, fetchData[0]?.email, fetchData[0].typeUser, fetchData[0].firstName, fetchData[0].lastName);

            const updateUser = await prisma.users.update({
                where:{
                    uuid: fetchData[0]?.uuid
                },
                data:{
                    lastLogin: new Date(),
                    lastIP: ip,
                    lastStatsDevice: userAgent ? userAgent : "",
                    token: generateJWTvalue
                }
            });

            cookies().set('token', generateJWTvalue);

            const  authUser = await prisma.authUser.create({
                data: {
                    dateTry: new Date(),
                    uuidUser: updateUser?.uuid,
                    ipTry: ip,
                    statsDevice: userAgent ? userAgent : ""
                }
            });

            const logs = await prisma.logs.create({
                data: {
                    date: new Date(),
                    actionUser: "LOGIN: Account successfully login with uuid: " + updateUser?.uuid + " ip: " + ip + " Device: " + userAgent + " Date: " + new Date().toLocaleDateString()
                }
            });

            return NextResponse.json({ message: "Authenticated successfully!" }, { status: 200 });
        }

        
    }catch(error : any){
        return NextResponse.json({ message: error.message }, { status: 400 });
    }finally{
        prisma.$disconnect();
    }
}