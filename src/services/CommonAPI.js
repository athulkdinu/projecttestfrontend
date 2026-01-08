import axios from "axios"

const commonAPI = async (httprequest, url, reqbody, reqheader) => {
    const requestconfig = {
        method: httprequest,
        url,
        data: reqbody,
        headers: reqheader
    };

    return await axios(requestconfig)
        .then(res => {
            return res;   // SUCCESS
        })
        .catch(err => {
            console.log("API ERROR:", err.response);
            return err.response;  // VERY IMPORTANT
        });
};

export default commonAPI;