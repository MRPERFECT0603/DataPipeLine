# DataPipeline - IoT Data Processing System

A comprehensive IoT data processing pipeline built with MQTT, Kafka, and MongoDB, designed to handle real-time sensor data collection, processing, and storage using Kubernetes orchestration.

## 🏗️ Architecture

```
IoT Sensors → MQTT Broker → MQTT-Kafka Bridge → Kafka → Batch Processor → MongoDB
```

The system consists of the following components:

- **MQTT Broker (HiveMQ)**: Receives sensor data from IoT devices
- **MQTT-Kafka Bridge**: Forwards MQTT messages to Kafka topics
- **Apache Kafka**: Message streaming platform for reliable data transfer
- **Apache Zookeeper**: Coordination service for Kafka
- **Batch Processor**: Consumes Kafka messages and stores data in MongoDB
- **MongoDB**: NoSQL database for persistent data storage

## 🚀 Features

- **Real-time Data Processing**: Handles continuous sensor data streams
- **Scalable Architecture**: Kubernetes-based deployment for easy scaling
- **Batch Processing**: Efficient batch insertion to MongoDB (configurable batch size)
- **Message Reliability**: Kafka ensures message delivery and persistence
- **Containerized Services**: All components run in Docker containers
- **Cloud Database**: MongoDB Atlas integration for cloud storage

## 📋 Prerequisites

- Kubernetes cluster (local or cloud)
- Docker
- kubectl configured
- MongoDB Atlas account (or local MongoDB instance)

## 🛠️ Installation & Deployment

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DataPipeline
```

### 2. Deploy Zookeeper

```bash
kubectl apply -f Project/zookeeperService.yaml
kubectl apply -f Project/kafkaServiceService.yaml
```

### 3. Deploy Kafka

```bash
kubectl apply -f Project/kafkaService.yaml
```

### 4. Deploy HiveMQ MQTT Broker

```bash
kubectl apply -f Project/hivemq.yaml
```

### 5. Deploy MQTT-Kafka Bridge

```bash
kubectl apply -f Project/Mqtt_kafka_bridge/bridge.yaml
kubectl apply -f Project/Mqtt_kafka_bridge/bridgeService.yaml
```

### 6. Create Namespace and Deploy Batch Processor

```bash
kubectl create namespace iotproject
kubectl apply -f Project/BatchProcessor/batchProcessor.yaml
kubectl apply -f Project/BatchProcessor/batchProcessorService.yaml
```

## 🔧 Configuration

### Environment Variables

#### Batch Processor
- `KAFKA_BROKER`: Kafka broker address (default: `kafka-service:9092`)
- `MONGODB_URI`: MongoDB connection string

#### MQTT-Kafka Bridge
- `MQTT_BROKER_HOST`: MQTT broker address (default: `hivemq-service:1883`)
- `KAFKA_BROKER_HOST`: Kafka broker address (default: `kafka-service:9092`)

### Topics and Subscriptions

- **MQTT Topic**: `testtopic/vivek`
- **Kafka Topic**: `vivek`
- **Batch Size**: 5 messages (configurable in batch processor)

## 📊 Data Flow

1. **IoT sensors** publish data to MQTT topic `testtopic/vivek`
2. **MQTT-Kafka Bridge** subscribes to MQTT topic and forwards messages to Kafka topic `vivek`
3. **Batch Processor** consumes messages from Kafka in batches
4. **MongoDB** stores processed data with timestamps

### Sample Data Structure

```json
{
  "distance": 25.5,
  "timestamp": "2024-07-11T10:30:00.000Z"
}
```

## 🐳 Docker Images

The project uses the following Docker images:

- **HiveMQ**: `hivemq/hivemq4:latest`
- **Kafka**: `wurstmeister/kafka:latest`
- **Zookeeper**: `wurstmeister/zookeeper:latest`
- **MQTT-Kafka Bridge**: `vivekshaurya/myhivemq:latest`
- **Batch Processor**: `vivekshaurya/batchprocessor:latest`

## 🔗 Service Endpoints

| Service | Port | NodePort | Purpose |
|---------|------|----------|---------|
| HiveMQ MQTT | 1883 | 30011 | MQTT messaging |
| HiveMQ Web | 8080 | 30012 | Web interface |
| Kafka | 9092 | 30092 | Kafka broker |
| Zookeeper | 2181 | 30181 | Kafka coordination |

## 📁 Project Structure

```
DataPipeline/
├── Project/
│   ├── hivemq.yaml                    # HiveMQ MQTT broker deployment
│   ├── kafkaService.yaml              # Kafka deployment
│   ├── kafkaServiceService.yaml       # Kafka service configuration
│   ├── zookeeperService.yaml          # Zookeeper deployment
│   ├── BatchProcessor/
│   │   ├── batchProcessor.yaml        # Batch processor deployment
│   │   ├── batchProcessorService.yaml # Batch processor service
│   │   ├── dockerfile                 # Batch processor Docker image
│   │   ├── index.js                   # Batch processor main logic
│   │   ├── model.js                   # MongoDB schema
│   │   └── package.json               # Node.js dependencies
│   ├── Mqtt_kafka_bridge/
│   │   ├── bridge.yaml                # Bridge deployment
│   │   ├── bridgeService.yaml         # Bridge service
│   │   ├── dockerfile                 # Bridge Docker image
│   │   ├── index.js                   # Bridge main logic
│   │   └── package.json               # Node.js dependencies
│   └── mosquito/                      # Alternative MQTT broker (Eclipse Mosquitto)
│       ├── mosquitto-config.yaml
│       ├── mosquitto-password.yaml
│       └── mosquitto.yaml
└── README.md
```

## 🧪 Testing

### Publishing Test Data

You can test the pipeline by publishing MQTT messages:

```bash
# Using mosquitto_pub (if installed)
mosquitto_pub -h <your-k8s-node-ip> -p 30011 -t testtopic/vivek -m '{"distance": 42.3}'

# Using any MQTT client
# Connect to: <your-k8s-node-ip>:30011
# Topic: testtopic/vivek
# Message: {"distance": 25.5}
```

### Monitoring

Check the logs of different components:

```bash
# Check batch processor logs
kubectl logs -n iotproject deployment/batch-processor

# Check MQTT-Kafka bridge logs
kubectl logs deployment/mqtt-kafka-bridge

# Check Kafka logs
kubectl logs deployment/kafka-deployment
```

## 🔍 Troubleshooting

### Common Issues

1. **Kafka Connection Issues**
   - Ensure Zookeeper is running before Kafka
   - Check service names and ports in configurations

2. **MQTT Connection Issues**
   - Verify HiveMQ service is accessible
   - Check NodePort configurations

3. **MongoDB Connection Issues**
   - Verify MongoDB URI is correct
   - Check network connectivity to MongoDB Atlas

### Useful Commands

```bash
# Check pod status
kubectl get pods -A

# Check services
kubectl get svc

# Port forward for local testing
kubectl port-forward svc/hivemq-service 1883:1883
```

## 🚀 Scaling

To scale the components:

```bash
# Scale Kafka replicas
kubectl scale deployment kafka-deployment --replicas=3

# Scale batch processor
kubectl scale deployment batch-processor --replicas=2 -n iotproject
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Author

**Vivek Shaurya**

## 📞 Support

For questions or issues, please open an issue in the GitHub repository.

---

⭐ If you found this project helpful, please give it a star!