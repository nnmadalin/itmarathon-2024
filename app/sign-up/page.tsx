"use client"

import { useState, useCallback } from "react";
import Particles from "react-particles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";



export default function SignUp() {

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        await console.log(container);
    }, []);

    const [isLoadingLocal, setIsLoadingLocal] = useState(false);

    const handlerSaveForm = async () => {
        setIsLoadingLocal(true);
        const response = await fetch("/api/sign-up", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fname: fname,
                lname: lname,
                email: email,
                password: password,
                repassword: repassword,
                safeword: safeword,
                gdpr: isChecked
            }),
        })
        if (!response.ok) {
            const msg = (await response.json()).message;
            alert(msg);
        }
        else {
            const msg = (await response.json()).message;
            alert(msg);
            window.location.href = '/login';

        }



    }

    const [fname, setfname] = useState("");
    const [lname, setlname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [repassword, setrepassword] = useState("");
    const [safeword, setsafeword] = useState("");
    const [isChecked, setIsChecked] = useState<boolean>(false);


    const handleChangeFname = (e: React.ChangeEvent<HTMLInputElement>) => {
        setfname(e.target.value);
    };

    const handleChangeLname = (e: React.ChangeEvent<HTMLInputElement>) => {
        setlname(e.target.value);
    };

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setpassword(e.target.value);
    };

    const handleChangeRepassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setrepassword(e.target.value);
    };
    const handleChangeSafeWord = (e: React.ChangeEvent<HTMLInputElement>) => {
        setsafeword(e.target.value);
    };

    const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
    };




    return (
        <>
            <main className="w-full h-full flex items-center justify-center ">
                <div className="blurBackground p-10 rounded-[15px] flex items-center justify-center text-center flex-col gap-20 max-w-[500px] w-full">
                    <h1 className="text-[40px] tracking-widest font-bold text-white">Sign Up</h1>

                    <div className="flex items-start justify-center gap-5 flex-col max-w-[500px] w-full">

                        <div className="flex gap-5 items-start justify-start text-left">
                            <div className="">
                                <label className="text-white font-bold">First Name</label>
                                <input type="fname" className="text-black w-full p-1 rounded hover:scale-[1.03] transition-all" onChange={handleChangeFname} required />
                            </div>

                            <div className="">
                                <label className="text-white font-bold">Last Name</label>
                                <input type="lname" className="text-black w-full p-1 rounded hover:scale-[1.03] transition-all" onChange={handleChangeLname} required />
                            </div>
                        </div>


                        <label className="text-white font-bold">E-mail</label>
                        <input type="email" className="text-black w-full p-1 rounded hover:scale-[1.03] transition-all" onChange={handleChangeEmail} pattern="[^@\s]+@[^@\s]+\.[^@\s]+" title="Invalid email address" required />


                        <label className="text-white font-bold">Password</label>
                        <input type="password" className="text-black w-full p-1 rounded hover:scale-[1.03] transition-all" onChange={handleChangePassword} required />

                        <label className="text-white font-bold">Confirm Password</label>
                        <input type="password" className="text-black w-full p-1 rounded hover:scale-[1.03] transition-all" onChange={handleChangeRepassword} required />

                        <label className="text-white font-bold">Safe Word</label>
                        <input type="password" className="text-black w-full p-1 rounded hover:scale-[1.03] transition-all" onChange={handleChangeSafeWord} required />

                        <div className="flex items-center justify-start gap-5 text-left">
                            <input type="checkbox" onChange={handleChangeCheckbox} />
                            <label className="text-white font-bold">Do you agree with the processing of personal data?</label>
                        </div>
                        <br /> <br />

                        <button className="w-full h-[50px] bg-[#586063] text-white font-bold rounded-xl hover:scale-[1.05] transition-all" onClick={handlerSaveForm}>Sign Up</button>

                        <p className="w-full text-center text-white">Already have an account? <b><a href="/login">Sign In!</a></b></p>

                    </div>
                </div>


                <Particles
                    className="absolute top-0 left-0 w-full h-full z-[-1]"
                    id="tsparticles"
                    init={particlesInit}
                    loaded={particlesLoaded}
                    options={{

                        fpsLimit: 120,
                        particles: {
                            color: {
                                value: "#ffffff",
                            },
                            links: {
                                color: "#ffffff",
                                distance: 150,
                                enable: true,
                                opacity: 0.5,
                                width: 1,
                            },
                            move: {
                                direction: "none",
                                enable: true,
                                outModes: {
                                    default: "bounce",
                                },
                                random: false,
                                speed: 2,
                                straight: false,
                            },
                            number: {
                                density: {
                                    enable: true,
                                    area: 800,
                                },
                                value: 80,
                            },
                            opacity: {
                                value: 0.5,
                            },
                            shape: {
                                type: "circle",
                            },
                            size: {
                                value: { min: 1, max: 5 },
                            },
                        },
                        detectRetina: true,
                    }}
                />
            </main>
        </>
    );
}
