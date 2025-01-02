"use client"

import { redirect } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Cookie from "js-cookie"
import CardCrypto from "@/components/card";

export default function Dashboard() {

    const [isauth, setisauth] = useState(false);
    const [dataUser, setDataUser] = useState<any>("");
    const [fetchLogs, setFetchLogs] = useState<any>("");
    const [isLoadingLocal, setIsLoadingLocal] = useState(true);

    const [orderType, setOderType] = useState(1);

    useEffect(() => {
        const handleContextmenu = (e:any) => {
            e.preventDefault()
        }
        document.addEventListener('contextmenu', handleContextmenu)
        return function cleanup() {
            document.removeEventListener('contextmenu', handleContextmenu)
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/check-token");
                if (!response.ok ) {
                    window.location.href = '/login';
                }
                else {
                    const user = (await response.json()).message;
                    if(user.typeUser != 1){
                        window.location.href = '/dashboard';
                    }

                    setDataUser(user);
                    setisauth(true);
                    setIsLoadingLocal(false);
                }
            } catch (error) {

            }
        };

        const fetchLogs = async () => {
            try {
                const response = await fetch("/api/logs");

                const fetchDataConst = (await response.json()).message;
                setFetchLogs(fetchDataConst);
            } catch (error) {

            }
        };

        fetchData();
        fetchLogs();
    }, []);

    function handleLogout() {
        Cookie.set("token", "");
        window.location.href = '/login';
    }


    if (isLoadingLocal == false && isauth == false)
        redirect('/login');
    if (isauth == false) {
        return (
            <>
                <main className="w-full h-full flex items-center justify-center ">
                    <h1 className="text-white text-[30px]">Loading...</h1>
                </main>
            </>
        );
    }
    else {
        return (
            <>
                <main className="w-full h-full flex items-start justify-start p-10 gap-5">

                    <nav className="w-[260px] h-full bg-[#dadada] rounded-2xl overflow-hidden flex flex-col-reverse justify-between gap-5 min-w-[260px]">
                        <div className="w-full h-[100px] bg-slate-500 p-5 flex items-center justify-center flex-wrap text-wrap flex-col">
                            <p className="text-[20px]">Hello, <b>{dataUser?.firstName + " " + dataUser?.lastName}</b></p>
                            <button onClick={handleLogout}>Logout</button>
                        </div>

                        <div className="w-full flex items-center flex-col gap-10">
                            <a href="/dashboard" className="w-full h-[100px] bg-slate-600 text-white font-bold hover:scale-[1.05] transition-all flex items-center justify-center">Dashboard</a>
                            <a href='/portofolio' className="w-full h-[50px] bg-slate-600 text-white font-bold hover:scale-[1.05] transition-all flex items-center justify-center">Portofolio</a>

                            {
                                dataUser?.typeUser == 1 && (
                                    <>
                                        <br />
                                        <br />
                                        <a href='/users'className="w-full h-[50px] bg-slate-500 text-white font-bold hover:scale-[1.05] transition-all flex items-center justify-center">User Administration</a>
                                        <a href='/logs'className="w-full h-[50px] bg-slate-500 text-white font-bold hover:scale-[1.05] transition-all flex items-center justify-center">Logs</a>
                                    </>
                                )
                            }
                        </div>
                    </nav>

                    <div className="w-full h-full rounded-2xl bg-[#ffffff] flex flex-col p-10 gap-10 overflow-x-auto">
                        <div className="w-full">
                            <h1 className="font-bold text-[25px] tracking-widest">User Administration!</h1>
                        </div>

                        <div className="w-full h-[1px] bg-slate-600" />


                        

                    </div>

                </main>
            </>
        );
    }
}
