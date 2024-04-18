const whitelist = ['http://localhost:3000', 'https://bookyourdham.onrender.com']
const corsOption = {
    origin : (origin,callback) => {
        if(whitelist.indexOf(origin) != -1 || !origin) {
            callback(null,true)
        }
        else{
            callback(new Error('Not allowed by Cors'))
        } 
    },  optionSuccessStatus: 200
}

module.exports = corsOption