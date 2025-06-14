import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { useState, useRef } from 'react';
import axios from 'axios';
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
// import {QRCodeSVG}  from "qrcode.react";
import { QRCodeCanvas } from 'qrcode.react';


export default function GenerateIdCard() {
     const [showConfetti, setShowConfetti] = useState(false);
        const { width, height } = useWindowSize();

        const frontRef = useRef(null);
const backRef = useRef(null);


  const [lookupNic, setLookupNic] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const idCardRef = useRef(null);

  const handleGenerate = async () => {
    if (!lookupNic) {
      setMessage('Please enter a CNIC number');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setStudentInfo(null);
    
    try {
      const res = await axios.get(`/api/idcard/${lookupNic}`);
      setStudentInfo(res.data);
                      setShowConfetti(true);

      setMessage('');
    } catch (error) {
        console.log(error);
        
      setStudentInfo(null);
      setMessage('No student found with that CNIC. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

const handleDownloadPDF = async () => {
  // Wait for images to load on both sides
  const waitForImages = async (container) => {
    const imgs = container.current.querySelectorAll('img');
    for (const img of imgs) {
      if (!img.complete) {
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }
    }
  };

  await waitForImages(frontRef);
  await waitForImages(backRef);

  // Capture front
  const frontCanvas = await html2canvas(frontRef.current, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#fff", // Avoid oklch error
  });
  const frontImgData = frontCanvas.toDataURL('image/png');

  // Capture back
  const backCanvas = await html2canvas(backRef.current, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#fff",
  });
  const backImgData = backCanvas.toDataURL('image/png');

  // Create PDF with both images
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [frontCanvas.width, frontCanvas.height],
  });

  pdf.addImage(frontImgData, 'PNG', 0, 0, frontCanvas.width, frontCanvas.height);
  pdf.addPage([backCanvas.width, backCanvas.height], 'landscape');
  pdf.addImage(backImgData, 'PNG', 0, 0, backCanvas.width, backCanvas.height);

  pdf.save(`id-card-${studentInfo?.fullName || "student"}.pdf`);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
                {showConfetti && <Confetti width={width} height={height} />}

      <div className="max-w-5xl mx-auto">
        {/* Professional Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-800 w-16 h-16 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Student ID Portal</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate official student identification cards using your CNIC number
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-16 border border-gray-200">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Enter Student CNIC Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="XXXXX-XXXXXXX-X"
                  value={lookupNic}
                  onChange={(e) => setLookupNic(e.target.value)}
                  className="w-full py-3 px-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full cursor-pointer py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium shadow transition duration-300 ${
                isLoading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating ID Card...
                </div>
              ) : (
                'Generate ID Card'
              )}
            </button>
            
            {message && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center text-red-700">
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Professional ID Card */}
{studentInfo && (
    <>
    <div className="flex flex-col items-center mb-8 gap-6">
    {/* Card Front */}
    <div
      ref={frontRef}
      className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
    >
      <div 
      ref={idCardRef}
      className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
    >
      {/* Header */}
      <div className="bg-blue-700 py-3 px-4 flex items-center">
        <div className="bg-white p-1 rounded mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">University ID</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex gap-4">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gray-100 border rounded-lg overflow-hidden flex items-center justify-center">
              {studentInfo.image ? (
                <img 
                  src={studentInfo.image} 
                    crossOrigin="anonymous"
                  alt="Student" 
                  className="object-cover w-full h-full" 
                />
              ) : (
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className="mt-2 bg-blue-600 text-white text-xs text-center font-medium px-2 py-1 rounded">
              ACTIVE
            </div>
          </div>

          {/* Details */}
          <div className="flex-grow">
            <div className="mb-2">
              <h2 className="text-xl font-bold text-gray-800">{studentInfo.fullName}</h2>
              <p className="text-gray-600 text-sm">{studentInfo.course}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Student ID</p>
                <p className="text-gray-800 font-medium">#{studentInfo.id.slice(18, 24)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">CNIC</p>
                <p className="text-gray-800 font-medium">{studentInfo.cnic}</p>
              </div>
              {/* <div>
                <p className="text-gray-500 text-xs">Valid Until</p>
                <p className="text-gray-800 font-medium">Jun 2025</p>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 px-4 py-2 text-xs text-gray-600 border-t border-gray-200">
        <div className="flex justify-between">
          <span>Issued: {new Date().toLocaleDateString()}</span>
          <span>Status: Enrolled</span>
        </div>
      </div>
    </div>
    </div>

    {/* Card Back */}
     <div ref={backRef} className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="p-4">
          <h2 className="text-lg font-bold text-blue-700 mb-2">Back of ID Card</h2>
          <p className="text-sm text-gray-600 mb-4">
            Please return to the university office if found. For verification, scan the QR code below.
          </p>
          <div className="flex justify-center">
            <QRCodeCanvas
              value={studentInfo.id}
              size={120}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={true}
            />
          </div>
        </div>
        <div className="bg-gray-100 px-4 py-2 text-xs text-gray-600 text-center border-t">
          University of Future Tech | +123-456-7890 | info@uft.edu
        </div>
      </div>

    {/* Download PDF Button */}
    <button
      onClick={handleDownloadPDF}
      className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition cursor-pointer"
    >
      Download ID Card (PDF)
    </button>
  </div>
  <div className="flex justify-center mb-8">
    
  </div>
    </>
)}


        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Secure Verification</h3>
            <p className="text-gray-600">All student IDs are securely verified through our university database.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Instant Access</h3>
            <p className="text-gray-600">Generate your official ID card in seconds with real-time validation.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Cloud Storage</h3>
            <p className="text-gray-600">All ID cards are securely stored in our cloud for future access.</p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-gray-600 text-sm border-t border-gray-200 pt-6">
          © {new Date().getFullYear()} University of Technology • Student Services Department
        </div>
      </div>
    </div>
  );
}