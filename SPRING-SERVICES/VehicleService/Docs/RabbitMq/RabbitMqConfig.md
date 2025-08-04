# 🛠️ `RabbitConfig.java` — VehicleService Messaging Configuration (RabbitMQ)

This configuration class defines **queues**, **exchanges**, and **bindings** used by the VehicleService microservice to **receive dispatch events** and **vehicle tracking updates** via RabbitMQ.

It uses **Fanout** and **Direct** exchanges to consume and route messages across various event domains.

---

## 📦 Exchanges, Queues, and Bindings

### 📨 1. Dispatch Created Event (Direct Exchange)

| Name          | Value                                    |
| ------------- | ---------------------------------------- |
| Exchange Type | `DirectExchange`                         |
| Exchange      | `dispatch.created.exchange`              |
| Routing Key   | `dispatch.created.key`                   |
| Queue         | `vehicle.service.created.dispatch.queue` |

> **Purpose**: Receives direct message when a dispatch is created.

---

### ✅ 2. Dispatch Validated (Fanout from Dispatch Service)

| Name          | Value                                                                       |
| ------------- | --------------------------------------------------------------------------- |
| Exchange Type | `FanoutExchange`                                                            |
| Exchange      | `dispatch.validated.fanOut.provider.dispatch`                               |
| Queue         | `validated.dispatch.fanOut.provider.dispatch.service.queue.vehicle.service` |

> **Purpose**: Receives broadcast when a dispatch is validated and ready for progression.

---

### 🛑 3. Dispatch Completed (Fanout from Dispatch Service)

| Name          | Value                                                                       |
| ------------- | --------------------------------------------------------------------------- |
| Exchange Type | `FanoutExchange`                                                            |
| Exchange      | `completed.dispatch.fanOut.provider.dispatch.service`                       |
| Queue         | `completed.dispatch.fanOut.provider.dispatch.service.queue.vehicle.service` |

> **Purpose**: Listens for confirmation when a dispatch is marked complete by the DispatchService.

---

### 📍 4. Vehicle Location Update (Fanout from Logs Service)

| Name          | Value                                                            |
| ------------- | ---------------------------------------------------------------- |
| Exchange Type | `FanoutExchange`                                                 |
| Exchange      | `tracking.checkPoint.fanOut.provider.logs`                       |
| Queue         | `tracking.checkPoint.fanOut.provider.logs.queue.vehicle.service` |

> **Purpose**: Receives GPS/location updates for a vehicle during a dispatch.

---

### 🧾 5. Dispatch Completed (Fanout from Logs Service)

| Name          | Value                                                           |
| ------------- | --------------------------------------------------------------- |
| Exchange Type | `FanoutExchange`                                                |
| Exchange      | `completed.dispatch.fanOut.provider.logs`                       |
| Queue         | `completed.dispatch.fanOut.provider.logs.queue.service.vehicle` |

> **Purpose**: Backup or late delivery of completed dispatch information sent from the Logs service.

---

### ▶️ 6. Start Tracking (Fanout from Logs Service)

| Name          | Value                                               |
| ------------- | --------------------------------------------------- |
| Exchange Type | `FanoutExchange`                                    |
| Exchange      | `start.tracking.fanOut.provider.logs`               |
| Queue         | `start.tracking.fanOut.provider.logs.queue.vehicle` |

> **Purpose**: Starts tracking a vehicle when a dispatch begins, as informed by LogsService.

---

## 🔄 Rabbit Template & JSON Message Converter

These beans enable message sending and automatic JSON serialization:

```java
@Bean
public Jackson2JsonMessageConverter jackson2JsonMessageConverter()
```

```java
@Bean
public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory)
```

* Sets message converter to JSON for seamless message mapping.
* `RabbitTemplate` can now be autowired in services to publish events.

---

## 📘 Summary Diagram (Text-based)

```plaintext
+---------------------------+         +-------------------+
|   DispatchService         |         |   LogsService     |
|     (Fanout Emit)         |         |    (Fanout Emit)  |
+---------------------------+         +-------------------+
             |                                 |
    --------------------             --------------------
   | validated.fanOut  |           | completed.fanOut     |
   | completed.fanOut  |           | start.tracking.fanOut|
   +-------------------+           +----------------------+
             |                                 |
             v                                 v
+----------------------------+     +----------------------------+
|     VehicleService Queues  |     |  VehicleService Queues     |
|  (one per exchange/route)  |     |  (one per fanout event)    |
+----------------------------+     +----------------------------+
```

---

## 🧠 Usage Tips

* All queues are **durable**, ensuring message persistence.
* Binding order **does not matter** as long as exchange and queue names are consistent.
* For publish-confirmation or consumer acknowledgment, consider enabling publisher confirms or using `@RabbitListener`.

---
