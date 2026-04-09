import os
import re
import shutil
import csv

BASE_DIR = r"c:\Users\PrashantPal\OneDrive\Desktop\gymAgents\frontend\src"

# Define destination rules. We map from existing relative path to new relative path.
# We will deduplicate automatically because multiple old paths can point to the same new path.
destinations = {
    # Pages/Screens
    "screens/DashboardScreen.jsx": "features/dashboard/pages/DashboardScreen.jsx",
    "screens/ProfileScreen.jsx": "features/profile/pages/ProfileScreen.jsx",
    "screens/WorkoutScreen.jsx": "features/workout/pages/WorkoutScreen.jsx",
    "screens/HistoryScreen.jsx": "features/workout/pages/HistoryScreen.jsx",
    "screens/ExercisesScreen.jsx": "features/exercise/pages/ExercisesScreen.jsx",
    "screens/SplitScreen.jsx": "features/split/pages/SplitScreen.jsx",
    "screens/OnboardingScreen.jsx": "features/onboarding/pages/OnboardingScreen.jsx",
    "screens/LandingScreen.jsx": "features/onboarding/pages/LandingScreen.jsx",
    "screens/AiCoachScreen.jsx": "features/ai/pages/AiCoachScreen.jsx",
    "screens/DietScreen.jsx": "features/diet/pages/DietScreen.jsx",
    "screens/CommunityScreen.jsx": "features/community/pages/CommunityScreen.jsx",
    "screens/RewardsScreen.jsx": "features/rewards/pages/RewardsScreen.jsx",
    "screens/ProgressScreen.jsx": "features/progress/pages/ProgressScreen.jsx",
    "screens/PhaseDetailScreen.jsx": "features/dashboard/pages/PhaseDetailScreen.jsx", # or keep in root of features, let's put in dashboard mapped feature
    
    # Workout Specific Components
    "components/PRBanner.jsx": "features/workout/components/PRBanner.jsx",
    "components/workout/PRBanner.jsx": "features/workout/components/PRBanner.jsx",
    "components/RestTimer.jsx": "features/workout/components/RestTimer.jsx",
    "components/workout/RestTimer.jsx": "features/workout/components/RestTimer.jsx",
    "components/SetRow.jsx": "features/workout/components/SetRow.jsx",
    "components/workout/SetRow.jsx": "features/workout/components/SetRow.jsx",
    "components/VolumeBars.jsx": "features/workout/components/VolumeBars.jsx",
    "components/workout/VolumeBars.jsx": "features/workout/components/VolumeBars.jsx",
    "components/SectionLabel.jsx": "features/workout/components/SectionLabel.jsx",
    "components/workout/SectionLabel.jsx": "features/workout/components/SectionLabel.jsx",
    
    # Common Components
    "components/AppButton.jsx": "common/components/AppButton.jsx",
    "components/ui/AppButton.jsx": "common/components/AppButton.jsx",
    "components/AppCard.jsx": "common/components/AppCard.jsx",
    "components/ui/AppCard.jsx": "common/components/AppCard.jsx",
    "components/Badge.jsx": "common/components/Badge.jsx",
    "components/ui/Badge.jsx": "common/components/Badge.jsx",
    
    "components/BottomNav.jsx": "common/components/BottomNav.jsx",
    "components/layout/BottomNav.jsx": "common/components/BottomNav.jsx",
    "components/Divider.jsx": "common/components/Divider.jsx",
    "components/layout/Divider.jsx": "common/components/Divider.jsx",
    "components/PageHeader.jsx": "common/components/PageHeader.jsx",
    "components/layout/PageHeader.jsx": "common/components/PageHeader.jsx",

    # Context
    "context/AuthContext.jsx": "common/context/AuthContext.jsx",
}

base_dir_fwd = BASE_DIR.replace("\\", "/")

# 1. Discover all files
all_files = []
for root, dirs, files in os.walk(BASE_DIR):
    for f in files:
        if f.endswith(('.js', '.jsx', '.css')):
            all_files.append(os.path.join(root, f).replace("\\", "/"))

# Map from old_relative_path (without extension) -> new_relative_path (without extension)
# Also build move_map
move_map = {} # old_abs -> new_abs
logical_map = {} # old relpath without ext -> new relpath without ext

