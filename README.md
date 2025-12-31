# Geo Listing API

A Node.js/Express API application for managing and retrieving geographical data (Countries, States, and Cities). This project uses a MySQL database.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)

## Features

- **Countries**: Fetch all countries, filter by ID, ISO2 code, or region.
- **States**: Fetch all states, filter by ID, or get states related to a specific country (by ID or ISO2 code).
- **Cities**: Fetch cities filtered by Country code and State code.

## Prerequisites

- Node.js (v14 or higher recommended)
- MySQL Server

## Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```

2. Navigate to the project directory:
   ```bash
   cd geo-listing
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory.
2. Add your database configuration:

   ```env
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_NAME=your_db_name
   port=3000
   ```

## Running the Application

- **Development Mode**:
  ```bash
  node server.js
  ```

## API Documentation

### Countries

- **Get all countries**
  - `GET /api/countries`

- **Get country by ID**
  - `GET /api/countries/:id`

- **Get country by ISO2 code**
  - `GET /api/countries/iso/:iso2`
  - Example: `/api/countries/iso/IN`

- **Get countries by region**
  - `GET /api/countries/region/:region`
  - Example: `/api/countries/region/Asia`

### States

- **Get all states**
  - `GET /api/states`

- **Get state by ID**
  - `GET /api/states/:id`

- **Get states by Country ISO2 Code**
  - `GET /api/states/country/:iso2`
  - Example: `/api/states/country/IN`

- **Get states by Country ID**
  - `GET /api/states/country-id/:countryId`

### Cities

- **Get cities by Country Code and State Code (ISO2)**
  - `GET /api/cities/:country_code/:iso2`
  - Example: `/api/cities/IN/MH`
  - Returns cities in country `IN` and state `MH`.
