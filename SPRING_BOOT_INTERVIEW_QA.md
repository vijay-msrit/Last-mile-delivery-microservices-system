# Spring Boot Interview Questions & Answers

A comprehensive reference of 50 common Spring Boot interview questions and answers, progressing from fundamentals to advanced topics.

---

## Basics & Core Concepts

### 1. What is Spring Boot?
Spring Boot is an opinionated, convention-over-configuration extension of the Spring Framework that simplifies the setup and development of Spring-based applications. It provides:
- **Auto-configuration** – automatically configures Spring beans based on the classpath.
- **Embedded servers** – bundles Tomcat, Jetty, or Undertow so no external server deployment is required.
- **Starter dependencies** – curated dependency descriptors that pull in everything needed for a feature.
- **Production-ready features** – metrics, health checks, and externalized configuration via Spring Boot Actuator.

---

### 2. What are the main differences between Spring and Spring Boot?

| Feature | Spring | Spring Boot |
|---|---|---|
| Configuration | Requires extensive XML or Java config | Auto-configured; minimal boilerplate |
| Server deployment | Must deploy WAR to an external server | Runs as a standalone JAR with an embedded server |
| Dependency management | Manual version coordination | Managed via `spring-boot-starter-parent` BOM |
| Getting started | Slower setup | `spring initializr` generates a project in seconds |

---

### 3. What is auto-configuration in Spring Boot?
Auto-configuration is the mechanism by which Spring Boot automatically creates and wires beans based on:
- What JARs are on the classpath.
- What properties are set in `application.properties` / `application.yml`.
- Whether a bean has already been defined by the developer.

It is implemented through `@EnableAutoConfiguration` (included in `@SpringBootApplication`) and a list of candidate configuration classes declared in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (Spring Boot 3) or `spring.factories` (Spring Boot 2).

---

### 4. What is `@SpringBootApplication`?
`@SpringBootApplication` is a convenience meta-annotation that combines three annotations:
- `@Configuration` – marks the class as a source of bean definitions.
- `@EnableAutoConfiguration` – activates auto-configuration.
- `@ComponentScan` – scans the current package and sub-packages for Spring components.

```java
@SpringBootApplication
public class DeliveryApplication {
    public static void main(String[] args) {
        SpringApplication.run(DeliveryApplication.class, args);
    }
}
```

---

### 5. What are Spring Boot Starters?
Starters are pre-packaged dependency descriptors. Adding a single starter brings in all the transitive dependencies needed for a feature:

| Starter | Purpose |
|---|---|
| `spring-boot-starter-web` | Spring MVC + embedded Tomcat |
| `spring-boot-starter-data-jpa` | JPA + Hibernate + connection pooling |
| `spring-boot-starter-security` | Spring Security |
| `spring-boot-starter-test` | JUnit 5, Mockito, AssertJ |
| `spring-boot-starter-actuator` | Production monitoring endpoints |

---

### 6. What is the Spring Boot Actuator?
Spring Boot Actuator exposes production-ready HTTP endpoints for monitoring and managing your application. Key endpoints include:

- `/actuator/health` – application health status.
- `/actuator/info` – custom application info.
- `/actuator/metrics` – JVM and application metrics.
- `/actuator/env` – environment properties.
- `/actuator/loggers` – view/change log levels at runtime.

Enable by adding `spring-boot-starter-actuator` to your dependencies. Endpoints can be secured and selectively exposed via `management.endpoints.web.exposure.include`.

---

### 7. What is the difference between `@Component`, `@Service`, `@Repository`, and `@Controller`?
All four are specializations of `@Component` and trigger component scanning, but they carry semantic meaning:

| Annotation | Layer | Extra Behaviour |
|---|---|---|
| `@Component` | Generic | None |
| `@Service` | Business logic | None (marks intent) |
| `@Repository` | Data access | Translates persistence exceptions to `DataAccessException` |
| `@Controller` | Web (MVC) | Maps to dispatcher servlet, views returned |
| `@RestController` | Web (REST) | `@Controller` + `@ResponseBody` on every method |


