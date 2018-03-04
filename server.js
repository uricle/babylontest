const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.static('dist'));
app.use(morgan({format: 'dev', immediate: true}));
const port = 3000;
app.listen(port, () => {
    console.log('starting express...');
});
