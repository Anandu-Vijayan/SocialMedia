import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/auth.js"
import {register} from "./controllers/auth.js"
import userRoutes from './routes/users.js'
import { verifyToken } from "./middleware/auth.js"
import { allowedNodeEnvironmentFlags } from "process"

/* Configration */

const __filename = fileURLToPath(import.meta.url)
const  __dirname = path.dirname(__filename)

dotenv.config()
const app = express()

app.use(express.json)
app.use(helmet())
app.use(helmet.crossOriginEmbedderPolicy({policy:"cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit:'300mb',extended:true}));
app.use(bodyParser.urlencoded({limit:"300mb",extended:true}))
app.use(cors())
app.use("/assets",express.static(path.join(__dirname,'public/assets')))


/*FILE STORAGE*/

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
});

const uplode=multer({storage})

/* Routes With Files*/
app.post("/auth/register",uplode.single("picture"),verifyToken,register);


/* Routes */
app.use('/auth',authRoutes)
app.use('/users',userRoutes)
/*MONGOOSE*/

const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URL,{
    // useMewUrlParse:true,
    // useUnifiedTopology:true,
    // useCreateIndex: true,
})
.then(()=>{
    app.listen(PORT,()=> console.log(`server Port:${PORT} and Mongodb connected`));
}).catch((error)=>console.log(`${error} did not connect`));
    