---

### 8. What is Dependency Injection (DI) and how does Spring implement it?
Dependency Injection is a design pattern where an object's dependencies are provided externally rather than created by the object itself. Spring implements DI via:
- **Constructor injection** (preferred – promotes immutability and testability).
- **Setter injection**.
- **Field injection** (`@Autowired` on fields – convenient but harder to test).

```java
// Constructor injection (recommended)
@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
}
```

---

### 9. What is `application.properties` vs `application.yml`?
Both files serve as the main externalized configuration for a Spring Boot application.
- `application.properties` uses simple `key=value` pairs.
- `application.yml` uses YAML hierarchy, which is more readable for nested properties.

```yaml
# application.yml example
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/delivery
    username: root
server:
  port: 8080
```

Both are interchangeable; YAML is generally preferred for complex configurations.

---

### 10. How does Spring Boot support multiple environments (profiles)?
Spring Profiles allow different configurations per environment:
- Create `application-dev.yml`, `application-prod.yml`, etc.
- Activate with `spring.profiles.active=prod` or `--spring.profiles.active=prod` at startup.
- Annotate beans with `@Profile("dev")` to load them only in that profile.

---

## Annotations

### 11. What is `@Autowired`?
`@Autowired` instructs Spring to inject a matching bean automatically. It can be placed on a constructor, setter, or field. When there is only one constructor, Spring 4.3+ injects it without requiring the annotation.

---

### 12. What is `@Qualifier`?
When multiple beans of the same type exist, `@Qualifier` disambiguates which one to inject:

```java
@Autowired
@Qualifier("mysqlDataSource")
private DataSource dataSource;
```

---

### 13. What is `@Value`?
`@Value` injects property values or Spring Expression Language (SpEL) expressions into fields:

```java
@Value("${app.delivery.maxRetries:3}")
private int maxRetries;
```

The `:3` part specifies a default value if the property is not set.

---

### 14. What is `@ConfigurationProperties`?
`@ConfigurationProperties` binds a prefix of properties to a POJO, which is cleaner than multiple `@Value` annotations:

```java
@Component
@ConfigurationProperties(prefix = "app.delivery")
public class DeliveryProperties {
    private int maxRetries;
    private String defaultCourier;
    // getters/setters
}
```

---

### 15. What is `@Bean`?
`@Bean` declares a Spring-managed bean inside a `@Configuration` class. It gives explicit control over bean creation when auto-configuration is insufficient:

```java
@Configuration
public class AppConfig {
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
```

---

### 16. What is `@Transactional`?
`@Transactional` demarcates transactional boundaries. Spring wraps the method in a transaction; it commits on success and rolls back on a `RuntimeException` (by default):

```java
@Transactional
public void processOrder(Order order) {
    orderRepository.save(order);
    inventoryService.reserve(order);
}
```

Key attributes: `propagation`, `isolation`, `rollbackFor`, `readOnly`, `timeout`.

---

### 17. What is `@RequestMapping` and its shorthand variants?
`@RequestMapping` maps HTTP requests to handler methods. Shorthand annotations are:
- `@GetMapping` → `@RequestMapping(method = GET)`
- `@PostMapping` → `@RequestMapping(method = POST)`
- `@PutMapping` → `@RequestMapping(method = PUT)`
- `@DeleteMapping` → `@RequestMapping(method = DELETE)`
- `@PatchMapping` → `@RequestMapping(method = PATCH)`

---

### 18. What is `@PathVariable` vs `@RequestParam`?
- `@PathVariable` extracts a value from the URI path: `GET /orders/{id}`.
- `@RequestParam` extracts a query parameter: `GET /orders?status=PENDING`.

```java
@GetMapping("/orders/{id}")
public Order getById(@PathVariable Long id) { … }

@GetMapping("/orders")
public List<Order> getByStatus(@RequestParam String status) { … }
```

---