for abs_path in all_files:
    rel_path = abs_path.replace(base_dir_fwd + "/", "")
    target_rel = rel_path
    
    if rel_path in destinations:
        target_rel = destinations[rel_path]
        
    if rel_path != target_rel:
        move_map[abs_path] = os.path.join(base_dir_fwd, target_rel)
    else:
        move_map[abs_path] = os.path.join(base_dir_fwd, rel_path)
        
    old_no_suffix = os.path.splitext(rel_path)[0]
    new_no_suffix = os.path.splitext(target_rel)[0]
    
    # If there are duplicates, the dictionary will gracefully point multiple old no-suffixes to the same new target
    logical_map[old_no_suffix] = new_no_suffix
    # Also map index files, e.g., if rel_path is `some/dir/index.js`, `some/dir` should point to `new/dir`
    if old_no_suffix.endswith("/index"):
        logical_map[old_no_suffix[:-6]] = new_no_suffix[:-6]

print(f"Tracking {len(logical_map)} logical import targets.")

# 2. Iterate all files and compute the new content
file_new_contents = {}

def get_new_rel_import(old_file_rel, imported_str):
    # old_file_rel is the RELATIVE PATH of the file doing the importing
    # imported_str is the import string e.g., "../../screens/ProfileScreen"
    
    if not imported_str.startswith("."):
        return imported_str # Absolute import or node_modules
        
    # Find absolute logical path of the target in the OLD tree
    old_dir = os.path.dirname(old_file_rel)
    # Target old logical path (without ext)
    target_old_logical = os.path.normpath(os.path.join(old_dir, imported_str)).replace("\\", "/")
    
    # Search for this target in our logical map
    # It might exactly match
    target_new_logical = None
    if target_old_logical in logical_map:
        target_new_logical = logical_map[target_old_logical]
    else:
         return imported_str # Either a css file or not moved or not tracked
         
    # Now compute the relative path from the NEW directory of the importing file to the NEW logical target
    new_file_rel = destinations.get(old_file_rel, old_file_rel)
    new_dir = os.path.dirname(new_file_rel)
    
    new_imported = os.path.relpath(target_new_logical, new_dir).replace("\\", "/")
    if not new_imported.startswith("."):
        new_imported = "./" + new_imported
        
    return new_imported

# Regex to match `import ... from '...'` and `import('...')`
# We use a replacer function
import_regex = re.compile(r"((import|from)\s+['\"])(.+?)(['\"])")
dynamic_import_regex = re.compile(r"(import\(['\"])(.+?)(['\"]\))")

for abs_path in all_files:
    rel_path = abs_path.replace(base_dir_fwd + "/", "")
    
    with open(abs_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    def replacer(match):
        prefix = match.group(1)
        import_path = match.group(3)
        suffix = match.group(4)
        
        # Determine new import path
        new_path = get_new_rel_import(rel_path, import_path)
        return prefix + new_path + suffix
        
    content = import_regex.sub(replacer, content)
    
    def replacer_dynamic(match):
        prefix = match.group(1)
        import_path = match.group(2)
        suffix = match.group(3)
        new_path = get_new_rel_import(rel_path, import_path)
        return prefix + new_path + suffix

    content = dynamic_import_regex.sub(replacer_dynamic, content)
    file_new_contents[abs_path] = content


# 3. Create a temporary staging area or simply execute moves
# To avoid overwriting issues when paths clash, we first write ALL updated contents to the target paths in a new map.
# Then we will delete the old files (except those that didn't move) and write out the new files.

written_paths = set()
operations = [] # list of (target_abs, content)

for abs_path, content in file_new_contents.items():
    target_abs = move_map[abs_path]
    operations.append((target_abs, content))

# Keep track of old files to delete if they moved
files_to_delete = []
for abs_path in all_files:
    if move_map[abs_path] != abs_path:
        files_to_delete.append(abs_path)

# Execute deletes
for old_abs in files_to_delete:
    if os.path.exists(old_abs):
        # We also want to remove duplicates safely (e.g. components/AppButton AND components/ui/AppButton)
        # So deleting all old paths first is safest.
        os.remove(old_abs)

# Execute writes
for target_abs, content in operations:
    os.makedirs(os.path.dirname(target_abs), exist_ok=True)
    with open(target_abs, 'w', encoding='utf-8') as f:
        f.write(content)
        
# 4. Remove empty directories
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

# Write the mapping output
with open(os.path.join(base_dir_fwd, "../../MIGRATION_MAPPING_FRONTEND.csv"), 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(["Old Path", "New Path"])
    for old_abs, new_abs in move_map.items():
        if old_abs != new_abs:
            writer.writerow([old_abs.replace(base_dir_fwd+"/", ""), new_abs.replace(base_dir_fwd+"/", "")])


print("Frontend migration completed successfully!")
