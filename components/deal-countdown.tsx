"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

//  Static target date (replace with disired date)
const TARGET_DATE = new Date(2025, 11, 31);

//Function to calculate the time remaining
const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference - days * 1000 * 60 * 60 * 24) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (timeDifference - days * 1000 * 60 * 60 * 24 - hours * (1000 * 60 * 60)) /
      (1000 * 60)
  );

  const seconds = Math.floor(
    (timeDifference -
      days * 1000 * 60 * 60 * 24 -
      hours * (1000 * 60 * 60) -
      minutes * (1000 * 60)) /
      1000
  );
  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export default function DealCountdown() {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();
  useEffect(function () {
    //Calculute initial time on client
    setTime(calculateTimeRemaining(TARGET_DATE));
    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(TARGET_DATE);
      setTime(newTime);
      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      )
        clearInterval(timerInterval);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);
  if (!time) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h2 className="text-3xl font-bold">Loading Countdown...</h2>
        </div>
      </section>
    );
  }
  if (
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0
  ) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20 ">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Deal Has Ended</h3>
          <p>
            The deal is no longer available. Check out our latest promotions
          </p>

          <div className="text-center">
            <Button className="text-center" asChild>
              <Link href="/search">View Products</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/promo.jpg"
            alt="promotion"
            width={300}
            height={200}
          />
        </div>
      </section>
    );
  }
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20 ">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-3xl font-bold">Deal Of The Month</h3>
        <p>
          Get ready for a shopping experience like never before with our Deals
          of the Month! Every purchase with exclusive perks and offers, making
          this month a celevration of savvy choices and amazing deals.
          Don&apos;t miss out
        </p>
        <ul className="grid grid-cols-4">
          <StatBox label="Days" value={time.days} />
          <StatBox label="Hours" value={time.hours} />
          <StatBox label="Minutes" value={time.minutes} />
          <StatBox label="Seconds" value={time.seconds} />
        </ul>
        <div className="text-center">
          <Button className="text-center" asChild>
            <Link href="/search">View Products</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src="/images/promo.jpg"
          alt="promotion"
          width={300}
          height={200}
        />
      </div>
    </section>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <li className="p-4 w-full text-center">
      <p className="text-3xl font-bold">{value}</p>
      <p>{label}</p>
    </li>
  );
}
