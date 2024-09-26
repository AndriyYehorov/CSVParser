import FileUploadButton from './Components/FileUploadButton'
import Table from './Components/Table'
import { useState } from 'react';

export default function App() {

  const [refreshKey, setRefreshKey] = useState(0);

  const RefreshData = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <>      
      <div className='container mx-auto p-4'>
        <div className='flex flex-row justify-start gap-4'>
          <h1 className="text-3xl font-bold">CSVParser</h1>
          <FileUploadButton onFileUploaded={RefreshData} />
        </div>

        <hr className='mt-4'/>

        <div className='flex flex-row justify-start gap-4'>          
          <Table refreshKey={refreshKey} RefreshData={RefreshData} />
        </div>
      </div>
    </>
  )
}