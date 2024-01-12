from pathlib import Path
from typing import Optional
import os

from pydantic_settings import BaseSettings
current_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class Settings(BaseSettings):
    LLM_NAME: str = "docsgpt"
    EMBEDDINGS_NAME: str = "huggingface_sentence-transformers/all-mpnet-base-v2"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"
    MONGO_URI: str = "mongodb://localhost:27017/docsgpt"
    MODEL_PATH: str = os.path.join(current_dir, "models/docsgpt-7b-f16.gguf")
    TOKENS_MAX_HISTORY: int = 150
    UPLOAD_FOLDER: str = "inputs"
    VECTOR_STORE: str = "faiss"  # "faiss" or "elasticsearch"

    API_URL: str = "http://localhost:7091"  # backend url for celery worker

    API_KEY: Optional[str] = None  # LLM api key
    EMBEDDINGS_KEY: Optional[str] = None  # api key for embeddings (if using openai, just copy API_KEY)
    OPENAI_API_BASE: Optional[str] = None  # azure openai api base url
    OPENAI_API_VERSION: Optional[str] = None  # azure openai api version
    AZURE_DEPLOYMENT_NAME: Optional[str] = None  # azure deployment name for answering
    AZURE_EMBEDDINGS_DEPLOYMENT_NAME: Optional[str] = None  # azure deployment name for embeddings

    # elasticsearch
    ELASTIC_CLOUD_ID: Optional[str] = None # cloud id for elasticsearch
    ELASTIC_USERNAME: Optional[str] = None # username for elasticsearch
    ELASTIC_PASSWORD: Optional[str] = None # password for elasticsearch
    ELASTIC_URL: Optional[str] = None # url for elasticsearch
    ELASTIC_INDEX: Optional[str] = "docsgpt" # index name for elasticsearch

    # SageMaker config
    SAGEMAKER_ENDPOINT: Optional[str] = None # SageMaker endpoint name
    SAGEMAKER_REGION: Optional[str] = None # SageMaker region name
    SAGEMAKER_ACCESS_KEY: Optional[str] = None # SageMaker access key
    SAGEMAKER_SECRET_KEY: Optional[str] = None # SageMaker secret key


path = Path(__file__).parent.parent.absolute()
settings = Settings(_env_file=path.joinpath(".env"), _env_file_encoding="utf-8")
