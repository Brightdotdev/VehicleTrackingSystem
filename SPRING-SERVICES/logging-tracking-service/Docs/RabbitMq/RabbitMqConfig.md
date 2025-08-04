## 📘 `RabbitConfig.md` — RabbitMQ Exchange & Queue Documentation


# 🛸 RabbitMQ Configuration - Logging Service

This service acts as both a **consumer and publisher** of events from various RabbitMQ exchanges. Below are all exchange–queue bindings.

---

## 📥 Receiver Configuration

### 1. 🎯 `admin.created.exchange` (Direct Exchange)

| Property     | Value                            |
|--------------|----------------------------------|
| Exchange     | `admin.created.exchange`         |
| Queue        | `logs.service.created.admin.queue` |
| Routing Key  | `admin.created.key`              |
| Type         | Direct                           |
| Purpose      | Receives events when a new admin is created in another service.

---

### 2. 🚛 `dispatch.created.fanOut` (Fanout Exchange)

| Exchange     | `dispatch.created.fanOut`                      |
| Queue        | `log.service.dispatch.created.fanout.queue`    |
| Purpose      | Receives new dispatch events broadcast from the Dispatch Service.

---

### 3. ✅ `completed.dispatch.fanOut.provider.dispatch.service` (Fanout)

| Queue        | `completed.dispatch.fanOut.provider.dispatch.service.queue.logs.service` |
| Purpose      | Triggered when a dispatch is marked as completed by Dispatch Service.

---

### 4. 🚀 `start.tracking.fanOut.provider.logs` (Fanout - Loopback)

| Queue        | `start.tracking.fanOut.provider.logs.queue.logs` |
| Purpose      | Listens to dispatch start-tracking events broadcast by self or other logs.

---

### 5. 🛡️ `dispatch.validated.fanOut.provider.dispatch` (Fanout)

| Queue        | `validated.dispatch.fanOut.provider.dispatch.service.queue.logs.service` |
| Purpose      | Receives validated dispatch events for logs to act on.

---

## 📤 Sender Configuration

### 1. 🧾 `completed.dispatch.fanOut.provider.logs`

| Exchange     | `completed.dispatch.fanOut.provider.logs` |
| Type         | Fanout                                    |
| Purpose      | Publishes completion event to all consumers.

---

### 2. 🛰️ `start.tracking.fanOut.provider.logs`

| Type     | Fanout |
| Purpose  | Notifies other services that tracking has started.

---

### 3. 📍 `tracking.checkPoint.fanOut.provider.logs`

| Type     | Fanout |
| Purpose  | Sends every tracking checkpoint (even if masochistic 😉).

---

## 🛠️ Common Configuration

### 🔁 JSON Message Converter

```java
@Bean
public Jackson2JsonMessageConverter jackson2JsonMessageConverter()
````

Allows all messages to be converted to/from JSON automatically.

---

### 🧪 RabbitTemplate Bean

```java
@Bean
public RabbitTemplate rabbitTemplate(...)
```

Used for sending messages to any exchange programmatically.

---

