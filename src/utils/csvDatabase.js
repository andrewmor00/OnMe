// CSV Database System for OnMyFeed Application
// Handles importing, storing, searching, and managing CSV data

class CSVDatabase {
  constructor() {
    this.storageKeys = {
      USERS: 'csv_users',
      STATS: 'csv_stats', 
      COMMENTS: 'csv_comments',
      POSTS: 'csv_posts',
      METADATA: 'csv_metadata'
    };
    
    this.metadata = this.getMetadata();
    
    // Auto-initialize with built-in data if no data exists
    this.initializeWithBuiltInData();
  }

  // Initialize database with built-in CSV data
  async initializeWithBuiltInData() {
    const metadata = this.getMetadata();
    const hasData = Object.values(metadata).some(type => type.count > 0);
    
    if (!hasData) {
      console.log('Initializing CSV database with built-in data...');
      await this.loadBuiltInData();
    }
  }

  // Load built-in CSV data from the data directory
  async loadBuiltInData() {
    try {
      // Import all built-in CSV files
      const importPromises = [
        this.importBuiltInCSV('users', '/data/users_df.csv'),
        this.importBuiltInCSV('stats', '/data/stats_df.csv'),
        this.importBuiltInCSV('comments', '/data/comments.csv'),
        this.importBuiltInCSV('posts', '/data/posts_df.csv')
      ];

      await Promise.all(importPromises);
      console.log('Successfully loaded all built-in CSV data');
    } catch (error) {
      console.error('Error loading built-in CSV data:', error);
    }
  }

