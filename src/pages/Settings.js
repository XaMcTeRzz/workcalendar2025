import React from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useTheme } from '../context/ThemeContext';

function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Настройки
      </Typography>
      <Paper sx={{ mt: 2 }}>
        <List>
          <ListItem>
            <ListItemText
              primary="Тёмная тема"
              secondary="Включить тёмное оформление приложения"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  color="primary"
                />
              }
              label={darkMode ? 'Включена' : 'Выключена'}
              labelPlacement="start"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Версия приложения"
              secondary="1.0.0"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}

export default Settings; 