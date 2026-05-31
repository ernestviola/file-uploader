# File Uploader

A google drive like application where users can upload and share files.

## Features

Clickable folder structure
Sharable links that can either link to the file or folder

- Shares the entire folder for the entire TTL

## Build Plan

logo
navbar
storage usage status

## Architecture

The pattern for this system is MVC and we're hosting our application and database on Google Cloud Platform. The server is sitting on a container in Cloud Run and the database on Cloud SQL.

### Architecture Design

```mermaid
flowchart LR
  client[Client Browser]


  subgraph gcp[☁️ Google Cloud Platform]
    subgraph gcr[Google Cloud Run]
      express[Express Server]
    end
    subgraph gsql[Google Cloud SQL]
      db[(PostgreSQL DB)]
    end
  end

  client <-->|HTTPS| express
  express <-->|Google Private Network| db



  style db fill:#336791,stroke:#1a3a52,color:#fff
  style express fill:#68a063,stroke:#2d5016,color:#fff
```

### System Design

```mermaid
flowchart RL
  client
  express[Express Server]
  passport
  session
  database

  subgraph express[Express Server]
    passport
    session
  end


  express -->|session ID| client
  client -->|username/password| express
  express <-->|data| database
```

### Database Design

```mermaid
erDiagram
  USER ||--o{FILE : ""
  USER ||--o{FOLDER : ""
  FOLDER ||--o{FOLDER_CHILDREN : ""
  LINK ||--||FOLDER:""
  LINK ||--||FILE:""

  USER {
    int id PK
    string username
    string password
  }

  FILE {
    int id PK
    int ownerId FK
  }

  FOLDER {
    int id PK
    int ownerId FK
  }

  FOLDER_OBJECT {
    int folderID FK
    int objectID FK
    string objectType
  }

  LINK {
    string id PK
    int objectId FK
    string objectType
    datetime TTL
  }

```

## Installation

## Attributions

CSS reset from [Josh Comeau](https://www.joshwcomeau.com/css/custom-css-reset/)

### Icons and Assets

[Pdf icons created by Dimitry Miroliubov - Flaticon](https://www.flaticon.com/free-icons/pdf)

[Logos icons created by pocike - Flaticon](https://www.flaticon.com/free-icons/logos)

[Microsoft access file icons created by Pixel perfect - Flaticon](https://www.flaticon.com/free-icons/microsoft-access-file)

[Mp3 icons created by Shahryar MInhas - Flaticon](https://www.flaticon.com/free-icons/mp3)

Icons from google fonts
