#!/bin/bash

# Script to run the category migration

# Check if the environment variables are set
if [ -z "$SANITY_STUDIO_PROJECT_ID" ] || [ -z "$SANITY_STUDIO_DATASET" ] || [ -z "$SANITY_API_TOKEN" ]; then
    echo "Error: Required environment variables are not set"
    echo "Please make sure the following variables are set:"
    echo "- SANITY_STUDIO_PROJECT_ID"
    echo "- SANITY_STUDIO_DATASET"
    echo "- SANITY_API_TOKEN"
    exit 1
fi

# Run the migration script
echo "Starting category migration..."
npx ts-node migrations/migrate-categories.ts

# Check if the migration was successful
if [ $? -eq 0 ]; then
    echo "Migration completed successfully!"
    echo "You can now restart Sanity Studio to see the changes"
else
    echo "Migration failed. Please check the error messages above"
fi
