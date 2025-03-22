const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2">
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
        style={{ animationDelay: "0s" }}
      ></span>
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
        style={{ animationDelay: "0.2s" }}
      ></span>
      <span
        className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
        style={{ animationDelay: "0.4s" }}
      ></span>
    </div>
  );
};

export default TypingIndicator;
