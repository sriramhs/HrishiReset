import { useState, useEffect } from "react";
import "./App.css";
import Waves from "./Waves/Waves";
import { useNavigate } from "react-router-dom";

interface TimestampResponse {
  timestamp: string;
}

const API_URL =
  "https://script.google.com/macros/s/AKfycbwoPbomU3vgO4TYfVeY6L9Zj1TZdnXLRQIreNoasfOrL45tDB7obMlaXvpYVFIIhEmihA/exec";

function Home() {
  const [timestamp, setTimestamp] = useState<Date | null>(null);
  const [timeSince, setTimeSince] = useState<number>(0);
  const navigate = useNavigate();

  // Fetch the timestamp from the API.
  const fetchTimestamp = async (): Promise<void> => {
    try {
      const response = await fetch(API_URL);
      const data = (await response.json()) as TimestampResponse;
      setTimestamp(new Date(data.timestamp));
    } catch (error) {
      console.error("Error fetching timestamp:", error);
    }
  };

  // Fetch on mount and poll every 5 seconds.
  useEffect(() => {
    fetchTimestamp();
    const pollInterval = setInterval(fetchTimestamp, 5000);
    return () => clearInterval(pollInterval);
  }, []);

  // Update the elapsed time every second.
  useEffect(() => {
    const timer = setInterval(() => {
      if (timestamp) {
        const now = new Date();
        setTimeSince(now.getTime() - timestamp.getTime());
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [timestamp]);

  // Handle reset: optimistic UI update then POST to the API.
  const handleReset = async (): Promise<void> => {
    try {
      setTimestamp(new Date());
      const response = await fetch(API_URL, { method: "POST" });
      const data = (await response.json()) as TimestampResponse;
      setTimestamp(new Date(data.timestamp));
    } catch (error) {
      console.error("Error resetting timestamp:", error);
    }
  };

  // Split the elapsed time into days, hours, minutes, and seconds.
  const formatTime = (ms: number) => {
    let totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    totalSeconds = Math.floor(totalSeconds / 60);
    const minutes = totalSeconds % 60;
    totalSeconds = Math.floor(totalSeconds / 60);
    const hours = totalSeconds % 24;
    const days = Math.floor(totalSeconds / 24);
    return { days, hours, minutes, seconds };
  };

  const timeObj = timestamp ? formatTime(timeSince) : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black gap-3">
      <BubbleText />
      {timeObj ? (
        <div className="mx-auto flex w-full max-w-5xl items-center bg-white">
          <CountdownItem value={timeObj.days} label="days" />
          <CountdownItem value={timeObj.hours} label="hours" />
          <CountdownItem value={timeObj.minutes} label="minutes" />
          <CountdownItem value={timeObj.seconds} label="seconds" />
          <Waves />
        </div>
      ) : (
        <p className="text-white text-2xl mt-4">Loading...</p>
      )}
      <button
        onClick={handleReset}
        className="px-6 py-2 font-medium bg-indigo-500 text-white w-fit transition-all shadow-[3px_3px_0px_white] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] z-50"
      >
        Reset
      </button>
      <button
        onClick={() => {
          navigate("/chatbot");
        }}
        className="px-6 py-2 font-medium bg-blue-500 text-white w-fit transition-all shadow-[3px_3px_0px_white] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] z-50"
      >
        Talk to HrishiBot
      </button>
    </div>
  );
}

export default Home;

const BubbleText = () => {
  return (
    <h2 className="text-center text-5xl font-thin text-indigo-300 z-50">
      {"Time Since Hrishi said something offesive"
        .split("")
        .map((child, idx) => (
          <span className="hoverText" key={idx}>
            {child}
          </span>
        ))}
    </h2>
  );
};

const CountdownItem = ({ value, label }: { value: number; label: string }) => {
  return (
    <div className="flex h-24 w-1/4 flex-col items-center justify-center gap-1 border-r-[1px] border-slate-200 font-mono md:h-36 md:gap-2">
      <div className="relative w-full overflow-hidden text-center">
        <span className="block text-2xl font-medium text-black md:text-4xl lg:text-6xl xl:text-7xl">
          {value}
        </span>
      </div>
      <span className="text-xs font-light text-slate-500 md:text-sm lg:text-base">
        {label}
      </span>
    </div>
  );
};
