import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { LoadFile } from '../Services/CSVParserAPI';
import { useState } from 'react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',  
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,  
});

export default function FileUploadButton({ onFileUploaded }) {

  const [message, SetMessage] = useState("");

  const sendFile = async (e) => {  
    let status = await LoadFile(e.target.files[0]);
  
    console.log(status);
    SetMessage(status);
    
    e.target.value = '';
    onFileUploaded();    
  }

  return (
    <>
      <Button
        component="label"      
        variant="contained"         
        startIcon={<CloudUploadIcon />}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          accept=".csv" 
          onInput={sendFile}    
        />
      </Button>   

      <p className='text-white'>{message}</p>
    </> 
  );
}
