#!/bin/bash

echo "DATABASE_URL=postgresql://dev:dev@localhost:5432/notebook?schema=public" > .env
echo "# when in production set NEXTAUTH_URL to your actual domain " >> .env
echo "NEXTAUTH_URL=http://localhost:3000" >> .env
echo "NEXTAUTH_SECRET=ULMiwT6Tz9cyW5AtIisLmY9H3gS5sfKzUCdc6w47hq0=" >> .env
read -p "Please enter your NOTION_INTEGRATION_TOKEN API key: " NOTION_INTEGRATION_TOKEN
echo "NOTION_INTEGRATION_TOKEN=$NOTION_INTEGRATION_TOKEN" >> .env
read -p "Please enter your GOOGLE_CLIENT_ID API key: " GOOGLE_CLIENT_ID
echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" >> .env
read -p "Please enter your GOOGLE_CLIENT_SECRET API key: " GOOGLE_CLIENT_SECRET
echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" >> .env
read -p "Please enter your DISCORD_CLIENT_ID API key: " DISCORD_CLIENT_ID
echo "DISCORD_CLIENT_ID=$DISCORD_CLIENT_ID" >> .env
read -p "Please enter your DISCORD_CLIENT_SECRET API key: " DISCORD_CLIENT_SECRET
echo "DISCORD_CLIENT_SECRET=$DISCORD_CLIENT_SECRET" >> .env
read -p "Please enter your FACEBOOK_CLIENT_ID API key: " FACEBOOK_CLIENT_ID
echo "FACEBOOK_CLIENT_ID=$FACEBOOK_CLIENT_ID" >> .env
read -p "Please enter your FACEBOOK_CLIENT_SECRET API key: " FACEBOOK_CLIENT_SECRET
echo "FACEBOOK_CLIENT_SECRET=$FACEBOOK_CLIENT_SECRET" >> .env

# Function to prompt the user for their choice
prompt_user() {
    echo "Do you want to:"
    echo "1. Use DocsGPT public API (simple and free)"
    echo "2. Download the language model locally (12GB)"
    echo "3. Use the OpenAI API (requires an API key)"
    read -p "Enter your choice (1, 2 or 3): " choice
}

# Function to handle the choice to download the model locally
download_locally() {
    echo "LLM_NAME=llama.cpp" >> .env
    echo "VITE_API_STREAMING=true" >> .env
    echo "EMBEDDINGS_NAME=huggingface_sentence-transformers/all-mpnet-base-v2" >> .env
    echo "The .env file has been created with LLM_NAME set to llama.cpp."

    # Creating the directory if it does not exist
    mkdir -p models
    
    # Downloading the model to the specific directory
    echo "Downloading the model..."
    # check if docsgpt-7b-f16.gguf does not exist
    if [ ! -f models/docsgpt-7b-f16.gguf ]; then
        echo "Downloading the model..."
        wget -P models https://d3dg1063dc54p9.cloudfront.net/models/docsgpt-7b-f16.gguf
        echo "Model downloaded to models directory."
    else
        echo "Model already exists."
    fi
   
    docker-compose -f docker-compose-local.yaml build && docker-compose -f docker-compose-local.yaml up -d
    #python -m venv venv
    #source venv/bin/activate
    pip install -r application/requirements.txt
    pip install llama-cpp-python
    pip install sentence-transformers
    export LLM_NAME=llama.cpp
    export EMBEDDINGS_NAME=huggingface_sentence-transformers/all-mpnet-base-v2
    export FLASK_APP=application/app.py
    export FLASK_DEBUG=true
    export CELERY_BROKER_URL=redis://localhost:6379/0
    export CELERY_RESULT_BACKEND=redis://localhost:6379/1
    echo "The application is now running on http://localhost:5173"
    echo "You can stop the application by running the following command:"
    echo "Ctrl + C and then"
    echo "Then pkill -f 'flask run' and then"
    echo "docker-compose down"
    flask run --host=0.0.0.0 --port=7091 &
    celery -A application.app.celery worker -l INFO
}

# Function to handle the choice to use the OpenAI API
use_openai() {
    read -p "Please enter your OpenAI API key: " api_key
    echo "API_KEY=$api_key" >> .env
    echo "LLM_NAME=openai" >> .env
    echo "VITE_API_STREAMING=true" >> .env
    echo "The .env file has been created with API_KEY set to your provided key."

    docker compose build && docker compose up -d
    pnpm build
    pnpm start

    echo "The application will run on http://localhost:5173"
    echo "You can stop the application by running the following command:"
    echo "docker compose down"
}

use_docsgpt() {
    echo "LLM_NAME=docsgpt" >> .env
    echo "VITE_API_STREAMING=true" >> .env
    echo "The .env file has been created with API_KEY set to your provided key."

    docker-compose build && docker-compose up -d

    echo "The application will run on http://localhost:5173"
    echo "You can stop the application by running the following command:"
    echo "docker-compose down"
}

# Prompt the user for their choice
prompt_user

# Handle the user's choice
case $choice in
    1)
        use_docsgpt
        ;;
    2)
        download_locally
        ;;
    3)
        use_openai
        ;;
    *)
        echo "Invalid choice. Please choose either 1 or 2."
        ;;
esac
