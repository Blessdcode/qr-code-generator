import { useState } from "react";
import { saveAs } from "file-saver";

const FormInput = () => {
  const [input, setInput] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
          input
        )}`
      );
      if (response.ok) {
        setQrCodeUrl(response.url);
      } else {
        setError("Failed to generate QR code. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while fetching the QR code.");
      console.error("Error fetching QR code:", err);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const downloadQrCode = () => {
    if (qrCodeUrl) {
      saveAs(qrCodeUrl, "QRCode.jpg");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 md:flex-row md:justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-lg">
        <h1 className="text-xl font-bold">Generate a QR Code</h1>

        <label htmlFor="qr-input" className="sr-only">
          Enter a link:
        </label>
        <input
          id="qr-input"
          type="text"
          placeholder="Enter a link here..."
          className="p-2 border border-gray-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary-dark"
          }`}>
          {loading ? "Generating..." : "Submit"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      {qrCodeUrl && (
        <div className="mt-4 md:mt-0 p-4 border rounded-xl bg-white md:w-[350px]">
          <img
            src={qrCodeUrl}
            alt="Generated QR Code"
            className="w-full rounded-lg"
          />
          <button
            className="w-full mt-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
            onClick={downloadQrCode}>
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default FormInput;
