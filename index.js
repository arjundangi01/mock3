const cors = require('cors')
const express = require('express');
const mongoDBConnection = require('./config/db');
const userRouter = require('./routes/user.routes');
const employeeRouter = require('./routes/employee.routes');

require('dotenv').config();


const PORT = process.env.PORT
const app = express();

app.use(cors({
    origin:['http://localhost:3000']
}))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome To Employee Management')
})

app.use('/user', userRouter);
app.use('/employees', employeeRouter);

app.listen(PORT, async () => {
    try {
        await mongoDBConnection;
        console.log(`server running at ${PORT}`)

    } catch (error) {
        console.log('error while listen',error)
    }
})
