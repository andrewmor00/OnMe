// CSV Import Utility for OnMyFeed Application
// This utility helps import CSV files into localStorage database

import { setItem, getItem } from './localStorage.js';

// CSV Parser function
const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    
    const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
    const row = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    data.push(row);
  }
  
  return data;
};

// Import CSV file
export const importCSV = async (file, databaseName) => {
  try {
    const text = await file.text();
    const data = parseCSV(text);
    
    // Store the imported data
    setItem(databaseName, data);
    
    return {
      success: true,
      message: `Successfully imported ${data.length} records to ${databaseName}`,
      data: data
    };
  } catch (error) {
    console.error('Error importing CSV:', error);
    return {
      success: false,
      message: `Error importing CSV: ${error.message}`,
      data: null
    };
  }
};

// Import multiple CSV files
export const importMultipleCSV = async (files) => {
  const results = [];
  
  for (const [databaseName, file] of Object.entries(files)) {
    const result = await importCSV(file, databaseName);
    results.push({
      databaseName,
      ...result
    });
  }
  
  return results;
};

// Get all imported databases
export const getImportedDatabases = () => {
  const databases = {};
  
  // You can add more database names here based on your CSV files
  const databaseNames = [
    'users_database',
    'posts_database', 
    'analytics_database',
    'bloggers_database'
  ];
  
  databaseNames.forEach(name => {
    const data = getItem(name);
    if (data) {
      databases[name] = data;
    }
  });
  
  return databases;
};

// Search in imported data
export const searchInDatabase = (databaseName, searchTerm, searchFields = []) => {
  const data = getItem(databaseName);
  if (!data) return [];
  
  return data.filter(item => {
    if (searchFields.length === 0) {
      // Search in all fields
      return Object.values(item).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      // Search in specific fields
      return searchFields.some(field => 
        item[field] && item[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });
};

// Filter data by field value
export const filterDatabase = (databaseName, field, value) => {
  const data = getItem(databaseName);
  if (!data) return [];
  
  return data.filter(item => item[field] === value);
};

// Get unique values for a field
export const getUniqueValues = (databaseName, field) => {
  const data = getItem(databaseName);
  if (!data) return [];
  
  const values = data.map(item => item[field]).filter(Boolean);
  return [...new Set(values)];
};

// Get database statistics
export const getDatabaseStats = (databaseName) => {
  const data = getItem(databaseName);
  if (!data || data.length === 0) {
    return {
      totalRecords: 0,
      fields: [],
      fieldTypes: {}
    };
  }
  
  const fields = Object.keys(data[0]);
  const fieldTypes = {};
  
  fields.forEach(field => {
    const sampleValue = data[0][field];
    if (!isNaN(sampleValue) && sampleValue !== '') {
      fieldTypes[field] = 'number';
    } else if (sampleValue === 'true' || sampleValue === 'false') {
      fieldTypes[field] = 'boolean';
    } else {
      fieldTypes[field] = 'string';
    }
  });
  
  return {
    totalRecords: data.length,
    fields: fields,
    fieldTypes: fieldTypes
  };
};

// Export database to CSV
export const exportDatabaseToCSV = (databaseName) => {
  const data = getItem(databaseName);
  if (!data || data.length === 0) return null;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

// Clear specific database
export const clearDatabase = (databaseName) => {
  localStorage.removeItem(databaseName);
  return {
    success: true,
    message: `Database ${databaseName} cleared successfully`
  };
};

// Get all database names
export const getAllDatabaseNames = () => {
  const databases = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('_database')) {
      databases.push(key);
    }
  }
  return databases;
}; 