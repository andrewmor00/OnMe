// Auto Import Utility for CSV Files
// This utility helps import CSV files that are already in the src/data directory

import csvDB from './csvDatabase';

// Function to fetch and import CSV files from the data directory
export const autoImportCSVFiles = async () => {
  const files = [
    { name: 'users_df.csv', type: 'users' },
    { name: 'stats_df.csv', type: 'stats' },
    { name: 'comments.csv', type: 'comments' },
    { name: 'posts_df.csv', type: 'posts' }
  ];

  const results = {};

  for (const file of files) {
    try {
      console.log(`Attempting to import ${file.name}...`);
      
      // Try to fetch the file from the public directory
      const response = await fetch(`/data/${file.name}`);
      
      if (response.ok) {
        const csvText = await response.text();
        const result = await csvDB.importCSV(csvText, file.type);
        results[file.type] = result;
        console.log(`Successfully imported ${file.name}:`, result);
      } else {
        console.warn(`Could not fetch ${file.name}: ${response.status}`);
        results[file.type] = { success: false, error: `HTTP ${response.status}` };
      }
    } catch (error) {
      console.error(`Error importing ${file.name}:`, error);
      results[file.type] = { success: false, error: error.message };
    }
  }

  return results;
};

// Function to check if files exist and can be imported
export const checkCSVFilesAvailability = async () => {
  const files = [
    'users_df.csv',
    'stats_df.csv', 
    'comments.csv',
    'posts_df.csv'
  ];

  const availability = {};

  for (const fileName of files) {
    try {
      const response = await fetch(`/data/${fileName}`);
      availability[fileName] = {
        exists: response.ok,
        status: response.status,
        size: response.headers.get('content-length')
      };
    } catch (error) {
      availability[fileName] = {
        exists: false,
        error: error.message
      };
    }
  }

  return availability;
};

// Function to get import instructions
export const getImportInstructions = () => {
  return {
    title: "How to Import Your CSV Files",
    steps: [
      {
        step: 1,
        title: "Move CSV Files to Public Directory",
        description: "Copy your CSV files from src/data/ to the public/data/ directory so they can be accessed by the browser.",
        code: "cp src/data/*.csv public/data/"
      },
      {
        step: 2,
        title: "Use the CSV Manager",
        description: "Open the CSV Manager component in your app and use the file upload buttons to import each CSV file.",
        action: "Click the 'Choose file' buttons for each data type"
      },
      {
        step: 3,
        title: "Alternative: Manual Import",
        description: "You can also manually copy and paste CSV content or use the auto-import function if files are in public/data/.",
        action: "Use the auto-import button if available"
      }
    ],
    notes: [
      "The posts_df.csv file is quite large (15MB), so it may take some time to import.",
      "Make sure your CSV files have proper headers in the first row.",
      "The system will automatically parse and store your data in localStorage.",
      "You can export your data back to CSV format at any time."
    ]
  };
};

// Function to create a sample data structure for testing
export const createSampleData = () => {
  const sampleUsers = [
    {
      user_id: "sample_001",
      social_type: "tg",
      channel_link: "https://t.me/sample",
      channel_name: "Sample Channel",
      channel_info: "This is a sample channel for testing",
      social_num_subs: "1000"
    }
  ];

  const sampleStats = [
    {
      user_id: "sample_001",
      social_num_subs: "1000",
      social_num_posts: "50",
      social_rate_engag_02: "5.5"
    }
  ];

  const sampleComments = [
    {
      user_id: "commenter_001",
      post_id: "post_001",
      comment_text: "Great post!",
      comment_type: "positive"
    }
  ];

  // Import sample data
  csvDB.importCSV(
    'user_id,social_type,channel_link,channel_name,channel_info,social_num_subs\n' +
    'sample_001,tg,https://t.me/sample,Sample Channel,This is a sample channel for testing,1000',
    'users'
  );

  csvDB.importCSV(
    'user_id,social_num_subs,social_num_posts,social_rate_engag_02\n' +
    'sample_001,1000,50,5.5',
    'stats'
  );

  csvDB.importCSV(
    'user_id,post_id,comment_text,comment_type\n' +
    'commenter_001,post_001,Great post!,positive',
    'comments'
  );

  console.log("Sample data created for testing");
};

export default {
  autoImportCSVFiles,
  checkCSVFilesAvailability,
  getImportInstructions,
  createSampleData
}; 