import { useState } from "react";
import { Download, QrCode, Sparkles, Link2, CheckCircle, AlertCircle } from "lucide-react";

const FormInput = () => {
  const [input, setInput] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
          input
        )}`
      );
      if (response.ok) {
        setQrCodeUrl(response.url);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Failed to generate QR code. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while fetching the QR code.");
      console.error("Error fetching QR code:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQrCode = async () => {
    if (qrCodeUrl) {
      try {
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'QRCode.png';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        console.error('Download failed:', err);
      }
    }
  };

  const clearInput = () => {
    setInput("");
    setQrCodeUrl("");
    setError(null);
    setSuccess(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl shadow-lg shadow-purple-500/25">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              QR Generator
            </h1>
            <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
          </div>
          <p className="text-white/70 text-lg">Transform any link into a beautiful QR code</p>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form Section */}
          <div className="w-full">
            <div className="space-y-6">
              {/* Input Card */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <Link2 className="w-5 h-5 text-cyan-400" />
                  <label htmlFor="qr-input" className="text-white font-semibold text-lg">
                    Enter your link
                  </label>
                </div>
                
                <div className="relative">
                  <input
                    id="qr-input"
                    type="text"
                    placeholder="https://example.com"
                    className="w-full p-4 bg-black/30 border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 text-lg backdrop-blur-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  {input && (
                    <button
                      type="button"
                      onClick={clearInput}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className={`w-full group relative overflow-hidden rounded-2xl p-4 font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  loading || !input.trim()
                    ? "bg-gray-600/50 cursor-not-allowed text-white/50"
                    : "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate QR Code
                    </>
                  )}
                </div>
              </button>

              {/* Status Messages */}
              {error && (
                <div className="backdrop-blur-xl bg-red-500/20 border border-red-400/30 rounded-2xl p-4 animate-shake">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-200">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="backdrop-blur-xl bg-green-500/20 border border-green-400/30 rounded-2xl p-4 animate-bounce">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <p className="text-green-200">QR code generated successfully!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QR Code Display Section */}
          {qrCodeUrl && (
            <div className="w-full animate-slide-in">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300">
                <h3 className="text-white font-bold text-xl mb-6 text-center">Your QR Code</h3>
                
                {/* QR Code Container */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-3xl p-6 shadow-xl">
                    <img
                      src={qrCodeUrl}
                      alt="Generated QR Code"
                      className="w-full max-w-sm mx-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={downloadQrCode}
                  className="w-full mt-6 group relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <Download className="w-5 h-5" />
                    Download QR Code
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-white/50 text-sm">
          <p>✨ Made with modern web technologies ✨</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.8s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default FormInput;                    <button
                      type="button"
                      onClick={clearInput}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className={`w-full group relative overflow-hidden rounded-2xl p-4 font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  loading || !input.trim()
                    ? "bg-gray-600/50 cursor-not-allowed text-white/50"
                    : "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate QR Code
                    </>
                  )}
                </div>
              </button>

              {/* Status Messages */}
              {error && (
                <div className="backdrop-blur-xl bg-red-500/20 border border-red-400/30 rounded-2xl p-4 animate-shake">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-200">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="backdrop-blur-xl bg-green-500/20 border border-green-400/30 rounded-2xl p-4 animate-bounce">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <p className="text-green-200">QR code generated successfully!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QR Code Display Section */}
          {qrCodeUrl && (
            <div className="w-full animate-slide-in">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300">
                <h3 className="text-white font-bold text-xl mb-6 text-center">Your QR Code</h3>
                
                {/* QR Code Container */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-3xl p-6 shadow-xl">
                    <img
                      src={qrCodeUrl}
                      alt="Generated QR Code"
                      className="w-full max-w-sm mx-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={downloadQrCode}
                  className="w-full mt-6 group relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <Download className="w-5 h-5" />
                    Download QR Code
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}070075
        <div className="mt-12 text-center text-white/50 text-sm">
          <p>✨ Made with modern web technologies ✨</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.8s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default FormInput;
