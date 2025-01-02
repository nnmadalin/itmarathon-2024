"use client"

import { redirect } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Particles from "react-particles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";


export default function Login() {

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        await console.log(container);
    }, []);

    const [isLoadingLocal, setIsLoadingLocal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/check-token");
                if (!response.ok) {

                }
                else
                    window.location.href = '/dashboard';
            } catch (error) {

            }
        };

        fetchData();
    }, []);

    const handlerLogin = async() => {
        setIsLoadingLocal(true);
        const response = await fetch("/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        })

        if (!response.ok) {
            const msg =  (await response.json()).message;
            alert(msg);
            setIsLoadingLocal(false);
        }
        else{
            window.location.href = '/dashboard';
            setIsLoadingLocal(false);
        }
    }

    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setpassword(e.target.value);
    };
    

    return (
        <>
            <main className="w-full h-full flex items-center justify-center ">
                <div className="blurBackground p-10 rounded-[15px] flex items-center justify-center text-center flex-col gap-20 max-w-[500px] w-full">
                    <h1 className="text-[40px] tracking-widest font-bold text-white">Sign In</h1>

                    <div className="flex items-start justify-center gap-5 flex-col max-w-[500px] w-full">
                        <label className="text-white font-bold">E-mail</label>
                        <input type="email" className="text-black w-full p-1 rounded hover:scale-[1.03] transition-all" onChange={handleChangeEmail} />

                        <br />

                        <label className="text-white font-bold">Password</label>
                        <input type="password" className="text-black w-full p-1 rounded hover:scale-[1.03] transition-all" onChange={handleChangePassword}/>

                        <br /> <br />

                        <button className="w-full h-[50px] bg-[#586063] text-white font-bold rounded-xl hover:scale-[1.05] transition-all" onClick={handlerLogin}>Login</button>
                        <a className="w-full text-center text-white" href="/lost-password">Have you forgotten the password?</a>
                        
                        <br/>

                        <p className="w-full text-center text-white">Don't have an account? <b><a href="/sign-up">Create one!</a></b></p>

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
