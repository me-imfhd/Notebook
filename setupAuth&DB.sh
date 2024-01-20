#!/bin/bash

echo "DATABASE_URL=postgresql://dev:dev@localhost:5432/notebook?schema=public" > .env
echo "# when in production set NEXTAUTH_URL to your actual domain " >> .env
echo "NEXTAUTH_URL=http://localhost:3000" >> .env
echo "NEXTAUTH_SECRET=ULMiwT6Tz9cyW5AtIisLmY9H3gS5sfKzUCdc6w47hq0=" >> .env

read -p "Please enter your GOOGLE_CLIENT_ID key (press enter to skip): " GOOGLE_CLIENT_ID
echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> .env
read -p "Please enter your GOOGLE_CLIENT_SECRET key (press enter to skip): " GOOGLE_CLIENT_SECRET
echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> .env
read -p "Please enter your DISCORD_CLIENT_ID key (press enter to skip): " DISCORD_CLIENT_ID
echo "DISCORD_CLIENT_ID=$DISCORD_CLIENT_ID" >> .env
read -p "Please enter your DISCORD_CLIENT_SECRET key (press enter to skip): " DISCORD_CLIENT_SECRET
echo "DISCORD_CLIENT_SECRET=$DISCORD_CLIENT_SECRET" >> .env
read -p "Please enter your FACEBOOK_CLIENT_ID key (press enter to skip): " FACEBOOK_CLIENT_ID
echo "FACEBOOK_CLIENT_ID=$FACEBOOK_CLIENT_ID" >> .env
read -p "Please enter your FACEBOOK_CLIENT_SECRET key (press enter to skip): " FACEBOOK_CLIENT_SECRET
echo "FACEBOOK_CLIENT_SECRET=$FACEBOOK_CLIENT_SECRET" >> .env

docker compose build && docker compose up -d