from locust import HttpUser, task, between

class EitherUser(HttpUser):
    """User simulation calling only Either-based endpoints (No Exception Throwing)"""
    wait_time = between(0.001, 0.01)

    @task(1)
    def test_either_success(self):
        self.client.get("/api/either/success", name="1. Either Success (HTTP 200)")

    @task(1)
    def test_either_error(self):
        with self.client.get("/api/either/error", catch_response=True, name="2. Either Error (HTTP 400)") as response:
            if response.status_code == 400:
                response.success()
            else:
                response.failure(f"Expected 400, got {response.status_code}")


class ExceptionUser(HttpUser):
    """User simulation calling only Exception-based endpoints (Throw & Catch)"""
    wait_time = between(0.001, 0.01)

    @task(1)
    def test_exception_success(self):
        self.client.get("/api/exception/success", name="3. Exception Success (HTTP 200)")

    @task(1)
    def test_exception_error(self):
        with self.client.get("/api/exception/error", catch_response=True, name="4. Exception Error (HTTP 400)") as response:
            if response.status_code == 400:
                response.success()
            else:
                response.failure(f"Expected 400, got {response.status_code}")


class BenchmarkComparisonUser(HttpUser):
    """
    Combined user comparing both Either and Exception flows under equal load
    """
    wait_time = between(0.001, 0.005)

    @task(1)
    def either_success(self):
        self.client.get("/api/either/success", name="Either - Success (200)")

    @task(1)
    def either_error(self):
        with self.client.get("/api/either/error", catch_response=True, name="Either - Error (400)") as response:
            if response.status_code == 400:
                response.success()

    @task(1)
    def exception_success(self):
        self.client.get("/api/exception/success", name="Exception - Success (200)")

    @task(1)
    def exception_error(self):
        with self.client.get("/api/exception/error", catch_response=True, name="Exception - Error (400)") as response:
            if response.status_code == 400:
                response.success()
