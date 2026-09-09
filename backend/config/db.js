const dns = require('node:dns');
const mongoose=require('mongoose');

const dnsServers = process.env.DNS_SERVERS?.split(',').map((server) => server.trim()).filter(Boolean);
if (dnsServers?.length) {
  dns.setServers(dnsServers);
}

const connectDB = async ()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI,{});
    console.log("MongoDB connected");
  }catch(err){
    console.error("Error connecting to MongoDB",err);
    process.exit(1);
  }
};

module.exports=connectDB;