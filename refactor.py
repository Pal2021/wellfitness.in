import os
import shutil

FRONTEND_SRC = r"c:\Users\PrashantPal\OneDrive\Desktop\gymAgents\frontend\src"

# Define the new structure
dirs_to_create = [
    "assets",
    "assets/styles",
    "assets/images",
    "features",
    "features/auth",
    "features/auth/components",
    "features/auth/pages",
    "features/auth/hooks",
    "features/auth/services",
    "features/core",
    "features/core/pages",
    "features/workout",
    "features/workout/pages",
    "features/diet",
    "features/diet/pages",
    "pages",
    "hooks",
    "utils",
    "config",
    "components/common",
    "components/layout"
]

for d in dirs_to_create:
    os.makedirs(os.path.join(FRONTEND_SRC, d), exist_ok=True)
    
print("Frontend directory structure created.")
