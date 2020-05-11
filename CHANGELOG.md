# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased


## [0.2.0] - 2020-05-11
### Added
- HTTP response codes as constants 
- Get speed limiter configs from config file & refactor relative code
- Get Helmet config from config file & refactor relative code

### Changed
- Refactoring logger, router, cron job, config and cluster config
- Fix cluster issue
- fix delete recursive of resources
- Refactor Manager router

## [0.1.0] - 2020-01-29

### Added
- Initial NodeJs app
- Initial logging approach
- Make docker-compose that serves mysql DB in addition to proxy-gateway
- API keys generation and management
- Dynamic routing using proxies table
- Namespace, Resources and Methods management to generate proxies
- use chalk for output logs
- Add validation for inputs
- Minimum authentication interface
- Create demoMode to bypass JWT and role validation
- Interface to manage users
- Create nodeJs clustering for higher availability  
