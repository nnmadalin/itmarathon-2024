import { NextRequest, NextResponse, userAgent } from 'next/server';
import { PrismaClient } from "@prisma/client"
import { cp } from 'fs';


const requestIp = require('request-ip');
const bcrypt = require('bcrypt');

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: '###', key: '###' });

const prisma = new PrismaClient();

function hashPass(unHashPass: string) {
    return bcrypt.hash(unHashPass, 10).then(function (hash: string) {
        return hash;
    });
}


export async function POST(request: Request) {
    const body = await request.json();
    const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
    const userAgent = request.headers.get('User-Agent');


    try {
        if (body.fname == undefined || body.lname == undefined || body.email == undefined || body.password == undefined || body.repassword == undefined || body.safeword == undefined || body.gdpr == undefined) {
            return NextResponse.json({ message: "You must fill in all the boxes!" }, { status: 400 });
        }

        if (body.fname.trim() == "" || body.lname.trim() == "" || body.email.trim() == "" || body.password.trim() == "" || body.repassword.trim() == "" || body.safeword.trim() == "" ) {
            return NextResponse.json({ message: "You must fill in all the boxes!" }, { status: 400 });
        }

        if (body.gdpr == false) {
            return NextResponse.json({ message: "You must accept data processing!" }, { status: 400 });
        }

        const hasUpperCase = /[A-Z]/.test(body.password );
        const hasLowerCase = /[a-z]/.test(body.password );
        const hasDigit = /\d/.test(body.password ); 
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(body.password );

        const hasUpperCaseSafeWord = /[A-Z]/.test(body.safeword );
        const hasLowerCaseSafeWord = /[a-z]/.test(body.safeword );
        const hasDigitSafeWord = /\d/.test(body.safeword ); 
        const hasSpecialCharSafeWord = /[!@#$%^&*(),.?":{}|<>]/.test(body.safeword );

        if(hasUpperCase == false || hasLowerCase == false || hasDigit == false || hasSpecialChar == false){
            return NextResponse.json({ message: "The password must contain an uppercase letter, a lowercase letter, a number and a special sign!" }, { status: 400 });
        }

        if(hasUpperCaseSafeWord == false || hasLowerCaseSafeWord == false || hasDigitSafeWord == false || hasSpecialCharSafeWord == false){
            return NextResponse.json({ message: "The safe word must contain an uppercase letter, a lowercase letter, a number and a special sign!" }, { status: 400 });
        }

        if (body.password != body.repassword) {
            return NextResponse.json({ message: "The passwords do not match!" }, { status: 400 });
        }

        if ((body.password).length < 8) {
            return NextResponse.json({ message: "The password must have more than 8 characters!" }, { status: 400 });
        }

        if ((body.safeword).length < 8) {
            return NextResponse.json({ message: "The safe word must have more than 8 characters!" }, { status: 400 });
        }

        const fetchData = await prisma.users.findMany({
            where: {
                email: body.email,
            }
        });

        if (Object.keys(fetchData).length != 0) {
            return NextResponse.json({ message: "The email is already in use!" }, { status: 403 });
        }
        else {
            const fetchDataAuthUser = await prisma.signUpUser.findMany({
                where: {
                    ipTry: ip
                }
            });

            let countAuth = 0;
            let dateNow: Date = new Date();

            for (var i = 0; i < Object.keys(fetchDataAuthUser).length; i++) {
                let date: Date = new Date(fetchDataAuthUser[i].dateTry);
                console.log((Math.floor(dateNow.getTime() - date.getTime()) / 60000));
                if ((Math.floor(dateNow.getTime() - date.getTime()) / 60000) <= 10) {
                    countAuth++;
                }
            }

            if (countAuth >= 3) {
                return NextResponse.json({ message: "You have created too many accounts! Wait 10 min!" }, { status: 401 });
            }


            const createUser = await prisma.users.create({
                data: {
                    firstName: body.fname,
                    lastName: body.lname,
                    email: body.email,
                    password: await hashPass(body.password),
                    wordSafe: body.safeword,
                    firstLogin: new Date(),
                    lastLogin: new Date(),
                    lastIP: ip,
                    lastStatsDevice: userAgent ? userAgent : "",
                    coins: 0,
                    balance: 0,
                    typeUser: 0

                }
            });

            const signUpUser = await prisma.signUpUser.create({
                data: {
                    dateTry: new Date(),
                    ipTry: ip,
                    statsDevice: userAgent ? userAgent : ""
                }
            });

            const logs = await prisma.logs.create({
                data: {
                    date: new Date(),
                    actionUser: "SIGN-IN: Account successfully created with uuid: " + createUser.uuid + " ip: " + ip + " Device: " + userAgent + " Date: " + new Date().toLocaleDateString()
                }
            });

            mg.messages.create('sandboxbd7f0992cb0944c0916cbfcad4999658.mailgun.org', {
                from: "ITMarathon <mailgun@sandboxbd7f0992cb0944c0916cbfcad4999658.mailgun.org>",
                to: body.email,
                subject: "Account verification",
                text: "Click on the link below to verify your account!",
                html: "<h1>Click on the link below to verify your account!</h1> <br/> <br /> <a href='http://127.0.0.1:3000/api/verified-account?uuid=" + createUser.uuid + "'>CLICK HERE</a>"
            })
                .then((msg: any) => console.log(msg))
                .catch((err: any) => console.log(err));

            return NextResponse.json({ message: "Account created successfully! Check email for verification account!" }, { status: 200 });
        }


    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    } finally {
        prisma.$disconnect();
    }
}