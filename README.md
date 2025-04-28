# Vehicle Tracking System 🚗 📍

A comprehensive solution designed for car companies to manage and track their vehicle dispatches in real-time.

## Overview

The Vehicle Tracking System enables car companies to efficiently manage their fleet by tracking vehicle dispatches, monitoring vehicle conditions, and calculating safety scores. The system enforces safety protocols by preventing vehicles with safety scores below 63 from being dispatched.

## Key Features

- **Dispatch Management**: Create, update, and manage vehicle dispatches
- **Safety Scoring**: Calculate and store safety scores based on vehicle conditions
- **Real-time Updates**: Receive live updates via WebSocket on vehicle status and dispatches
- **Kafka Integration**: Leverage event-driven communication between services
- **Microservices Architecture**: Modular design with specialized services

## System Architecture

The system is built on a microservices architecture with the following components:

- **Dispatch Service**: Manages vehicle dispatch operations
- **Vehicle Service**: Handles vehicle information and status
- **Live Update Service**: Provides real-time data to clients
- **Gateway Service**: Routes requests between microservices

## Technologies Used

- **Backend**:
  - Spring Boot
  - Spring Cloud Gateway
  - Kafka
  - WebSockets

- **Frontend**:
  - React


- **DevOps**:
  - Docker

## Safety Score

The system calculates a safety score for each vehicle based on its current condition. This score is crucial for determining dispatch eligibility:

- Safety score >= 63: Vehicle eligible for dispatch
- Safety score < 63: Vehicle ineligible for dispatch

## Real-time Capabilities

The system provides real-time updates on:
- Vehicle locations
- Vehicle conditions
- Dispatch status
