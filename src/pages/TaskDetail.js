import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

function TaskDetail() {
  const { id } = useParams();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Детали задачи {id}
      </Typography>
    </Box>
  );
}

export default TaskDetail; 