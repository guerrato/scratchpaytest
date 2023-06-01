# ScratchPay Code Challenge

## RESTful API Documentation

This document presents the result of the ScratchPay code challenge, showcasing the RESTful API developed using ExpressJS. The API is designed to meet the specified requirements and incorporates a range of features to ensure a robust and efficient solution.

The ScratchPay RESTful API leverages the power of ExpressJS to provide a scalable and performant backend for clinic provider search. It follows the principles of REST architecture, utilizing HTTP methods and status codes for communication with resources. The API is stateless, ensuring that each request contains all the necessary information for processing.

You can access the project and its source code on the GitHub repository: [https://github.com/guerrato/scratchpaytest](https://github.com/guerrato/scratchpaytest). The repository serves as a central hub for collaboration, enabling you to review the code, contribute, and provide feedback.

Throughout this documentation, you will find comprehensive details about the API's RESTful properties, an example of an authentication endpoint, various search endpoint examples, information about the tests and code documentation, integration of API documentation with Swagger, Docker support for easy containerization, and integration with CI/CD using GitHub Actions.

By exploring this documentation and reviewing the project on GitHub, you will gain a comprehensive understanding of the ScratchPay RESTful API and its capabilities.

### API RESTful Props

- The API follows the principles of REST (Representational State Transfer) architecture.
- It utilizes the HTTP methods and status codes for communication and interaction with resources.
- The API provides a stateless communication mechanism, where each request contains all the necessary information.
- It supports the JSON format for data representation.

### Authentication Endpoint Example

- Endpoint: `/user`
- Method: `POST`
- Request Body:
  ```json
  {
    "username": "user1",
    "password": "password1"
  }
  ```
- Response:
  - Success (200 OK):
    ```json
    {
      "success": true,
      "message": "Use the token in data into x-auth-token for authenticated routes",
      "data": "5f8a3b76-4998-4e22-a3b7-84f22c9a12d3"
    }
    ```
  - Unauthorized (401 Unauthorized):
    ```json
    { "success": false, "error": "Invalid credentials" }
    ```

### Search Endpoint Examples

The API provides a search endpoint that allows searching for clinic providers based on various criteria.

- Endpoint: `/clinic/search`
- Method: `GET`
- Parameters:
  - `q` (optional): Used for searching by clinic name
  - `state` (optional): Used for filtering by state (accepts state name or acronym)
  - `from` (optional): Clinic opening time (format: "HH:mm")
  - `to` (optional): Clinic closing time (format: "HH:mm")
  - `type` (optional): Set the clinic type ("vet" or "dental")
  - `page` (optional): Select the page of pagination
  - `limit` (optional): Select the limit of items to be returned

Example requests:

- Search by clinic name:

  - Request: `GET /clinic/search?q=Clinic%20A`
  - Response:
    ```json
    {
      "results": [
        {
          "id": 1,
          "name": "Clinic A",
          "state": "California",
          "availability": "09:00-17:00"
        }
      ]
    }
    ```

- Search by state and availability:

  - Request: `GET /clinic/search?state=CA&from=09:00&to=17:00`
  - Response:
    ```json
    {
      "results": [
        {
          "name": "Clinic A",
          "state": "California",
          "availability": "09:00-17:00",
          "type": "dental"
        },
        {
          "name": "Clinic B",
          "state": "California",
          "availability": "10:00-18:00",
          "type": "dental"
        }
      ]
    }
    ```

- Search with pagination:
  - Request: `GET /clinic/search?state=CA&page=2&limit=10`
  - Response:
    ```json
    {
      "results": [
        {
          "name": "Clinic K",
          "state": "California",
          "availability": "09:00-17:00",
          "type": "vet"
        },
        {
          "name": "Clinic L",
          "state": "California",
          "availability": "10:00-18:00",
          "type": "dental"
        },
        ...
      ],
      "page": 2,
      "totalPages": 5
    }
    ```

Please note that the `x-auth-token` header with the value of `'5f8a3b76-4998-4e22-a3b7-84f22c9a12d3'` should be included in the request header for authentication.

### Tests

The API is thoroughly tested to ensure its correctness and functionality. A comprehensive test suite is created using a testing framework (e.g., Jest). The tests cover various scenarios, including positive and negative cases, edge cases, and different input combinations. The test suite also includes tests for authentication and search endpoints.

To run the tests and get test coverage statistics, execute the following command in the project directory:

```bash
npm test
```

The command will run the test suite and provide a summary of the test results, including the number of passed and failed tests. Additionally, it will generate coverage reports indicating the percentage of code coverage achieved by the tests. These coverage reports provide insights into which parts of the codebase are adequately covered by tests and highlight areas that may require additional testing.

By running the tests and reviewing the coverage statistics, you can assess the effectiveness of the test suite in ensuring the correctness and stability of the API.

### Code Documentation

The codebase includes documentation to improve readability and maintainability. The files are documented, providing explanations and descriptions of the purpose and functionality of each module, class, and function. The documentation aids in understanding the code by providing context and insights into the code's structure and implementation.

By documenting the code, it becomes easier for developers to navigate and comprehend the codebase. They can quickly grasp the functionality of different components, their dependencies, and how they interact with each other. This promotes better collaboration, code reuse, and maintenance of the API.

### API Documentation with Swagger

The API documentation is generated using Swagger, which provides an interactive interface to explore and interact with the API endpoints. The codebase includes Swagger annotations that describe the API's structure, endpoints, parameters, and responses.

To access the Swagger documentation page, navigate to the `/docs` route of the API. This will present a user-friendly interface where you can browse the available endpoints, view their descriptions, and test them by providing the required parameters. The Swagger documentation simplifies the process of understanding and working with the API, making it easier to integrate and utilize its features.

By utilizing Swagger for API documentation, developers and users can gain insights into the available endpoints, their input requirements, and the expected output. This enhances the overall user experience and facilitates the integration of the API into various client applications.

### Docker

The project includes Docker support for easy containerization and deployment. Docker enables consistent and isolated environments across different systems. With the provided Docker configuration, the API can be easily packaged into a Docker image, allowing for seamless deployment and scalability.

### CI/CD

The project includes an implementation for Continuous Integration (CI) using

GitHub Actions. The CI setup ensures that the codebase is automatically built, tested, and validated on each commit or pull request. This helps maintain code quality, catch issues early, and provide feedback to the development team. Continuous Deployment (CD) can also be integrated with the CI process to automatically deploy the API to a staging or production environment based on predefined rules and conditions.

---

The presented API implementation successfully meets the requirements outlined in the initial markdown. It provides a RESTful API with authentication and search functionality for clinic providers. The API is well-tested, documented, and includes features such as Docker support, CI/CD integration using GitHub Actions, and API documentation with Swagger.
