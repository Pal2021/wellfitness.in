import os
import re
import shutil
import csv

BASE_DIR = r"c:\Users\PrashantPal\OneDrive\Desktop\gymAgents\backend\src\main\java\com\wellfitness"

# Define where specific files SHOULD go relative to BASE_DIR based on the target structure rules
rules = {
    "config/ExerciseDataSeeder.java": "features/exercise/ExerciseDataSeeder.java",
    "config/SplitTemplateDataSeeder.java": "features/split/SplitTemplateDataSeeder.java",
    "common/exception/": "common/exception/",
    "common/response/": "common/response/",
    "common/security/": "common/security/",
    "config/": "config/", 
    
    # Auth
    "controller/AuthController.java": "features/auth/AuthController.java",
    "service/AuthService.java": "features/auth/AuthService.java",
    "service/EmailOtpService.java": "features/auth/EmailOtpService.java",
    "service/EmailService.java": "features/auth/EmailService.java",
    "service/OtpService.java": "features/auth/OtpService.java",
    "service/FirebaseTokenVerifierService.java": "features/auth/FirebaseTokenVerifierService.java",
    "service/GoogleTokenVerifierService.java": "features/auth/GoogleTokenVerifierService.java",
    "repository/UserRepository.java": "features/auth/UserRepository.java",
    
    # Workout
    "controller/WorkoutController.java": "features/workout/WorkoutController.java",
    "service/WorkoutService.java": "features/workout/WorkoutService.java",
    "service/ProgressiveOverloadService.java": "features/workout/ProgressiveOverloadService.java",
    "repository/WorkoutSessionRepository.java": "features/workout/WorkoutSessionRepository.java",
    "repository/WorkoutSetRepository.java": "features/workout/WorkoutSetRepository.java",
    
    # Exercise
    "controller/ExerciseController.java": "features/exercise/ExerciseController.java",
    "service/ExerciseService.java": "features/exercise/ExerciseService.java",
    "repository/ExerciseRepository.java": "features/exercise/ExerciseRepository.java",
    
    # Split
    "controller/SplitController.java": "features/split/SplitController.java",
    "controller/SplitTemplateController.java": "features/split/SplitTemplateController.java",
    "service/SplitService.java": "features/split/SplitService.java",
    "service/SplitTemplateService.java": "features/split/SplitTemplateService.java",
    "repository/SplitDayRepository.java": "features/split/SplitDayRepository.java",
    "repository/SplitDayExerciseRepository.java": "features/split/SplitDayExerciseRepository.java",
    "repository/SplitTemplateRepository.java": "features/split/SplitTemplateRepository.java",
    "repository/SplitTemplateDayRepository.java": "features/split/SplitTemplateDayRepository.java",
    "repository/UserSplitRepository.java": "features/split/UserSplitRepository.java",
    
    # Streak
    "controller/StreakController.java": "features/streak/StreakController.java",
    "service/StreakService.java": "features/streak/StreakService.java",
    "repository/UserStreakRepository.java": "features/streak/UserStreakRepository.java",
    
    # PR
    "controller/PRController.java": "features/pr/PRController.java",
    "service/PRDetectionService.java": "features/pr/PRDetectionService.java",
    "repository/PersonalRecordRepository.java": "features/pr/PersonalRecordRepository.java",
    
    # Profile
    "controller/ProfileController.java": "features/profile/ProfileController.java",
    
    # Dashboard
    "controller/DashboardController.java": "features/dashboard/DashboardController.java",
    
    # Onboarding
    "controller/OnboardingController.java": "features/onboarding/OnboardingController.java",
}

# Collect all files
files_to_visit = []
for root, dirs, files in os.walk(BASE_DIR):
    for f in files:
        if f.endswith('.java'):
            files_to_visit.append(os.path.join(root, f).replace("\\", "/"))

base_dir_fwd = BASE_DIR.replace("\\", "/")

move_map = {}
class_mapping = {}

# Compute target paths and map fully qualified class names
for f in files_to_visit:
    rel = f.replace(base_dir_fwd + "/", "")
    target_rel = rel
    
    if rel in rules:
        target_rel = rules[rel]
        
    if rel != target_rel:
        move_map[rel] = target_rel
        
    old_pkg = "com.wellfitness." + os.path.dirname(rel).replace("/", ".")
    new_pkg = "com.wellfitness." + os.path.dirname(target_rel).replace("/", ".")
    
    class_name = os.path.basename(rel).replace(".java", "")
    old_fqcn = old_pkg + "." + class_name
    new_fqcn = new_pkg + "." + class_name
    
    if old_fqcn != new_fqcn:
        class_mapping[old_fqcn] = new_fqcn

print(f"Found {len(move_map)} files to move.")
print(f"Tracking {len(class_mapping)} classes for import updates.")

moved_files_abs = {}

# 1. First, process all imports and packages in ALL files (we can do it in place where they currently be)
# Wait, if we rewrite them IN PLACE, then move them, it's safe.
for f in files_to_visit:
    rel = f.replace(base_dir_fwd + "/", "")
    target_rel = move_map.get(rel, rel)
    
    # Read
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    new_pkg = "com.wellfitness." + os.path.dirname(target_rel).replace("/", ".")
    
    # Replace package header
    content = re.sub(r"^package com\.wellfitness\.[^;]+;", f"package {new_pkg};", content, flags=re.MULTILINE)
    
    # Replace imports
    for old_fqcn, new_fqcn in class_mapping.items():
        # import com.wellfitness.model.User; -> import com.wellfitness.features.auth.entity.User;
        content = re.sub(rf"import\s+{re.escape(old_fqcn)}\s*;", f"import {new_fqcn};", content)

    # Write temporarily in place
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

# 2. Now move the files
for rel, target_rel in move_map.items():
    old_abs = os.path.join(base_dir_fwd, rel)
    new_abs = os.path.join(base_dir_fwd, target_rel)
    os.makedirs(os.path.dirname(new_abs), exist_ok=True)
    shutil.move(old_abs, new_abs)
    moved_files_abs[rel] = target_rel

# Write the mapping output to MIGRATION_MAPPING_BACKEND.csv so we have it for tests
with open(os.path.join(base_dir_fwd, "../../MIGRATION_MAPPING_BACKEND.csv"), 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(["Old Path", "New Path"])
    for k, v in moved_files_abs.items():
        writer.writerow([k, v])

# Remove empty directories
def remove_empty_dirs(path):
    for root, dirs, files in os.walk(path, topdown=False):
        for d in dirs:
            dir_path = os.path.join(root, d)
            try:
                if not os.listdir(dir_path):
                    os.rmdir(dir_path)
            except OSError:
                pass
remove_empty_dirs(base_dir_fwd)

# Specifically delete modules folder as per rule 5
modules_dir = os.path.join(base_dir_fwd, "modules.user")
if os.path.exists(modules_dir):
    shutil.rmtree(modules_dir)
modules_dir_2 = os.path.join(base_dir_fwd, "modules")
if os.path.exists(modules_dir_2):
    shutil.rmtree(modules_dir_2)

print("Backend migration completed successfully!")
