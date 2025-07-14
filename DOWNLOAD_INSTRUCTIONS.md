# How to Download the MongoDB Dashboard Project

There are several ways to download all the code from this project. Choose the method that works best for you:

## Option 1: Download as TAR.GZ File

1. We've already created a tar.gz archive of the project:
   ```bash
   # This has already been done
   cd /workspace
   tar -czvf mongo-dashboard.tar.gz mongo-dashboard
   ```

2. Download the tar.gz file:
   - If you're using a platform like GitHub Codespaces or similar, you can right-click on the `mongo-dashboard.tar.gz` file in the file explorer and select "Download".
   - Alternatively, you can use the download functionality of your development environment.
   
3. Extract the archive on your local machine:
   ```bash
   # On Linux/Mac
   tar -xzvf mongo-dashboard.tar.gz
   
   # On Windows
   # Use a tool like 7-Zip, WinRAR, or Windows built-in extraction

## Option 2: Clone from GitHub (After Pushing)

If you've pushed the code to GitHub:

1. Open a terminal on your local machine
2. Run:
   ```bash
   git clone https://github.com/ChenLipschitz/frontendProject.git
   ```
3. This will create a copy of the repository on your local machine

## Option 3: Use scp or rsync (If You Have SSH Access)

If you have SSH access to the server:

1. On your local machine, run:
   ```bash
   # Using scp
   scp -r username@server:/workspace/mongo-dashboard /local/destination/path

   # Or using rsync (more efficient for large projects)
   rsync -avz username@server:/workspace/mongo-dashboard /local/destination/path
   ```

## Option 4: Use a File Transfer Tool

You can use tools like FileZilla, WinSCP, or Cyberduck to download the files:

1. Connect to your server using SFTP
2. Navigate to `/workspace/mongo-dashboard`
3. Download the entire directory to your local machine

## Project Structure

Once downloaded, you'll have the following structure:

```
mongo-dashboard/
├── backend/             # Node.js Express backend
│   ├── server.js        # Main server file
│   ├── .env             # Environment variables
│   ├── mongodb-connection.js # MongoDB connection module (for future use)
│   └── package.json     # Backend dependencies
├── frontend/            # React TypeScript frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   ├── types/       # TypeScript interfaces
│   │   └── App.tsx      # Main application component
│   ├── package.json     # Frontend dependencies
│   └── tsconfig.json    # TypeScript configuration
└── run-app.sh           # Script to run both servers
```

## Running the Project Locally

After downloading:

1. Install dependencies:
   ```bash
   cd mongo-dashboard/backend
   npm install
   
   cd ../frontend
   npm install
   ```

2. Start the servers:
   ```bash
   cd ..
   ./run-app.sh
   ```

3. Access the application:
   - Backend: http://localhost:12000
   - Frontend: http://localhost:12001