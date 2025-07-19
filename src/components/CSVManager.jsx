import React, { useState, useEffect, useCallback } from 'react';
import csvDB from '../utils/csvDatabase';
import CSVWelcome from './CSVWelcome';
import './CSVManager.css';

const CSVManager = () => {
  const [metadata, setMetadata] = useState(csvDB.getMetadata());
  const [selectedType, setSelectedType] = useState('users');
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const [importStatus, setImportStatus] = useState({});

  const loadData = useCallback(() => {
    const allData = csvDB.getAll(selectedType);
    setData(allData);
    setCurrentPage(1);
  }, [selectedType]);

  useEffect(() => {
    loadData();
  }, [loadData]);



  const handleFileImport = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setImportStatus({ [type]: 'Importing...' });

    try {
      const result = await csvDB.importFromFile(file, type);
      if (result.success) {
        setImportStatus({ [type]: `Successfully imported ${result.count} records` });
        setMetadata(csvDB.getMetadata());
        if (selectedType === type) {
          loadData();
        }
      } else {
        setImportStatus({ [type]: `Error: ${result.error}` });
      }
    } catch (error) {
      setImportStatus({ [type]: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm || !searchField) {
      loadData();
      return;
    }

    const filteredData = csvDB.search(selectedType, { [searchField]: searchTerm });
    setData(filteredData);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);

    const sortedData = [...data].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      // Handle numeric values
      if (!isNaN(aVal) && !isNaN(bVal)) {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setData(sortedData);
  };

  const getAvailableFields = () => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = () => Math.ceil(data.length / itemsPerPage);

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      csvDB.clearAll();
      setMetadata(csvDB.getMetadata());
      setData([]);
      setImportStatus({});
    }
  };

  const exportData = (type) => {
    csvDB.downloadCSV(type);
  };

  // const getStatistics = () => {
  //   return csvDB.getStatisticsSummary();
  // };

  const renderDataTable = () => {
    if (data.length === 0) {
      return <CSVWelcome />;
    }

    const fields = getAvailableFields();
    const paginatedData = getPaginatedData();

    return (
      <div className="data-table-container">
        <div className="table-controls">
          <div className="search-controls">
            <select 
              value={searchField} 
              onChange={(e) => setSearchField(e.target.value)}
              className="search-field-select"
            >
              <option value="">Select field to search</option>
              {fields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search term..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-btn">Search</button>
            <button onClick={loadData} className="clear-search-btn">Clear</button>
          </div>
        </div>

        <div className="table-info">
          Showing {paginatedData.length} of {data.length} records
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {fields.map(field => (
                  <th 
                    key={field} 
                    onClick={() => handleSort(field)}
                    className="sortable-header"
                  >
                    {field}
                    {sortField === field && (
                      <span className="sort-indicator">
                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={index}>
                  {fields.map(field => (
                    <td key={field} className="table-cell">
                      {row[field] ? String(row[field]).substring(0, 100) : ''}
                      {row[field] && String(row[field]).length > 100 && '...'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {getTotalPages() > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-btn"
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {getTotalPages()}
            </span>
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === getTotalPages()}
              className="page-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="csv-manager">
      <div className="csv-header">
        <h2>CSV Database Manager</h2>
        <div className="header-actions">
          <button onClick={clearAllData} className="clear-btn">
            Clear All Data
          </button>
        </div>
      </div>

      <div className="import-section">
        <h3>Import CSV Files</h3>
        <div className="import-grid">
          {['users', 'stats', 'comments', 'posts'].map(type => (
            <div key={type} className="import-item">
              <label className="import-label">
                <span className="import-title">{type.toUpperCase()}</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileImport(e, type)}
                  className="file-input"
                />
                <div className="file-input-label">Choose {type}.csv</div>
              </label>
              {importStatus[type] && (
                <div className={`import-status ${importStatus[type].includes('Error') ? 'error' : 'success'}`}>
                  {importStatus[type]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="statistics-section">
        <h3>Database Statistics</h3>
        <div className="stats-grid">
          {Object.entries(metadata).map(([type, info]) => (
            <div key={type} className="stat-card">
              <div className="stat-title">{type.toUpperCase()}</div>
              <div className="stat-value">{info.count}</div>
              <div className="stat-date">
                {info.lastImport ? new Date(info.lastImport).toLocaleDateString() : 'Not imported'}
              </div>
              <button 
                onClick={() => exportData(type)} 
                className="export-btn"
                disabled={info.count === 0}
              >
                Export
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="data-section">
        <div className="data-header">
          <h3>Data Viewer</h3>
          <div className="type-selector">
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="type-select"
            >
              <option value="users">Users</option>
              <option value="stats">Stats</option>
              <option value="comments">Comments</option>
              <option value="posts">Posts</option>
            </select>
          </div>
        </div>

        {loading && <div className="loading">Loading...</div>}
        {renderDataTable()}
      </div>
    </div>
  );
};

export default CSVManager; 