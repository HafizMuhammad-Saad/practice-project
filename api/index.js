const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises;
const cors = require("cors");

require("dotenv").config();

const app = express();
// const serverless = require("serverless-http");

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage()

const upload = multer({
    limits: {
        fileSize: 3 * 1024 * 1024,
    },
    fileFilter: (req,file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true)
        } else {
            cb(new Error("only images are required"), false)
        }
    },
    storage: storage
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
})


const path = require("path");
const dataFilePath = path.join(__dirname, "..", "data.json");

const readDataFromFile = async () => {
    try {
        const data = await fs.readFile(dataFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.log("Error reading file:", error);
        
        return [];
    }
};

const writeDataToFile = async (data) => {
    try {
       await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.log("Something went wrong while writing data");
        
    }
}

const uploadImageInCloudinary = (buffer, fileName) => {
    return new Promise((res, rej) => {
        cloudinary.uploader
        .upload_stream(
            {
                resource_type: "image",
                public_id: `${Date.now()}_${fileName}`,
                folder: "users_upload",
            },
            (error, result) => {
                if (error){rej(error)}
                else {res(result)}
            }
        )
        .end(buffer)
    })
};

app.get('/api/idcard/:cnic', async (req,res) => {
    const cnic = req.params.cnic
    const all = await readDataFromFile()
    
    const student = all.find((s) => s.cnic === cnic)
    // console.log(student);
    

    if (!student) {
    return res.status(404).json({ message: 'Student not found.' });
  }

    res.json(student);

})

app.post("/api/user/create", upload.single("image"), async (req, res) => {
    const {
        fullName,
        fatherName,
        cnic,
        country,
        city,
        course,
        phone,
        email,
        gender,
        address,
        qualification,
        laptop,
        computerProficiency,
        dob
    } = req.body;
    

    if (
        !fullName ||
        !fatherName ||
        !cnic ||
        !country ||
        !city ||
        !course ||
        !phone ||
        !email ||
        !gender ||
        !address ||
        !qualification ||
        !laptop ||
        !computerProficiency ||
        !dob ||
        !req.file
    ) {
        return res.send({ message: "All fields are required", success: false });
    }
    

    const uploadImage = await uploadImageInCloudinary(req.file.buffer, req.file.originalname);

    const newUser = {
        fullName,
        fatherName,
        cnic,
        country,
        city,
        course,
        phone,
        email,
        gender,
        address,
        qualification,
        laptop,
        computerProficiency,
        dob,
        image: uploadImage.secure_url,
        id: uploadImage.public_id
    };

    // console.log(newUser.nic);
    

    const existingData = await readDataFromFile();
    existingData.push(newUser);
    await writeDataToFile(existingData)

    return res.send({message: "User Created Successfully", success: true, user: newUser});

})
app.get('/api/all-users', async (req, res) => {
    const allUsers = await readDataFromFile();
    res.send({users: allUsers});
})


module.exports = app;
// module.exports.handler = serverless(app);

app.listen(process.env.PORT, () => {
    console.log(`srver is running on port ${process.env.PORT}`);

})