import os

BACKEND_SRC = r"c:\Users\PrashantPal\OneDrive\Desktop\gymAgents\backend\src\main\java\com\wellfitness"

dirs = [
    "core",
    "core/config",
    "core/exception",
    "core/security",
    "modules",
    "modules/user",
    "modules/user/controller",
    "modules/user/service",
    "modules/user/repository",
    "modules/user/model",
    "modules/user/dto",
    "utils"
]

for d in dirs:
    os.makedirs(os.path.join(BACKEND_SRC, d), exist_ok=True)
    
print("Backend directory structure created.")