  // Import built-in CSV file
  async importBuiltInCSV(type, filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      const result = await this.importCSV(csvText, type);
      
      if (result.success) {
        console.log(`Successfully imported built-in ${type} data: ${result.count} records`);
      } else {
        console.error(`Failed to import built-in ${type} data:`, result.error);
      }
      
      return result;
    } catch (error) {
      console.error(`Error importing built-in ${type} CSV:`, error);
      return { success: false, error: error.message };
    }
  }

  // Get metadata about imported data
  getMetadata() {
    const metadata = localStorage.getItem(this.storageKeys.METADATA);
    return metadata ? JSON.parse(metadata) : {
      users: { count: 0, lastImport: null },
      stats: { count: 0, lastImport: null },
      comments: { count: 0, lastImport: null },
      posts: { count: 0, lastImport: null }
    };
  }

  // Update metadata
  updateMetadata(type, count) {
    this.metadata[type] = {
      count: count,
      lastImport: new Date().toISOString()
    };
    localStorage.setItem(this.storageKeys.METADATA, JSON.stringify(this.metadata));
  }

  // Parse CSV string to array of objects
  parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }

    return data;
  }

  // Parse CSV line handling quoted values
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  // Import CSV data
  async importCSV(csvText, type) {
    try {
      const data = this.parseCSV(csvText);
      
      // Store data in localStorage
      localStorage.setItem(this.storageKeys[type.toUpperCase()], JSON.stringify(data));
      
      // Update metadata
      this.updateMetadata(type, data.length);
      
      console.log(`Successfully imported ${data.length} ${type} records`);
      return { success: true, count: data.length };
    } catch (error) {
      console.error(`Error importing ${type}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Import from file
  async importFromFile(file, type) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = this.importCSV(e.target.result, type);
        resolve(result);
      };
      reader.readAsText(file);
    });
  }

  // Get all data of a specific type
  getAll(type) {
    const data = localStorage.getItem(this.storageKeys[type.toUpperCase()]);
    return data ? JSON.parse(data) : [];
  }

  // Search data with filters
  search(type, filters = {}) {
    const data = this.getAll(type);
    return data.filter(item => {
      return Object.keys(filters).every(key => {
        const filterValue = filters[key];
        const itemValue = item[key];
        
        if (typeof filterValue === 'string') {
          return itemValue && itemValue.toLowerCase().includes(filterValue.toLowerCase());
        } else if (typeof filterValue === 'number') {
          return itemValue === filterValue;
        } else if (Array.isArray(filterValue)) {
          return filterValue.includes(itemValue);
        }
        
        return true;
      });
    });
  }

  // Get data by ID
  getById(type, id) {
    const data = this.getAll(type);
    return data.find(item => item.id === id || item.user_id === id || item.post_id === id);
  }

  // Get users with their stats
  getUsersWithStats() {
    const users = this.getAll('users');
    const stats = this.getAll('stats');
    
    return users.map(user => {
      const userStats = stats.find(stat => stat.user_id === user.user_id);
      return {
        ...user,
        stats: userStats || {}
      };
    });
  }

  // Get posts with comments count
  getPostsWithComments() {
    const posts = this.getAll('posts');
    const comments = this.getAll('comments');
    
    return posts.map(post => {
      const postComments = comments.filter(comment => comment.post_id === post.post_id);
      return {
        ...post,
        commentsCount: postComments.length,
        comments: postComments
      };
    });
  }

  // Get top users by subscribers
  getTopUsers(limit = 10) {
    const users = this.getUsersWithStats();
    return users
      .sort((a, b) => {
        const aSubs = parseInt(a.social_num_subs) || 0;
        const bSubs = parseInt(b.social_num_subs) || 0;
        return bSubs - aSubs;
      })
      .slice(0, limit);
  }

  // Get users by engagement rate
  getUsersByEngagement(limit = 10) {
    const users = this.getUsersWithStats();
    return users
      .filter(user => user.stats.social_rate_engag_02)
      .sort((a, b) => {
        const aEng = parseFloat(a.stats.social_rate_engag_02) || 0;
        const bEng = parseFloat(b.stats.social_rate_engag_02) || 0;
        return bEng - aEng;
      })
      .slice(0, limit);
  }

  // Get comments by sentiment
  getCommentsBySentiment(sentiment = 'positive') {
    const comments = this.getAll('comments');
    return comments.filter(comment => comment.comment_type === sentiment);
  }

  // Get statistics summary
  getStatisticsSummary() {
    const users = this.getAll('users');
    const stats = this.getAll('stats');
    const comments = this.getAll('comments');
    const posts = this.getAll('posts');

    const totalSubscribers = users.reduce((sum, user) => {
      const subs = parseInt(user.social_num_subs) || 0;
      return sum + subs;
    }, 0);

    const avgEngagement = stats.reduce((sum, stat) => {
      const eng = parseFloat(stat.social_rate_engag_02) || 0;
      return sum + eng;
    }, 0) / stats.length;

    const positiveComments = comments.filter(c => c.comment_type === 'positive').length;
    const negativeComments = comments.filter(c => c.comment_type === 'negative').length;
    const neutralComments = comments.filter(c => c.comment_type === 'neutral').length;

    return {
      totalUsers: users.length,
      totalPosts: posts.length,
      totalComments: comments.length,
      totalSubscribers: totalSubscribers,
      averageEngagement: avgEngagement.toFixed(2),
      commentsSentiment: {
        positive: positiveComments,
        negative: negativeComments,
        neutral: neutralComments
      }
    };
  }

  // Clear all data
  clearAll() {
    Object.values(this.storageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
    this.metadata = {
      users: { count: 0, lastImport: null },
      stats: { count: 0, lastImport: null },
      comments: { count: 0, lastImport: null },
      posts: { count: 0, lastImport: null }
    };
    localStorage.setItem(this.storageKeys.METADATA, JSON.stringify(this.metadata));
  }

  // Export data as CSV
  exportAsCSV(type) {
    const data = this.getAll(type);
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          return value.toString().includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  }

  // Download data as CSV file
  downloadCSV(type) {
    const csvContent = this.exportAsCSV(type);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

// Create global instance
const csvDB = new CSVDatabase();

export default csvDB; 