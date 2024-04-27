"use client"

import { useState, useCallback } from "react";
import Particles from "react-particles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";


export default function LostPassword() {

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        await console.log(container);
    }, []);

    const [isLoadingLocal, setIsLoadingLocal] = useState(false);

    const handlerRecover = () => {
        setIsLoadingLocal(true);
        fetch("/api/recover-password", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                oldpassword: oldpassword,
                newpassword: newpassword,
                oldsafeword: oldsafeword,
                newsafeword: newsafeword,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Datele au fost salvate cu succes!');
                alert("Datele au fost salvate cu succes!")
                //window.location.reload();
                setIsLoadingLocal(false);
            })
            .catch(error => {
                console.error('Eroare la salvarea datelor:', error);
                alert("Eroare: probleme la salvarea datelor! - " + error)
                setIsLoadingLocal(false);
            });
    }

    const [email, setEmail] = useState("");
    const [oldpassword, setoldpassword] = useState("");
    const [newpassword, setnewpassword] = useState("");
    const [oldsafeword, setoldsafeword] = useState("");
    const [newsafeword, setnewsafeword] = useState("");

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleChangeOldPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setoldpassword(e.target.value);
    };

    const handleChangeNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setnewpassword(e.target.value);
    };

    const handleChangeOldSafeWord = (e: React.ChangeEvent<HTMLInputElement>) => {
        setoldsafeword(e.target.value);
    };

    const handleChangeNewSafeWord = (e: React.ChangeEvent<HTMLInputElement>) => {
        setnewsafeword(e.target.value);
    };
    


    return (
        <>
            <main className="w-full h-full flex items-center justify-center ">
                <div className="blurBackground p-10 rounded-[15px] flex items-center justify-center text-center flex-col gap-20 max-w-[500px] w-full">
                    <h1 className="text-[40px] tracking-widest font-bold text-white">Lost Password</h1>

                    <div className="flex items-start justify-center gap-5 flex-col max-w-[500px] w-full">
                        <label className="text-white font-bold">E-mail</label>
                        <input type="email" className="text-black w-full p-1 rounded hover:scale-[1.03] transition-all" onChange={handleChangeEmail} />

                        <label className="text-white font-bold">OLD Password</label>
                        <input type="password" className="text-black w-full p-1 rounded hover:scale-[1.03] transition-all" onChange={handleChangeOldPassword}/>

                        <label className="text-white font-bold">NEW Password</label>
                        <input type="password" className="text-black w-full p-1 rounded hover:scale-[1.03] transition-all" onChange={handleChangeNewPassword}/>

                        <label className="text-white font-bold">OLD Safe Word</label>
                        <input type="password" className="text-black w-full p-1 rounded hover:scale-[1.03] transition-all" onChange={handleChangeOldSafeWord}/>

                        <label className="text-white font-bold">NEW Safe Word</label>
                        <input type="password" className="text-black w-full p-1 rounded hover:scale-[1.03] transition-all" onChange={handleChangeNewSafeWord}/>

                        <br /> <br />

                        <button className="w-full h-[50px] bg-[#586063] text-white font-bold rounded-xl hover:scale-[1.05] transition-all" onClick={handlerRecover}>Recover password</button>
                        
                        <br/>

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
