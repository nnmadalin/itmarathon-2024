"use client"

import { redirect } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Cookie from "js-cookie"

import CardPortofolio from "@/components/cardPortofolio";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "@/components/PaymentForm/PaymentForm";
import PaymentFormSend from "@/components/PaymentForm/PaymentFormGive";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);


export default function Dashboard() {

    const [isauth, setisauth] = useState(false);
    const [dataUser, setDataUser] = useState<any>("");
    const [isLoadingLocal, setIsLoadingLocal] = useState(true);
    const [fetchCoin, setFetchCoin] = useState<any>("");
    const [fetchCoinUser, setFetchCoinUser] = useState<any>("");

    const [coin, setCoin] = useState("");
    const [total, setTotal] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [amount, setAmount] = useState(0);

    const [coinUser, setCoinUser] = useState("");
    const [totalUser, setTotalUser] = useState(0);
    const [amountUser, setAmountUser] = useState(0);

    useEffect(() => {
        const handleContextmenu = (e: any) => {
            e.preventDefault()
        }
        document.addEventListener('contextmenu', handleContextmenu)
        return function cleanup() {
            document.removeEventListener('contextmenu', handleContextmenu)
        }
    }, [])

    useEffect(() => {
        var jsontemp = "";
        const fetchData = async () => {
            try {
                const response = await fetch("/api/check-token");
                if (!response.ok) {
                    window.location.href = '/login';
                }
                else {
                    const fetchUserData = (await response.json()).message;
                    setDataUser(fetchUserData);

                    setFetchCoinUser(fetchUserData.coins);


                    jsontemp = fetchUserData.coins;
                    var ok = "";
                    fetchUserData.coins && Object.keys(fetchUserData.coins).map((crypto, index) => {
                        if (ok == "" && fetchUserData.coins[crypto] != 0) {
                            ok = crypto
                        }
                    })

                    setCoinUser(ok);

                    setisauth(true);
                    setIsLoadingLocal(false);
                }
            } catch (error) {

            }
        };

        const fetchCoin = async () => {
            try {
                const response = await fetch("/api/coins");

                const fetchDataConst = (await response.json()).message;

                var totalT = 0;

                jsontemp && Object.keys(jsontemp).map((crypto: any, index) => {
                    for (let i = 0; i < Object.keys(fetchDataConst).length; i++) {
                        if (crypto == fetchDataConst[i].name) {
                            totalT += (Number(jsontemp[crypto]) * Number(fetchDataConst[i].value))
                        }
                    }
                })

                setTotalProfit(totalT);

                setFetchCoin(fetchDataConst);
                setCoin(fetchDataConst[0].name);

            } catch (error) {

            }
        };

        fetchData();
        fetchCoin();
    }, []);

    function handleLogout() {
        Cookie.set("token", "");
        window.location.href = '/login';
    }

    const handleCoin = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCoin(e.target.value);

        for (let i = 0; i < Object.keys(fetchCoin).length; i++) {
            if (fetchCoin[i].name == e.target.value) {
                let x = Number(fetchCoin[i]?.value);
                x = x * amount;

                setTotal(x);
            }
        }


    };

    const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(e.target.value));

        for (let i = 0; i < Object.keys(fetchCoin).length; i++) {
            if (fetchCoin[i].name == coin) {
                let x = Number(fetchCoin[i]?.value);
                x = x * Number(e.target.value);

                setTotal(x);
            }
        }

    };

    const handleCoinUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCoinUser(e.target.value);

        for (let i = 0; i < Object.keys(fetchCoin).length; i++) {
            if (fetchCoin[i].name == e.target.value) {
                let x = Number(fetchCoin[i]?.value);
                x = x * amountUser;

                setTotalUser(x);
            }
        }


    };

    const handleAmountUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmountUser(Number(e.target.value));

        for (let i = 0; i < Object.keys(fetchCoin).length; i++) {
            if (fetchCoin[i].name == coinUser) {
                let x = Number(fetchCoin[i]?.value);
                x = (x * Number(e.target.value));

                setTotalUser(x);
            }
        }

    };

    function handleBuy() {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/check-token");
                if (!response.ok) {
                    window.location.href = '/login';
                }
                else {
                    const json = (await response.json()).message;


                    if (Number(json.balance) < total) {
                        alert("You don't have enough money!");
                    }
                    else if (total != 0) {

                        fetch("/api/buy-coin", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                coin: coin,
                                amount: amount,
                                total: total
                            }),
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                window.location.reload();
                            })
                            .then(data => {
                                window.location.reload();
                            })
                            .catch(error => {
                                alert(error)
                                window.location.reload();
                            });


                    }
                }
            } catch (error) {

            }
        };

        fetchData();
    }

    function handlerSell() {
        const fetchData = async () => {

            var ok = 0;
            fetchCoinUser && Object.keys(fetchCoinUser).map((crypto, index) => {
                if (crypto == coinUser) {
                    ok = fetchCoinUser[crypto]
                }
            })


            if (amountUser > ok && ok != 0) {
                alert("You don't have enough coin!");
            }
            else if (totalUser != 0) {

                fetch("/api/buy-coin", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        coin: coinUser,
                        amount: -amountUser,
                        total: totalUser
                    }),
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        window.location.reload();
                    })
                    .then(data => {
                        window.location.reload();
                    })
                    .catch(error => {
                        alert(error)
                        window.location.reload();
                    });


            }

        };

        fetchData();
    }


    useEffect(() => {
        const interval = setInterval(() => {
            const fetchCoin = async () => {
                try {
                    const response = await fetch("/api/coins");

                    const fetchDataConst = (await response.json()).message;
                    setFetchCoin(fetchDataConst);
                } catch (error) {

                }
            };

            fetchCoin();
        }, 60000);

        return () => clearInterval(interval);
    }, []);


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
                                        <a href='/logs/' className="w-full h-[50px] bg-slate-500 text-white font-bold hover:scale-[1.05] transition-all flex items-center justify-center">Logs</a>
                                    </>
                                )
                            }
                        </div>
                    </nav>

                    <div className="w-full h-full rounded-2xl bg-[#ffffff] flex flex-col p-10 gap-10 overflow-x-auto">
                        <div className="w-full">
                            <h1 className="font-bold text-[25px] tracking-widest">Coins purchased by you!</h1>
                        </div>

                        <div className="w-full h-[1px] bg-slate-600" />


                        <div className="w-full flex items-center justify-center flex-wrap gap-10">
                            <div className="max-w-[500px] min-w-[400px] min-h-[150px] w-full p-5 rounded-md border-[#fffff] border-4 flex gap-2 items-center justify-center">
                                <div className="flex flex-col justify-between flex-1 ">
                                    <img src="/money.png" className="w-[170px] h-[150px]" />
                                </div>

                                <div className="flex-0">
                                    <h1 className="text-[25px]  font-bold text-[rgb(154,154,154)]">Balance</h1>
                                    <h1 className="text-[33px]  font-bold text-[rgb(67,67,67)]">{dataUser.balance} RON</h1>
                                </div>
                            </div>

                            <div className="max-w-[500px] min-w-[400px] min-h-[150px] w-full p-5 rounded-md border-[#fffff] border-4 flex gap-2 items-center justify-center">
                                <div className="flex flex-col justify-between flex-1 ">
                                    <img src="/profit.png" className="w-[160px] h-[150px]" />
                                </div>

                                <div className="flex-0">
                                    <h1 className="text-[25px]  font-bold text-[rgb(154,154,154)]">Total Profit</h1>
                                    <h1 className="text-[33px]  font-bold text-[rgb(67,67,67)]">{totalProfit.toFixed(2)} RON</h1>
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            <h1>Add money!</h1>
                            <br />
                            <div className="w-full max-w-[300px] text-[15px]">
                                <Elements stripe={stripePromise}>
                                    <PaymentForm />
                                </Elements>
                            </div>
                        </div>

                        <div className="w-full">
                            <h1>Send money!</h1>
                            <br />
                            <div className="w-full max-w-[300px] text-[15px]">
                                <Elements stripe={stripePromise}>
                                    <PaymentFormSend />
                                </Elements>
                            </div>
                        </div>

                        <br />
                        <br />

                        <div className="w-full flex items-center justify-center flex-wrap gap-10">
                            <h1 className="font-bold text-[20px] text-left w-full">Buy coins!</h1>

                            <div className="w-full flex flex-wrap items-center justify-start gap-10">
                                <div className="flex flex-col max-w-[450px] w-full">
                                    <label>Name</label>
                                    <select className="p-5 max-w-[450px] w-full bg-slate-500 text-white" onChange={handleCoin}>
                                        {
                                            fetchCoin && fetchCoin.map((item: any, key: any) => (
                                                <option value={item.name}>{item.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="flex flex-col max-w-[100px] w-full">
                                    <label>Amount</label>
                                    <input type="number" pattern="\d*" className="p-4 max-w-[100px] w-full bg-slate-500 text-white" defaultValue="0" min="0" max="100" onChange={handleAmount} required />
                                </div>

                                <div className="flex flex-col max-w-[200px] w-full">
                                    <label>Total</label>
                                    <input type="number" pattern="\d*" className="p-4 max-w-[200px] w-full bg-slate-500 text-white" defaultValue="0" value={total} readOnly />
                                </div>

                                <div className="flex flex-col max-w-[200px] w-full">
                                    <label className="mb-[20px]"></label>
                                    <button className="p-4 max-w-[200px] bg-lime-700 font-bold hover:scale-[1.05] transition-all text-white" onClick={handleBuy}>Buy</button>
                                </div>
                            </div>
                        </div>

                        <br />

                        <div className="w-full flex items-center justify-center flex-wrap gap-10">
                            <h1 className="font-bold text-[20px] text-left w-full">Sell coins!</h1>

                            <div className="w-full flex flex-wrap items-center justify-start gap-10">
                                <div className="flex flex-col max-w-[450px] w-full">
                                    <label>Name</label>
                                    <select className="p-5 max-w-[450px] w-full bg-slate-500 text-white" onChange={handleCoinUser}>
                                        {
                                            fetchCoinUser && Object.keys(fetchCoinUser).map((crypto, index) => (
                                                fetchCoinUser[crypto] != 0 && (
                                                    <option value={crypto}>{crypto}</option>
                                                )
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="flex flex-col max-w-[100px] w-full">
                                    <label>Amount</label>
                                    <input type="number" pattern="\d*" className="p-4 max-w-[100px] w-full bg-slate-500 text-white" defaultValue="0" min="0" max="100" onChange={handleAmountUser} required />
                                </div>

                                <div className="flex flex-col max-w-[200px] w-full">
                                    <label>Total</label>
                                    <input type="number" pattern="\d*" className="p-4 max-w-[200px] w-full bg-slate-500 text-white" defaultValue="0" value={totalUser} readOnly />
                                </div>

                                <div className="flex flex-col max-w-[200px] w-full">
                                    <label className="mb-[20px]"></label>
                                    <button className="p-4 max-w-[200px] bg-lime-700 font-bold hover:scale-[1.05] transition-all text-white" onClick={handlerSell}>Sell</button>
                                </div>
                            </div>
                        </div>


                        <div className="w-full flex items-center justify-center flex-wrap gap-10">
                            {
                                fetchCoinUser && Object.keys(fetchCoinUser).map((crypto, index) => (
                                    fetchCoinUser[crypto] != 0 && (
                                        <CardPortofolio name={crypto} cantitate={fetchCoinUser[crypto]} />
                                    )
                                ))
                            }
                        </div>

                    </div>

                </main>
            </>
        );
    }
}
