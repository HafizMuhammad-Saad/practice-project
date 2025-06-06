import axios from 'axios'
import './App.css'
import { useState, useRef } from 'react'
import { useEffect } from 'react'

function App() {


  const [loading, setLoading] = useState(false) 
  const [lookupNic, setLookupNic] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);
  const [message, setMessage] = useState('')
    const idCardRef = useRef(null);
    const [showIdCard, setShowIdCard] = useState(true);
  const [data, setData] = useState(null)
  const [formData, setFormData] = useState({
    name:'',
    email:'',
    nic:'',
    image:null

  })
const fetchUsers = async () => {
    const response = await axios.get(`/api/all-users`)
    const result = response.data
    setData(result.users)
    
}
  useEffect( ()=> {
    fetchUsers()
  }, [setData])

  const handleInput = (e) => {
    const {name, value} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImage = (e) => {
    const imageFile = e.target.files[0]
    setFormData((prev) => ({
      ...prev,
      image: imageFile
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    if (!formData.name || !formData.email || !formData.image || !formData.nic) {
      alert("All fields are required")
    }

    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('email', formData.email)
    formDataToSend.append('nic', formData.nic)
    formDataToSend.append('image', formData.image)

    try {
      const response = await axios.post('/api/user/create', formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }) 
      // console.log(response.data);

      if (!response.data.success) {
        alert(response.data.message)
      } else {
         setShowIdCard(true);
        alert(response.data.message)
        
      }
      
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
    alert(error.response.data.message);
  } else {
    alert(error.message || "An unknown error occurred");
  }
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    try {
      const res = await axios.get(`api/idcard/${lookupNic}`)
      setStudentInfo(res.data)
          setMessage('')
    } catch (error) {
      setStudentInfo(null);
      setMessage('No student found with that number.');
      
    }
  }

  return (
    <>
    { message && (
      <div className="">{message}</div>
    )
  }
    <form action="" onSubmit={handleSubmit} method="post" className='flex justify-center items-center h-full'>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
  <legend className="fieldset-legend">Regiter</legend>

  <label className="label">Name</label>
  <input type="text" className="input" placeholder="Name" name='name' onChange={handleInput} value={formData.name}/>

  <label className="label">Email</label>
  <input type="email" className="input" placeholder="Email" name='email' onChange={handleInput} value={formData.email}/>

  <label className="label">CNIC Number</label>
  <input type="text" className="input" placeholder="NIC" name='nic' onChange={handleInput} value={formData.nic}/>

  <label className="label">Image</label>
<input type="file" accept='image/*' className="file-input file-input-info" name='image' onChange={handleImage}/>

  <button className="btn btn-primary mt-4" type='submit'>{
    loading ? <span className="loading loading-bars loading-xs"></span> : 'Register'
 }</button>
</fieldset>

    </form>

    {/* {
      showIdCard ?? ( */}
        <div className="flex justify-center items-center my-8">
  <div className="card w-96 bg-gradient-to-br from-blue-100 to-blue-300 shadow-xl p-6">
    <h3 className="text-2xl font-bold text-center mb-4 text-blue-700">Generate Your ID Card</h3>
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Enter CNIC Number"
        value={lookupNic}
        onChange={(e) => setLookupNic(e.target.value)}
        className="input input-bordered input-info w-full text-lg"
      />
      <button
        onClick={handleGenerate}
        className="btn btn-info btn-block text-lg font-semibold shadow"
      >
        Get ID Card
      </button>
    </div>
  </div>
</div>
     {/* )
    }  */}
 {
  studentInfo && (
    <div
      ref={idCardRef}
      className="flex justify-center items-center my-8"
    >
      <div className="relative w-96 bg-white rounded-2xl shadow-2xl border-4 border-blue-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-400 to-blue-200 h-32 w-full"></div>
        <div className="flex flex-col items-center -mt-16 pb-6">
          <img
            src={studentInfo.image}
            alt={studentInfo.name}
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
          />
          <h2 className="mt-4 text-2xl font-bold text-blue-700">{studentInfo.name}</h2>
          <span className="text-gray-500 text-sm mb-1">ID: {studentInfo.id}</span>
          <span className="text-gray-600">{studentInfo.email}</span>
          <div className="mt-4">
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold shadow">
              CNIC: {studentInfo.nic}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
    </>
  )
}

export default App
