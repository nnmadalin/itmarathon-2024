import { NextRequest, NextResponse, userAgent} from 'next/server';
import { PrismaClient} from "@prisma/client"
import { cookies } from 'next/headers'
import { cp } from 'fs';
const jwt = require('jsonwebtoken');


const requestIp = require('request-ip');
const bcrypt = require('bcrypt');


const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: '183a07bffb0d183734367b5cc427c842-2175ccc2-31335723' });

const prisma = new PrismaClient();

function isSamePassword(unHashPass:string, hashPass:string){
    return bcrypt.compare(unHashPass, hashPass).then(function(result: boolean){
        return result;
    });
}
function hashPass(unHashPass: string) {
    return bcrypt.hash(unHashPass, 10).then(function (hash: string) {
        return hash;
    });
}

export async function POST(request: Request) {
    const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];

    try{
        const body = await request.json();
        
        if(body.email == undefined || body.oldpassword == undefined || body.newpassword == undefined || body.oldsafeword == undefined || body.newsafeword == undefined){
            return NextResponse.json({ message: "You must fill in all the boxes!" }, { status: 400 });
        }

        if(body.email.trim() == "" || body.oldpassword.trim() == "" || body.newpassword.trim() == "" || body.oldsafeword.trim() == "" || body.newsafeword.trim() == ""){
            return NextResponse.json({ message: "You must fill in all the boxes!" }, { status: 400 });
        }

        const fetchData = await prisma.users.findMany({
            where:{
                email: body.email,
                wordSafe: body.oldsafeword,
            }
        });
        
        if(Object.keys(fetchData).length == 0){
            return NextResponse.json({ message: "The email and/or password and/or safe word is wrong!" }, { status: 404 });
        }
        if(fetchData[0].is_verified == false){
            return NextResponse.json({ message: "You must verify your account!" }, { status: 406 });
        }
        if(fetchData[0].wordSafe != body.oldsafeword){
            return NextResponse.json({ message: "The email and/or password and/or safe word is wrong!" }, { status: 406 });
        }
        if(await isSamePassword(body.oldpassword, fetchData[0].password) == 0){
            return NextResponse.json({ message: "The email and/or password and/or safe word is wrong!" }, { status: 406 });
        }
        if(await isSamePassword(body.newpassword, fetchData[0].password) == 0){
            return NextResponse.json({ message: "The password must be different!" }, { status: 406 });
        }
        if(fetchData[0].wordSafe == body.newsafeword){
            return NextResponse.json({ message: "The safe word must be different!" }, { status: 406 });
        }

        const hasUpperCase = /[A-Z]/.test(body.newpassword );
        const hasLowerCase = /[a-z]/.test(body.newpassword );
        const hasDigit = /\d/.test(body.newpassword ); 
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(body.newpassword );

        const hasUpperCaseSafeWord = /[A-Z]/.test(body.newsafeword );
        const hasLowerCaseSafeWord = /[a-z]/.test(body.newsafeword );
        const hasDigitSafeWord = /\d/.test(body.newsafeword ); 
        const hasSpecialCharSafeWord = /[!@#$%^&*(),.?":{}|<>]/.test(body.newsafeword );

        if(!(hasUpperCase == true && hasLowerCase == true && hasDigit == true && hasSpecialChar == true)){
            return NextResponse.json({ message: "The password must contain an uppercase letter, a lowercase letter, a number and a special sign!" }, { status: 400 });
        }

        if(!(hasUpperCaseSafeWord == true && hasLowerCaseSafeWord == true && hasDigitSafeWord == true && hasSpecialCharSafeWord == true)){
            return NextResponse.json({ message: "The safe word must contain an uppercase letter, a lowercase letter, a number and a special sign!" }, { status: 400 });
        }
        else{
            const updateUser = await prisma.users.update({
                where:{
                    uuid: fetchData[0].uuid,
                    email: fetchData[0].email,
                    wordSafe: fetchData[0].wordSafe
                },
                data: {
                    password: await hashPass(body.newpassword),
                    wordSafe: body.newsafeword,
                    is_verified: false
                }
            });

            const logs = await prisma.logs.create({
                data: {
                    date: new Date(),
                    actionUser: "RECOVER: I reset the password for uuid: " + updateUser?.uuid + " ip: " + ip + " Device: " + userAgent + " Date: " + new Date().toLocaleDateString()
                }
            });


            mg.messages.create('sandboxbd7f0992cb0944c0916cbfcad4999658.mailgun.org', {
                from: "ITMarathon <mailgun@sandboxbd7f0992cb0944c0916cbfcad4999658.mailgun.org>",
                to: body.email,
                subject: "Account verification",
                text: "Click on the link below to verify your account!",
                html: "<h1>Click on the link below to verify your account!</h1> <br/> <br /> <a href='http://127.0.0.1:3000/api/verified-account?uuid=" + fetchData[0].uuid + "'>CLICK HERE</a>"
            })
                .then((msg: any) => console.log(msg))
                .catch((err: any) => console.log(err));

            return NextResponse.json({ message: "Password and safe word change successfully! Check email for verification account!" }, { status: 200 });
        }
        
        
    }catch(error : any){
        return NextResponse.json({ message: error.message }, { status: 400 });
    }finally{
        prisma.$disconnect();
    }
}