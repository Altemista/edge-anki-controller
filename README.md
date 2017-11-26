# Controller for Anki Overdrive 
This controller receives commands via Kafka (topic: Control) and relays them to Anki Overdrive 
cars through Bluetooth LE. Currently, the BLE libraray only workds on newer MacBooks with 
Bluetooth 4.0 stacks. Windows or Unix machines are currently not supported by the underlying
library.

## Configuration
First and foremost install the dependencies using:
```
npm install
```

The controller needs the car IDs to connect to the cars. The IDs can be retrieved using the 
doscovery service:
```
node discover.js
```

Pick the ID of the car and and create a `config-car1.properties`from the sample configuration 
provided. Sample configuration for a car from Ensō:
```
# Bluetooth config (mandatory)

# Car ID from discivery
carid=adf93c91ff4543638bfd905af63a4a36

# Start lane: 1/right - 4/left, clockwise, default: 1
startlane=1
```

## Running locally
The service can be started locally by running
```
node controller.js
```

Kafka messages can be produced and consumed from command line using:
```
kafkacat -P -b 127.0.0.1:9092 -t Command
kafkacat -C -b 127.0.0.1:9092 -t Status
```

## References
* [node](https://nodejs.org/en/download/)
* [npm](https://docs.npmjs.com/getting-started/installing-node)
* [git](https://git-scm.com/downloads)