### 19. What is `@ResponseBody` and `@RequestBody`?
- `@ResponseBody` tells Spring to serialize the return value to the HTTP response body (JSON/XML).
- `@RequestBody` deserializes the HTTP request body into a method parameter.

`@RestController` implicitly applies `@ResponseBody` to all methods.

---

### 20. What is `@ExceptionHandler` and `@ControllerAdvice`?
- `@ExceptionHandler` inside a controller handles exceptions thrown by that controller's methods.
- `@ControllerAdvice` (or `@RestControllerAdvice`) makes exception handling global across all controllers:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
```

---

## Spring Data & Database

### 21. What is Spring Data JPA?
Spring Data JPA sits on top of JPA (Java Persistence API) and provides repository abstractions that eliminate boilerplate CRUD code. By extending `JpaRepository<Entity, ID>` you get:
- `save()`, `findById()`, `findAll()`, `deleteById()`, and many more.
- Derived query methods from method names (e.g., `findByEmailAndStatus`).
- `@Query` for custom JPQL/native queries.

---

### 22. What is the difference between `CrudRepository`, `JpaRepository`, and `PagingAndSortingRepository`?

| Interface | Extends | Extra features |
|---|---|---|
| `CrudRepository` | `Repository` | Basic CRUD |
| `PagingAndSortingRepository` | `CrudRepository` | Pagination & sorting |
| `JpaRepository` | `PagingAndSortingRepository` | JPA-specific operations (flush, batch delete) |

---

### 23. What is `@Entity` and `@Table`?
- `@Entity` marks a class as a JPA entity (mapped to a database table).
- `@Table(name = "orders")` overrides the default table name.

```java
@Entity
@Table(name = "delivery_orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
```

---

### 24. What are the JPA relationship annotations?
- `@OneToOne` – one entity relates to exactly one other.
- `@OneToMany` / `@ManyToOne` – parent-child relationship.
- `@ManyToMany` – both sides can have multiple instances.

Use `mappedBy` on the non-owning side and `@JoinColumn` on the owning side.

---

### 25. What is the difference between `FetchType.LAZY` and `FetchType.EAGER`?
- `EAGER` – associated entities are loaded immediately with the parent query (can cause N+1 problems).
- `LAZY` – associated entities are loaded on demand when accessed (default for collections, requires an open session).

---

### 26. What is the N+1 problem and how do you solve it?
The N+1 problem occurs when fetching N parent records triggers N additional queries to fetch their associations. Solutions:
- Use `JOIN FETCH` in JPQL: `SELECT o FROM Order o JOIN FETCH o.items`.
- Use `@EntityGraph` to specify which associations to fetch eagerly for a specific query.
- Use batch fetching via `@BatchSize`.

---

### 27. What is a `DataSource` and how is it configured in Spring Boot?
A `DataSource` is a factory for database connections. Spring Boot auto-configures it from `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/delivery
spring.datasource.username=root
spring.datasource.password=secret
spring.datasource.hikari.maximum-pool-size=10
```

HikariCP is the default connection pool in Spring Boot 2+.

---

### 28. What is Flyway / Liquibase and why use them?
Flyway and Liquibase are database migration tools. They version-control schema changes as SQL scripts (Flyway) or XML/YAML changesets (Liquibase), ensuring every environment has the same schema. Spring Boot auto-runs migrations on startup when the dependency is on the classpath.

---

## REST API Development

### 29. What is a RESTful API?
REST (Representational State Transfer) is an architectural style where:
- Resources are identified by URIs (`/orders/42`).
- Standard HTTP methods express intent (GET=read, POST=create, PUT=update, DELETE=remove).
- Responses are stateless.
- Representations are typically JSON or XML.

---

### 30. How do you build a REST API in Spring Boot?

```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.findById(id));
    }

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestBody @Valid CreateOrderRequest req) {
        OrderDto created = orderService.create(req);
        URI location = URI.create("/api/orders/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }
}
```

---

### 31. What is `ResponseEntity`?
`ResponseEntity<T>` is a wrapper around the response body that lets you set the HTTP status code and headers explicitly, giving full control over the response.

---

### 32. How do you validate request bodies in Spring Boot?
Add `spring-boot-starter-validation` and annotate the request DTO with Bean Validation annotations, then use `@Valid` on the method parameter:

```java
public class CreateOrderRequest {
    @NotBlank
    private String customerId;
    @NotNull @Positive
    private Double weight;
}

@PostMapping
public ResponseEntity<OrderDto> create(@RequestBody @Valid CreateOrderRequest req) { … }
```

Spring returns `400 Bad Request` automatically if validation fails.

---

### 33. How do you handle pagination in Spring Boot REST APIs?
Use `Pageable` from Spring Data:

```java
@GetMapping
public Page<OrderDto> list(Pageable pageable) {
    return orderService.findAll(pageable);
}
```

Clients pass `?page=0&size=20&sort=createdAt,desc`. Configure default values with `@PageableDefault`.

---

### 34. What is HATEOAS?
Hypermedia as the Engine of Application State (HATEOAS) enriches REST responses with links to related actions. Spring provides `spring-boot-starter-hateoas`. A response might include a `_links` object with URIs for `self`, `update`, `cancel`, etc., making the API self-discoverable.

---

## Microservices & Service Communication

### 35. How does Spring Boot support microservices?
Spring Boot, combined with **Spring Cloud**, provides:
- **Eureka** – service registry and discovery.
- **Spring Cloud Gateway / Zuul** – API gateway.
- **Feign** – declarative HTTP client between services.
- **Resilience4j** – circuit breaker, retry, rate limiter.
- **Spring Cloud Config** – centralized configuration server.
- **Sleuth / Zipkin** – distributed tracing.

---

### 36. What is Spring Cloud Eureka?
Eureka is a service registry from Netflix OSS, integrated into Spring Cloud. Microservices register themselves on startup and query the registry to discover other services, removing hard-coded URLs.

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication { … }
```

---

### 37. What is a Circuit Breaker and how does Resilience4j implement it?
A circuit breaker prevents cascading failures by short-circuiting calls to a failing service. Resilience4j's circuit breaker has three states:
- **CLOSED** – normal operation.
- **OPEN** – calls fail immediately without reaching the downstream service.
- **HALF_OPEN** – a limited number of test calls are allowed to check recovery.

Configured via `@CircuitBreaker(name = "orderService", fallbackMethod = "fallback")`.

---

### 38. What is an API Gateway?
An API Gateway is the single entry point for all client requests. It handles:
- Routing to the correct microservice.
- Authentication / authorization.
- Rate limiting.
- Load balancing.
- SSL termination.

Spring Cloud Gateway uses reactive non-blocking I/O and is the modern replacement for Zuul.

---

## Security

### 39. How do you secure a Spring Boot application?
Add `spring-boot-starter-security`. By default, all endpoints require authentication with a generated password. Customise with a `SecurityFilterChain` bean:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/public/**").permitAll()
            .anyRequest().authenticated())
        .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt);
    return http.build();
}
```

---

### 40. What is JWT and how is it used in Spring Boot?
A JSON Web Token (JWT) is a compact, self-contained token containing claims (user id, roles, expiry). In a Spring Boot REST API:
1. User logs in → server issues a JWT.
2. Client sends `Authorization: Bearer <token>` on subsequent requests.
3. A `JwtDecoder` bean validates the token; Spring Security extracts the `Authentication` from it.

---

### 41. What is the difference between Authentication and Authorization?
- **Authentication** – verifying *who* you are (login, JWT validation).
- **Authorization** – verifying *what* you are allowed to do (`ROLE_ADMIN` can delete orders).

In Spring Security, use `@PreAuthorize("hasRole('ADMIN')")` for method-level authorization.

---

## Testing

### 42. What testing support does Spring Boot provide?
Spring Boot Test (`spring-boot-starter-test`) includes:
- **JUnit 5** – test framework.
- **Mockito** – mocking framework.
- **AssertJ** – fluent assertions.
- **MockMvc** – test MVC controllers without starting a real server.
- **TestRestTemplate / WebTestClient** – integration tests with a running server.
- **@DataJpaTest** – slice test for the JPA layer only.

---

### 43. What is `@SpringBootTest`?
`@SpringBootTest` loads the full application context for integration tests. Use `webEnvironment = RANDOM_PORT` to start the embedded server on a random port and inject `TestRestTemplate` / `WebTestClient`:

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class OrderControllerIT {
    @Autowired private TestRestTemplate restTemplate;
    @Test
    void getOrder_returnsOk() {
        ResponseEntity<OrderDto> response = restTemplate.getForEntity("/api/orders/1", OrderDto.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
```

---

### 44. What is `@MockBean`?
`@MockBean` adds a Mockito mock to the Spring application context, replacing the real bean. It is used in `@SpringBootTest` or `@WebMvcTest` to isolate the component under test:

```java
@WebMvcTest(OrderController.class)
class OrderControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean OrderService orderService;
}
```

---

### 45. What is `@DataJpaTest`?
`@DataJpaTest` is a slice test that loads only the JPA layer (repositories, entities) with an in-memory H2 database. It is fast and isolated from the web layer:

```java
@DataJpaTest
class OrderRepositoryTest {
    @Autowired private OrderRepository orderRepository;

    @Test
    void findByStatus_returnsPendingOrders() {
        // …
    }
}
```

---

## Deployment & Production

### 46. How do you package and run a Spring Boot application?
Spring Boot Maven/Gradle plugins create an executable **fat JAR** (uber-JAR) containing all dependencies and an embedded server:

```bash
./mvnw clean package
java -jar target/delivery-service-1.0.jar
```

For containerised deployments, the plugin also supports building OCI images: `./mvnw spring-boot:build-image`.

---

### 47. How do you containerise a Spring Boot application with Docker?

```dockerfile
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/delivery-service.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

For production, prefer layered JARs or BuildKit for efficient image caching:
```bash
./mvnw spring-boot:build-image -Dspring-boot.build-image.imageName=delivery-service:latest
```

---

### 48. What is Spring Boot's embedded server and can it be changed?
Spring Boot defaults to **Tomcat**. To switch to **Jetty** or **Undertow**, exclude the Tomcat starter and add the desired one:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-undertow</artifactId>
</dependency>
```

---

### 49. What is Spring Boot DevTools?
`spring-boot-devtools` enhances the development experience with:
- **Automatic restart** – restarts the application when classpath files change.
- **LiveReload** – refreshes the browser automatically.
- **Relaxed property defaults** – disables template caching, enables debug logging.

DevTools is automatically disabled in production (not present in the fat JAR by default).

---

### 50. What are some Spring Boot performance best practices?

1. **Use constructor injection** over field injection for clarity and immutability.
2. **Enable lazy initialisation** (`spring.main.lazy-initialization=true`) to speed up startup (load beans on first use).
3. **Use `@Async`** for non-blocking, fire-and-forget operations (configure a `ThreadPoolTaskExecutor`).
4. **Cache expensive operations** with `@Cacheable` and `spring-boot-starter-cache`.
5. **Tune HikariCP** pool size based on load (`spring.datasource.hikari.*` properties).
6. **Use pagination** for large result sets instead of loading all records.
7. **Use `@Transactional(readOnly = true)`** for read-only queries — lets Hibernate skip dirty checking.
8. **Externalise configuration** with Spring Cloud Config or environment variables — never hard-code.
9. **Monitor with Actuator + Micrometer** — expose metrics to Prometheus/Grafana for production insight.
10. **Use native images (GraalVM)** via Spring Boot 3 Native support for near-instant startup times.

---

*Good luck with your interviews! Review these concepts alongside the microservices implementation in this repository to see them applied in a real project.*
