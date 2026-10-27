# Infrastructure

This directory is reserved for shared deployment configuration.

The current OTP service still has its service-local
`services\otp-service\docker-compose.yml`, which starts the OTP API and Redis.
The vendor service and frontend do not yet have container definitions, so a
root Compose file is intentionally not added during this reorganization.

Future infrastructure work can add:

- a root Compose file for all current applications
- MongoDB and Redis development dependencies
- Nginx or an API gateway
- service-specific Dockerfiles
- deployment environment templates
