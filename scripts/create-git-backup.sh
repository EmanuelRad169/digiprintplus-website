#!/bin/bash

# Create a timestamp for the backup
timestamp=$(date +"%Y%m%d_%H%M%S")
backup_dir="git-backups"
backup_file="$backup_dir/backup_$timestamp.bundle"

# Create backup directory if it doesn't exist
mkdir -p "$backup_dir"

# Create a bundle of all branches
git bundle create "$backup_file" --all

echo "Created Git bundle backup at: $backup_file"
