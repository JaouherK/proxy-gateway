A Microservices API Gateway Built Using Typescript (test)
----
![v0.2.0](https://img.shields.io/badge/version-0.2.0-green)

Proxy Gateway is an API gateway that hovers over microservices or serverless architecture. It is completely dissociated from the stack used for the other services. It secures and exposes your services with a complete control over all its functionality and behaviour.

This can be extended by creating or adding express middlewares.

This repository exposes an API interface to manage these routs. A frontend interface (initially in angular) will help you manage your gateway. Being built as a library will help you integrate it easily within any js interface.  

---
#### Main Features
- Proxy gateway for APIs of Microservices and Serverless architecture
- Interface to create mocks for the expected routes (Very handy for developers)
- Full control to the level of the methods used
- Developed with Express and Typescript
- API interface to manage it
- Integrates with frontend library
- Processes authenticated and public 
- Included a Postman collection to start testing your API interface
- Output logs ready for easy parsing by logstash or Splunk
- Logging for major requests and incidents with levels of seriousness
- Logging uses tags to easily be fetched through logs grabber 

---
#### Installation
After having installed Node globally, execute the following command:

```bash
$ git clone git@github.com:JaouherK/proxy-gateway.git
$ cd proxy-gateway
$ npm install
```

#### Configuration

In your db server currently only mysql (but easily changes to any of the following: mariadb,sqlite,postgres,mssql) and create a database like ```gateway```.

Open the config file within ```src``` folder and update the needed values 

```javascript
const defaultConfig = {
    port: 3232,  //the port that will be used to expose the app
    jsonLimit: '20mb',
    dialect:"mysql",
    host: "localhost",
    database: "gateway",
    username: "root",
    password: "password",
};
```

#### Ignition

##### Solution 1 - Using Docker compose

Execute the following command to start the docker container:
```bash
$ docker-compose up
```
This compose will start also a mysql container

##### Solution 2 - Starting the node server locally 
Execute the following command to start the server:
```bash
$ yarn build
$ yarn start
```

For development purposes you can use this nodemon ignition 
```bash
$ yarn start:watch
```

this will initialize the database and its tables if not exist. It will also expose initially the Manager and health check routes. Use the Postman collection to start creating your routing system.

---
#### Contribution
All contributions welcome! Please see the [contributor's guide](contributor-guide)& [code of conduct](CODE_OF_CONDUCT.md)

#### Report security issue

Please check [security](SECURITY.md)

#### License

[MIT License](LICENSE)
