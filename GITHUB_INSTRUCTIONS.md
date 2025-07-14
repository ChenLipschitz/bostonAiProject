# GitHub Instructions

This document provides instructions on how to push this project to your GitHub repository.

## Prerequisites

- A GitHub account
- Git installed on your machine
- A GitHub repository (e.g., https://github.com/ChenLipschitz/frontendProject.git)

## Steps to Push to GitHub

1. Configure Git with your credentials:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. Add the remote repository:
   ```bash
   git remote add origin https://github.com/ChenLipschitz/frontendProject.git
   ```

3. Push to GitHub:
   ```bash
   # If your default branch is 'master'
   git push -u origin master

   # If your default branch is 'main'
   git push -u origin main
   ```

4. If prompted for credentials, enter your GitHub username and personal access token (not your password).

## Creating a Personal Access Token

If you need to create a personal access token:

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Click "Generate new token"
3. Give it a name, select the appropriate scopes (at least 'repo')
4. Click "Generate token"
5. Copy the token and use it as your password when pushing

## Alternative: Using GitHub CLI

You can also use GitHub CLI for authentication:

1. Install GitHub CLI: https://cli.github.com/
2. Authenticate with: `gh auth login`
3. Push to GitHub as usual

## Troubleshooting

If you encounter issues:

- Check that your remote URL is correct: `git remote -v`
- Ensure you have the correct permissions for the repository
- Verify your credentials are correct
- Try using HTTPS instead of SSH or vice versa