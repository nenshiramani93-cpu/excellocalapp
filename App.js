import { useState } from "react";
import axios from "axios";//backend api call kare

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const uploadFile = async () => {
    if (!file) {
      alert("Please select an Excel file");
      return;
    }

    const formData = new FormData();//File ko backend bhejne ka container
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setData(res.data.data);
      setMessage(`✅ ${res.data.count} records uploaded successfully`);
    } catch (error) {
      console.error(error);
      setMessage("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            Excel Locale Uploader
          </h1>
          <p className="text-gray-600 mt-2">
            Upload Excel & auto-generate ID, Name and Locale
          </p>
        </div>

        {/* UPLOAD CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-6">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full md:w-auto border border-gray-300 rounded-lg p-2"
          />

          <button
            onClick={uploadFile}
            disabled={loading}
            className={`px-8 py-3 rounded-xl text-white font-semibold transition
              ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Uploading..." : "Upload Excel"}
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mt-6 text-center text-lg font-medium text-green-700">
            {message}
          </div>
        )}

        {/* TABLE */}
        {data.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full text-center">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Locale</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="p-3 font-semibold">{item.id}</td>
                    <td className="p-3">{item.value}</td>
                    <td className="p-3 uppercase text-blue-600 font-semibold">
                      {item.locale}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
