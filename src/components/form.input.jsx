import { useState } from "react";

const FormInput = () => {
  const [input, setInput] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const response = await fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
          input
        )}`
      );
      if (response.ok) {
        setQrCodeUrl(response.url);
      } else {
        console.error("Failed to generate QR code");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
    }

    setInput("");
  };

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 my-8 w-full md:w-[380px]">
        <h1 className=" font-bold text-start flex items-start">Get Qr Code</h1>

        <input
          type="text"
          placeholder="Enter a link here..."
          className="p-2 border border-white outline-none text-white bg-transparent rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition">
          Submit
        </button>
      </form>
      {qrCodeUrl && (
        <div className="mt-4 flex-1 md:w-[280px]  border-white border p-3 rounded-2xl">
          <img src={qrCodeUrl} alt="Generated QR Code" className="w-full" />
        </div>
      )}
    </div>
  );
};

export default FormInput;
