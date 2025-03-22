/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import TypingIndicator from "./TypingIndicator";
import hrishiImg from "./Assets/hrishi.jpg";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Kya be gandu , agaya idhar?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function query(data: any) {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.stack-ai.com/inference/v0/run/2f9a3048-7a82-45b3-87cf-2cf78e6881ac/67de6638fb79026dda6ba002",
        {
          headers: {
            Authorization: "Bearer b28330c8-1877-4e62-b480-342457d90fa3",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      // Adjust this line to match the response field from your API
      console.log("test", result);
      const responseText =
        result?.outputs?.["out-0"] ||
        "Gandu , kya puch rha hai ? LLM todd diya";
      setLoading(false);
      return responseText;
    } catch (error) {
      console.error("Error querying API:", error);
      setLoading(false);
      return "Error: unable to fetch response.";
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user's message to conversation
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    // Clear the input immediately
    const userMessage = input;
    setInput("");

    // Call the API with the message
    const apiResponse = await query({
      user_id: "<USER or Conversation ID>",
      "in-0": userMessage,
    });

    // Append bot's response to the conversation
    setMessages((prev) => [...prev, { sender: "bot", text: apiResponse }]);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#000000] text-white">
      <div className="flex flex-col h-full w-full max-w-3xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-black border-b border-white">
          <div className="flex items-center space-x-3">
            <img
              src={hrishiImg}
              alt="Profile"
              className="w-10 h-10 rounded-none border border-white"
            />
            <div>
              <h2 className="text-lg font-bold">HrishiBot</h2>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-none border border-white shadow-[3px_3px_0px_white] max-w-xs ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-indigo-500 text-white"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-none border border-white shadow-[3px_3px_0px_white] max-w-xs bg-indigo-500">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>

        {/* Footer (Message Input) */}
        <footer className="p-4 bg-black border-t border-white">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border border-white rounded-none px-4 py-2 bg-black text-white focus:outline-none focus:border-white"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-500 text-white rounded-none px-6 py-2 transition-all shadow-[3px_3px_0px_white] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
            >
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;
