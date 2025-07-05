

### 🧩 Overview

This configuration sets up the **RabbitMQ infrastructure** used by your authentication service for **messaging and asynchronous communication**, especially for **admin-related events**.

It defines:

* A `DirectExchange` for admin creation events.
* A `Jackson2JsonMessageConverter` to serialize/deserialize payloads.
* A `RabbitTemplate` for sending messages with JSON support.

---

### 💡 Why Use This?

RabbitMQ helps decouple parts of your system. For instance:

* Your Auth Service can emit an `admin.created` event.
* Another service (e.g., Admin Panel, Email Notification) can listen for this without tightly coupling to Auth.

---

### 🔧 Configuration Details

| Component                        | Description                                                                                                   |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `ADMIN_CREATED_DIRECT_EXCHANGE`  | Direct exchange used to route messages related to newly created admins. Durable & non-auto-deletable.         |
| `adminCreatedDirectExchange()`   | Registers the named direct exchange for admin events.                                                         |
| `jackson2JsonMessageConverter()` | Tells Rabbit to use JSON for serializing/deserializing payloads. Required for sending complex objects.        |
| `rabbitTemplate()`               | Core RabbitMQ client bean used to send messages. Injects the JSON converter and sets a reply timeout of `5s`. |

---

### ✅ Code Summary

```java
@Configuration
public class RabbitMqConfig {

    private final String ADMIN_CREATED_DIRECT_EXCHANGE = "admin.created.exchange";

    // Declare a durable direct exchange for admin creation events
    @Bean
    public DirectExchange adminCreatedDirectExchange() {
        return new DirectExchange(ADMIN_CREATED_DIRECT_EXCHANGE, true, false);
    }

    // Use Jackson to convert Java objects to JSON in messages
    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // Configure RabbitTemplate with the JSON converter and 5s timeout
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jackson2JsonMessageConverter());
        template.setReplyTimeout(5000);
        return template;
    }
}
```

---

### 🧾 Suggested Javadoc (for in-code use)

/\*\*

* Configures RabbitMQ infrastructure including exchanges and converters.
* Used for emitting events such as admin creation notifications.
  \*/

```java
/**
 * Declares a durable, non-auto-deleted direct exchange used for
 * admin creation events.
 */
@Bean
public DirectExchange adminCreatedDirectExchange() { ... }

/**
 * Converts messages to/from JSON using Jackson.
 */
@Bean
public Jackson2JsonMessageConverter jackson2JsonMessageConverter() { ... }

/**
 * Core template for publishing messages to RabbitMQ, configured with
 * a JSON converter and 5-second reply timeout.
 */
@Bean
public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) { ... }
```

