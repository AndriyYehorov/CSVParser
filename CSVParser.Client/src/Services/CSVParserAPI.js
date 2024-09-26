import axios from 'axios'
import moment from 'moment';

export const LoadFile = async (file) => {
    try{

        const formData = new FormData();
        formData.append('file', file);

        var response = await axios.post("http://localhost:5200/api/Parser", formData);        

        console.log(response);

        return response.data;

    } catch(e){

        console.error(e);

        return e.code +  ": " + e.response.data;
    }    
}

export const GetRecords = async () => {
    try{    

        var response = await axios.get("http://localhost:5200/api/Parser");  
        
        response.data.forEach(element => {
                        
            element.dateOfBirth = moment(element.dateOfBirth).format("DD.MM.YYYY");
            
        });

        return response.data;

    } catch(e){

        console.error(e);
    }    
}

export const DeleteRecords = async (idArray) => {
    try{
        var response = await axios.delete("http://localhost:5200/api/Parser", {
            data: idArray, 
            headers: {
                'Content-Type': 'application/json'
            }
        });      
        
        return response.data;

    } catch(e){

        console.error(e);
    }    
}

export const UpdateRecord = async (record) => {
    try{

        record.dateOfBirth = moment(record.dateOfBirth, "DD.MM.YYYY").format("YYYY-MM-DD");    
                
        var response = await axios.put("http://localhost:5200/api/Parser/"+record.id, record);                
        
        return response;

    } catch(e){

        console.error(e);
    }    
}