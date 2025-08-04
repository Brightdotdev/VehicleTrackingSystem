


# 📡 RabbitMQ Configuration (`RabbitMqConfig.java`)

Located in: `com.example.DispatchService.RabbitMq`

This configuration class defines the **message broker topology** used by the DispatchService to send and receive events via RabbitMQ. It handles queue, exchange, binding setup, and JSON message conversion.

---

## 🧩 Overview

The configuration enables communication with other microservices (like Logs and Tracking Services) using a mix of **Direct** and **Fanout Exchanges**:

* `FanoutExchange`: Broadcast messages to all bound queues (used for events).
* `DirectExchange`: Route messages based on routing keys (used for request-response flows).
* All exchanges/queues are durable (`true`), ensuring persistence across broker restarts.

---

## 🔁 Exchange Topology Summary

| Exchange Type | Name                                                  | Used For                                             | Direction |
| ------------- | ----------------------------------------------------- | ---------------------------------------------------- | --------- |
| `Direct`      | `dispatch.created.exchange`                           | Sending dispatch creation events (with response)     | Send      |
| `Fanout`      | `dispatch.created.fanOut`                             | Fire-and-forget dispatch creation broadcast          | Send      |
| `Fanout`      | `dispatch.validated.fanOut.provider.dispatch`         | Admin validated dispatch event                       | Send      |
| `Fanout`      | `completed.dispatch.fanOut.provider.dispatch.service` | Completed/cancelled dispatch event                   | Send      |
| `Fanout`      | `completed.dispatch.fanOut.provider.logs`             | Incoming dispatch-completed events from Logs service | Receive   |
| `Fanout`      | `start.tracking.fanOut.provider.logs`                 | Incoming start-tracking events from Tracking service | Receive   |

---

## 📬 Queues & Bindings (Consumers)

### ✅ `completedDispatchFromLogsQueue`

| Purpose    | Listens for completed dispatch events from the Logs service      |
| ---------- | ---------------------------------------------------------------- |
| Queue Name | `completed.dispatch.fanOut.provider.logs.queue.service.dispatch` |
| Bound To   | `completed.dispatch.fanOut.provider.logs`                        |
| Durable    | ✅                                                                |

### ✅ `startTrackingFromTrackingServiceQueue`

| Purpose    | Receives start-tracking events to transition to `IN_PROGRESS` |
| ---------- | ------------------------------------------------------------- |
| Queue Name | `start.tracking.fanOut.provider.logs.queue.dispatch`          |
| Bound To   | `start.tracking.fanOut.provider.logs`                         |
| Durable    | ✅                                                             |

---

## ⚙️ Beans Defined

### 🔃 Exchanges

```java
@Bean
public FanoutExchange dispatchValidatedFanOutFromDispatchService() { ... }

@Bean
public FanoutExchange dispatchCompletedFanOutFromDispatchService() { ... }

@Bean
public DirectExchange dispatchCreatedDirectExchange() { ... }
```

All fanouts are configured with:

```java
new FanoutExchange("exchange-name", true, false);
```

> `true`: durable, `false`: not auto-deleted

---

### 📦 Queues

```java
@Bean
public Queue completedDispatchFromLogsQueue() { ... }

@Bean
public Queue startTrackingFromTrackingServiceQueue() { ... }
```

> All queues are durable, non-exclusive, non-auto-delete.

---

### 🔗 Bindings

```java
@Bean
public Binding completedDispatchFromLogsBonding(...) { ... }

@Bean
public Binding startTrackingFromTrackingServiceBinding(...) { ... }
```

---

### 📤 RabbitTemplate & Converter

```java
@Bean
public Jackson2JsonMessageConverter jackson2JsonMessageConverter() { ... }

@Bean
public RabbitTemplate rabbitTemplate(...) {
    ...
    template.setReplyTimeout(5000); // Timeout for RPC-style interactions
}
```

* Ensures all outgoing messages are sent as **JSON**
* Enables automatic serialization/deserialization of Java objects
* Configures a **5-second reply timeout** for direct exchange communication

---

## 🔁 Flow Examples

### 1. **Dispatch Creation**

* Send:

    * To `dispatch.created.exchange` via `DirectExchange` for request-response
    * Also fire-and-forget to `dispatch.created.fanOut` for broadcasting

### 2. **Dispatch Validation (Admin Action)**

* Broadcast to: `dispatch.validated.fanOut.provider.dispatch`

### 3. **Dispatch Completion (Both User/Admin)**

* Broadcast to: `completed.dispatch.fanOut.provider.dispatch.service`

### 4. **External Events from Logs/Tracking**

* Listen to:

    * `completed.dispatch.fanOut.provider.logs.queue.service.dispatch`
    * `start.tracking.fanOut.provider.logs.queue.dispatch`

---

## 📄 Summary Table

| Component                                    | Type             | Purpose                                |
| -------------------------------------------- | ---------------- | -------------------------------------- |
| `dispatchCreatedDirectExchange`              | `DirectExchange` | Request-response for dispatch creation |
| `dispatchCreatedNoResponseFanOut`            | `FanoutExchange` | Fire-and-forget creation broadcast     |
| `dispatchValidatedFanOutFromDispatchService` | `FanoutExchange` | Broadcast admin-validated dispatch     |
| `dispatchCompletedFanOutFromDispatchService` | `FanoutExchange` | Broadcast completed/cancelled dispatch |
| `completedDispatchFromLogs`                  | `FanoutExchange` | Receive completed events from logs     |
| `startTrackingFromTrackingService`           | `FanoutExchange` | Receive tracking start events          |
| `rabbitTemplate`                             | Bean             | Sends messages via RabbitMQ            |
| `jackson2JsonMessageConverter`               | Bean             | Converts Java ↔ JSON for payloads      |

---

