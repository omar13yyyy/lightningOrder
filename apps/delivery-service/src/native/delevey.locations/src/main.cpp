#include <pistache/endpoint.h>
#include <pistache/router.h>
#include <pistache/http.h>
#include <pistache/net.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include <csignal>
#include <atomic>

std::atomic_bool running(true);

void signalHandler(int signal) {
    if (signal == SIGINT) {
        std::cout << "\nSIGINT received. Shutting down...\n";
        running = false;
    }
}
using namespace Pistache;
using json = nlohmann::json;

class MyApi {
public:
    explicit MyApi(Address addr)
        : httpEndpoint(std::make_shared<Http::Endpoint>(addr)) {}

    void init(size_t threads = 2) {
        auto opts = Http::Endpoint::options().threads(threads);
        httpEndpoint->init(opts);
        setupRoutes();
    }

    void start() {
        httpEndpoint->setHandler(router.handler());
        httpEndpoint->serve();
    }
    void shutdown() {
        httpEndpoint->shutdown();
    }
    
private:
    void setupRoutes() {
        using namespace Rest;

        Routes::Get(router, "/", Routes::bind(&MyApi::handleRoot, this));
        Routes::Get(router, "/hello/:name", Routes::bind(&MyApi::handleHello, this));
        Routes::Post(router, "/add", Routes::bind(&MyApi::handleAdd, this));
        Routes::Get(router, "/status", Routes::bind(&MyApi::handleStatus, this));
    }

    void handleRoot(const Rest::Request& req, Http::ResponseWriter response) {
        response.send(Http::Code::Ok, "Welcome to Pistache REST API in C++!");
    }

    void handleHello(const Rest::Request& req, Http::ResponseWriter response) {
        auto name = req.param(":name").as<std::string>();
        response.send(Http::Code::Ok, "Hello, " + name + "!");
    }

    void handleAdd(const Rest::Request& req, Http::ResponseWriter response) {
        try {
            auto body = json::parse(req.body());
            int a = body["a"];
            int b = body["b"];
            int sum = a + b;

            json res;
            res["sum"] = sum;
            response.send(Http::Code::Ok, res.dump());
        } catch (...) {
            response.send(Http::Code::Bad_Request, "Invalid JSON or missing fields.");
        }
    }

    void handleStatus(const Rest::Request&, Http::ResponseWriter response) {
        json res;
        res["status"] = "running";
        res["uptime"] = "OK";
        response.send(Http::Code::Ok, res.dump());
    }

    std::shared_ptr<Http::Endpoint> httpEndpoint;
    Rest::Router router;
};

int main() {
    Port port(9080);
    Address addr(Ipv4::any(), port);
    MyApi api(addr);

    // تسجيل معالج الإشارات
    std::signal(SIGINT, signalHandler);

    api.init();

    std::cout << "Starting server on port " << port << "...\n";
    
    // تشغيل السيرفر في thread منفصل
    std::thread serverThread([&api]() {
        api.start();
    });

    // الانتظار حتى يتم الضغط Ctrl+C
    while (running.load()) {
        std::this_thread::sleep_for(std::chrono::milliseconds(200));
    }

    // إيقاف السيرفر بأمان
    api.shutdown(); // تحتاج لإضافة دالة shutdown في كلاس MyApi
    serverThread.join();

    std::cout << "Server stopped cleanly.\n";
    return 0;
}


//g++ api.cpp -o api -lpistache -pthread -std=c++17

/*
void handler(const Rest::Request& req, Http::ResponseWriter response) 
/user/:id
auto id = req.param(":id").as<std::string>();

Body
std::string body = req.body();
auto jsonData = json::parse(body);
int a = jsonData["a"];
std::string name = jsonData["name"];


auto headers = req.headers();
if (headers.has<Http::Header::ContentType>()) {
    auto contentType = headers.get<Http::Header::ContentType>();
    std::cout << "Content-Type: " << contentType->mime() << "\n";
}




-----------------------------------------------------------------------------
response.send(Http::Code::Ok, "Hello, World!");
json res;
res["status"] = "ok";
res["data"] = 42;

response.send(Http::Code::Ok, res.dump(), MIME(Application, Json));


🟢 3. تحديد نوع الـ MIME بشكل واضح

response.headers().add<Http::Header::ContentType>(MIME(Application, Json));
response.send(Http::Code::Ok, res.dump());



void handleLogin(const Rest::Request& req, Http::ResponseWriter response) {
    try {
        auto data = json::parse(req.body());
        std::string username = data["username"];
        std::string password = data["password"];

        json res;
        if (username == "admin" && password == "1234") {
            res["status"] = "success";
            res["token"] = "xyz123";
            response.send(Http::Code::Ok, res.dump(), MIME(Application, Json));
        } else {
            res["status"] = "fail";
            res["message"] = "Invalid credentials";
            response.send(Http::Code::Unauthorized, res.dump(), MIME(Application, Json));
        }
    } catch (...) {
        response.send(Http::Code::Bad_Request, "Invalid JSON");
    }
}




*/