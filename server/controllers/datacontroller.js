const Data = require("../models/dataschema");

const getalldatacontroller = async(req, res)=>{
    try {
        const alldata = await Data.find({});
        return res.status(200).send({
            success:true,
            message : "Data fetched",
            data : alldata
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = getalldatacontroller;