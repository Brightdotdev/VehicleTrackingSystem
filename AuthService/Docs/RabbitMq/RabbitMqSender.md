

### 🧩 Overview

This service is responsible for **sending messages to RabbitMQ**, specifically the `"admin.created.exchange"` for notifying another service (e.g. logging, analytics, etc.) whenever a new admin is created.

It uses:

* A `DirectExchange` named `"admin.created.exchange"`.
* A routing key: `"admin.created.key"`.
* A `RabbitTemplate` to send and **expect a reply** (RPC-style messaging).

---

### ✅ What This Does

When an admin is created, this service sends a message with the admin’s data (DTO format), and waits for a response (likely from a logging service or something else).

---

### 🔧 Configuration

| Field                               | Description                                                           |
| ----------------------------------- | --------------------------------------------------------------------- |
| `ADMIN_CREATED_DIRECT_EXCHANGE`     | Name of the direct exchange.                                          |
| `ADMIN_CREATED_DIRECT_EXCHANGE_KEY` | Routing key used to bind the receiver queue.                          |
| `rabbitTemplate`                    | Core RabbitMQ client that sends and waits for responses.              |
| `sendAdminCreated(...)`             | Method that sends a message with admin data and waits for a response. |

---

### 📄 Code Walkthrough

```java
@Service
public class RabbitMqSenderService {

    // Logger for error reporting
    private static final Logger logger = LoggerFactory.getLogger(RabbitMqSenderService.class);

    // Injected RabbitTemplate used for sending messages
    private final RabbitTemplate rabbitTemplate;

    // Exchange and routing key constants
    private final String ADMIN_CREATED_DIRECT_EXCHANGE = "admin.created.exchange";
    private final String ADMIN_CREATED_DIRECT_EXCHANGE_KEY = "admin.created.key";

    // Constructor-based injection
    public RabbitMqSenderService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Sends a new admin-created event to the logs service (or any consumer)
     * via direct exchange, and waits for a response.
     *
     * @param event Admin DTO containing email
     * @return Response from listener (typically logging result)
     */
    public Map<String, Object> sendAdminCreated(UtilRecords.adminCreatedRequestBodyDto event) {
        try {
            // Send and wait for a response (RPC)
            @SuppressWarnings("unchecked")
            Map<String, Object> response = (Map<String, Object>) rabbitTemplate.convertSendAndReceive(
                    ADMIN_CREATED_DIRECT_EXCHANGE,
                    ADMIN_CREATED_DIRECT_EXCHANGE_KEY,
                    event
            );

            if (response == null) {
                throw new RuntimeException("No response received from the logs service");
            }

            return response;
        } catch (Exception e) {
            logger.error("Failed to send admin created event: {}", e.getMessage());
            throw new RuntimeException("Failed to send admin created event", e);
        }
    }
}
```

---

### 🧾 Javadoc-Ready Comments

```java
/**
 * Service responsible for publishing messages to RabbitMQ exchanges,
 * specifically admin creation events.
 */
@Service
public class RabbitMqSenderService {

    /**
     * Sends an "admin created" event to a direct exchange.
     * Uses RPC (convertSendAndReceive) to get a response from another service.
     *
     * @param event DTO containing admin's email (and any other metadata)
     * @return Map response (e.g., {"createdNew": true})
     * @throws RuntimeException if no response or messaging failure occurs
     */
    public Map<String, Object> sendAdminCreated(UtilRecords.adminCreatedRequestBodyDto event) { ... }
}
```




