# Dockerfile
FROM continuumio/miniconda3

WORKDIR /app-backend

# Create the environment:
COPY requirement.yml .
RUN conda env create -f requirement.yml

# Make RUN commands use the new environment:
RUN echo "conda activate flask" >> ~/.bashrc
SHELL ["/bin/bash", "--login", "-c"]

# Demonstrate the environment is activated:
RUN echo "Make sure flask is installed:"
RUN python -c "import flask"

# The code to run when container is started:
EXPOSE 8000
COPY server.py .
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]