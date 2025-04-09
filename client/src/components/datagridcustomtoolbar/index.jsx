import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { 
  IconButton, 
  TextField, 
  Box,
  Stack
} from '@mui/material';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid';

const DataGridCustomToolbar = ({ searchInput, setSearchInput, setSearch }) => {
  const handleSearchClick = () => {
    setSearch(searchInput);
    setSearchInput('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <GridToolbarContainer>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          p: 1
        }}
      >
        <Stack direction="row" spacing={1}>
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </Stack>
        
        <Box sx={{ position: 'relative', width: '15rem' }}>
          <TextField
            size="small"
            placeholder="Search..."
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            value={searchInput}
            aria-label="search data grid"
            fullWidth
          />
          <IconButton 
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
            size="small"
            onClick={handleSearchClick}
            aria-label="search button"
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
    </GridToolbarContainer>
  );
};

export default DataGridCustomToolbar;