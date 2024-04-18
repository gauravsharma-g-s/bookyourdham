const whitelist = ['http://localhost:3000', 'http://192.168.226.178:3000']
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