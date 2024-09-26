import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Paper, IconButton} from '@mui/material';
import moment from 'moment';
import { GetRecords, DeleteRecords, UpdateRecord } from '../Services/CSVParserAPI';
import { useState, useEffect, useCallback } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

function CustomToolbar({ selectedRows, onDelete }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
      <GridToolbar />
      {selectedRows.length > 0 && (

      <IconButton onClick={onDelete}>
        <DeleteIcon />
        <p>({selectedRows.length})</p>
      </IconButton>        
      )}
    </Box>
  );
}

export default function EnhancedDataGrid({ refreshKey, RefreshData }) {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let loadedRecords = await GetRecords();
        setRows(loadedRecords);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [refreshKey]);

  const processRowUpdate = useCallback(
    async (newRow, oldRow) => {
      try {     

        const hasChanged = Object.keys(newRow).some(key => newRow[key] !== oldRow[key]);

        if (hasChanged) {           
          await UpdateRecord(newRow); 
          RefreshData(); 
        }
        
      } catch (error) {
        console.error('Failed to update record:', error);        
      }
    },
    [RefreshData]
  );  

  const handleProcessRowUpdateError = () => 
  {}

  const handleDeleteClick = () => {
    DeleteRecords(selectedRows);
    setSelectedRows([]);
    RefreshData();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 130, type: 'number', editable: false },
    { field: 'name', headerName: 'Name', width: 130, editable: true },
    { field: 'dateOfBirth',
      headerName: 'Date of birth',      
      width: 130,        
      editable: true
    },
    {
      field: 'isMarried',
      headerName: 'Married',
      width: 130,
      type: 'boolean',
      editable: true
    },
    { field: 'phoneNumber', headerName: 'Phone', width: 130, editable: true },
    {
      field: 'salary',
      headerName: 'Salary',
      type: 'number',
      width: 130,      
      editable: true
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <DataGrid
          editMode="row"
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{
            toolbar: (props) => (
              <CustomToolbar
                {...props}
                selectedRows={selectedRows}
                onDelete={handleDeleteClick}
              />
            ),
          }}
          onRowSelectionModelChange={(ids) => {
              setSelectedRows(ids);                    
          }}         
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}                        
        />
      </Paper>
    </Box>
  );
}

