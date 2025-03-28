// const app = require('./src/app');

const express = require('express');
const { router } = require('./src/Route/test');
app = express()


app.use("/api", router);
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
