"use client";

import { useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React from "react";

var ok = false;


export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch("/api/check-token");
            if (!response.ok) {
                window.location.href = '/login';
            }
            else {
                const fetch = (await response.json()).message;
                
                if(fetch.balance >= 500){
                  ok = true;
                }
            }
        } catch (error) {
  
        }
    };
  
    fetchData();
  }, []);
  
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(ok == false){
      alert("You don't have enough money!")
    }
    else{

      const cardElement = elements?.getElement("card");

      try {
        if (!stripe || !cardElement) return null;
        const { data } = await axios.post("/api/create-payment-intent", {
          data: { amount: 500 },
        });
        const clientSecret = data;

        await stripe?.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

        await axios.post("/api/send-money",{});

        window.location.href = "/portofolio";

      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <CardElement />
      <button type="submit">Submit</button>
    </form>
  );
}