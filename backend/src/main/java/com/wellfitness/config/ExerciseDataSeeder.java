package com.wellfitness.config;

import com.wellfitness.model.Exercise;
import com.wellfitness.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class ExerciseDataSeeder implements CommandLineRunner {

    private final ExerciseRepository exerciseRepository;

    @Override
    public void run(String... args) {
        if (exerciseRepository.count() > 0) {
            log.info("Exercises already seeded, skipping...");
            return;
        }

        List<Exercise> exercises = new ArrayList<>();

        // ──── CHEST ────
        exercises.add(exercise("Barbell Bench Press", "CHEST", "Triceps, Shoulders", "BARBELL", "INTERMEDIATE", true,
                "Lie on a flat bench, grip the barbell slightly wider than shoulder width. Lower to chest, press up."));
        exercises.add(exercise("Incline DB Press", "CHEST", "Shoulders, Triceps", "DUMBBELL", "INTERMEDIATE", true,
                "Set bench to 30-45 degrees, press dumbbells up from chest level."));
        exercises.add(exercise("Decline Bench", "CHEST", "Triceps", "BARBELL", "INTERMEDIATE", true,
                "Set bench to decline, lower barbell to lower chest, press up."));
        exercises.add(exercise("Cable Fly", "CHEST", null, "CABLE", "BEGINNER", false,
                "Stand between cable towers, bring handles together in front of chest with slight bend in elbows."));
        exercises.add(exercise("Dumbbell Fly", "CHEST", null, "DUMBBELL", "BEGINNER", false,
                "Lie on flat bench, open arms wide with slight elbow bend, bring dumbbells together above chest."));
        exercises.add(exercise("Chest Dip", "CHEST", "Triceps, Shoulders", "BODYWEIGHT", "INTERMEDIATE", true,
                "Lean forward on dip bars, lower body until stretch in chest, push back up."));
        exercises.add(exercise("Pec Deck", "CHEST", null, "MACHINE", "BEGINNER", false,
                "Sit at pec deck machine, bring pads together in front of chest."));
        exercises.add(exercise("Push-up", "CHEST", "Triceps, Shoulders", "BODYWEIGHT", "BEGINNER", true,
                "Standard push-up position, lower chest to floor, press up."));
        exercises.add(exercise("Close Grip Bench Press", "CHEST", "Triceps", "BARBELL", "INTERMEDIATE", true,
                "Grip barbell at shoulder width or narrower, lower to chest, press up."));
        exercises.add(exercise("Incline Barbell Press", "CHEST", "Shoulders, Triceps", "BARBELL", "INTERMEDIATE", true,
                "Set bench to 30-45 degrees, press barbell up from upper chest."));

        // ──── BACK ────
        exercises.add(exercise("Deadlift", "BACK", "Hamstrings, Glutes, Core", "BARBELL", "ADVANCED", true,
                "Stand over barbell, grip outside knees, hinge at hips and lift with straight back."));
        exercises.add(exercise("Pull-up", "BACK", "Biceps", "BODYWEIGHT", "INTERMEDIATE", true,
                "Hang from bar with overhand grip, pull chin above bar, lower with control."));
        exercises.add(exercise("Barbell Row", "BACK", "Biceps, Rear Delts", "BARBELL", "INTERMEDIATE", true,
                "Hinge forward 45 degrees, pull barbell to lower chest/upper abs."));
        exercises.add(exercise("Cable Row", "BACK", "Biceps, Rear Delts", "CABLE", "BEGINNER", true,
                "Sit at cable row station, pull handle to lower chest, squeeze shoulder blades."));
        exercises.add(exercise("Lat Pulldown", "BACK", "Biceps", "CABLE", "BEGINNER", true,
                "Sit at lat pulldown, pull bar to upper chest with wide grip."));
        exercises.add(exercise("T-Bar Row", "BACK", "Biceps, Rear Delts", "BARBELL", "INTERMEDIATE", true,
                "Straddle T-bar, grip handles, pull weight to chest keeping back flat."));
        exercises.add(exercise("Single Arm DB Row", "BACK", "Biceps", "DUMBBELL", "BEGINNER", false,
                "One hand on bench, pull dumbbell to hip with other hand. Keep back flat."));
        exercises.add(exercise("Face Pull", "BACK", "Rear Delts", "CABLE", "BEGINNER", false,
                "Set cable to face height, pull rope to face with elbows high."));
        exercises.add(exercise("Straight Arm Pulldown", "BACK", "Core", "CABLE", "BEGINNER", false,
                "Stand at cable, arms straight, pull bar down to thighs with lat engagement."));

        // ──── LEGS ────
        exercises.add(exercise("Barbell Squat", "LEGS", "Glutes, Core", "BARBELL", "INTERMEDIATE", true,
                "Bar on upper back, squat down until thighs parallel, stand back up."));
        exercises.add(exercise("Front Squat", "LEGS", "Core, Glutes", "BARBELL", "ADVANCED", true,
                "Bar on front delts, elbows high, squat deep keeping torso upright."));
        exercises.add(exercise("Romanian Deadlift", "LEGS", "Glutes, Lower Back", "BARBELL", "INTERMEDIATE", true,
                "Hold barbell at hips, hinge forward with slight knee bend, feel hamstring stretch."));
        exercises.add(exercise("Leg Press", "LEGS", "Glutes", "MACHINE", "BEGINNER", true,
                "Sit in leg press, feet shoulder-width on platform, press up and lower with control."));
        exercises.add(exercise("Hack Squat", "LEGS", "Glutes", "MACHINE", "INTERMEDIATE", true,
                "Stand in hack squat machine, squat down and press up."));
        exercises.add(exercise("Leg Curl", "LEGS", null, "MACHINE", "BEGINNER", false,
                "Lie face down on leg curl machine, curl weight toward glutes."));
        exercises.add(exercise("Leg Extension", "LEGS", null, "MACHINE", "BEGINNER", false,
                "Sit at leg extension machine, extend legs fully, lower with control."));
        exercises.add(exercise("Hip Thrust", "LEGS", "Glutes", "BARBELL", "INTERMEDIATE", true,
                "Upper back on bench, barbell on hips, thrust hips up squeezing glutes."));
        exercises.add(exercise("Bulgarian Split Squat", "LEGS", "Glutes", "DUMBBELL", "INTERMEDIATE", true,
                "Rear foot on bench, front foot forward, squat down on front leg."));
        exercises.add(exercise("Calf Raise", "LEGS", null, "MACHINE", "BEGINNER", false,
                "Stand on calf raise platform, raise heels as high as possible, lower slowly."));
        exercises.add(exercise("Nordic Curl", "LEGS", null, "BODYWEIGHT", "ADVANCED", false,
                "Kneel with feet anchored, slowly lower body forward using hamstrings, push back up."));

        // ──── SHOULDERS ────
        exercises.add(exercise("Overhead Press", "SHOULDERS", "Triceps", "BARBELL", "INTERMEDIATE", true,
                "Standing, press barbell from front shoulders to overhead lockout."));
        exercises.add(exercise("Seated DB Press", "SHOULDERS", "Triceps", "DUMBBELL", "BEGINNER", true,
                "Sit with back support, press dumbbells from shoulder level overhead."));
        exercises.add(exercise("Lateral Raise", "SHOULDERS", null, "DUMBBELL", "BEGINNER", false,
                "Stand with dumbbells at sides, raise arms out to sides until parallel with floor."));
        exercises.add(exercise("Front Raise", "SHOULDERS", null, "DUMBBELL", "BEGINNER", false,
                "Stand with dumbbells at front of thighs, raise one or both arms to eye level."));
        exercises.add(exercise("Rear Delt Fly", "SHOULDERS", "Upper Back", "DUMBBELL", "BEGINNER", false,
                "Bend forward, raise dumbbells out to sides squeezing rear delts."));
        exercises.add(exercise("Upright Row", "SHOULDERS", "Traps", "BARBELL", "INTERMEDIATE", false,
                "Hold barbell with narrow grip, pull up along body to chin level."));
        exercises.add(exercise("Shrugs", "SHOULDERS", "Traps", "DUMBBELL", "BEGINNER", false,
                "Hold heavy dumbbells at sides, shrug shoulders up toward ears and hold briefly."));
        exercises.add(exercise("Arnold Press", "SHOULDERS", "Triceps", "DUMBBELL", "INTERMEDIATE", true,
                "Start with palms facing you, rotate palms forward while pressing overhead."));

        // ──── BICEPS ────
        exercises.add(exercise("Barbell Curl", "BICEPS", null, "BARBELL", "BEGINNER", false,
                "Stand with barbell, curl weight up keeping elbows at sides."));
        exercises.add(exercise("Hammer Curl", "BICEPS", "Forearms", "DUMBBELL", "BEGINNER", false,
                "Hold dumbbells with neutral grip (palms facing each other), curl up."));
        exercises.add(exercise("Preacher Curl", "BICEPS", null, "BARBELL", "BEGINNER", false,
                "Rest arms on preacher bench pad, curl weight up from full extension."));
        exercises.add(exercise("Concentration Curl", "BICEPS", null, "DUMBBELL", "BEGINNER", false,
                "Sit on bench, brace elbow against inner thigh, curl dumbbell up."));
        exercises.add(exercise("Cable Curl", "BICEPS", null, "CABLE", "BEGINNER", false,
                "Stand at cable machine with bar attachment, curl toward shoulders."));
        exercises.add(exercise("Incline DB Curl", "BICEPS", null, "DUMBBELL", "INTERMEDIATE", false,
                "Lie back on incline bench, curl dumbbells up with arms hanging straight down."));

        // ──── TRICEPS ────
        exercises.add(exercise("Skull Crusher", "TRICEPS", null, "BARBELL", "INTERMEDIATE", false,
                "Lie on bench, lower barbell to forehead by bending elbows, extend back up."));
        exercises.add(exercise("Tricep Pushdown", "TRICEPS", null, "CABLE", "BEGINNER", false,
                "Stand at cable machine, push bar/rope down by extending elbows fully."));
        exercises.add(exercise("Overhead Tricep Extension", "TRICEPS", null, "DUMBBELL", "BEGINNER", false,
                "Hold dumbbell overhead with both hands, lower behind head, extend back up."));
        exercises.add(exercise("Tricep Dip", "TRICEPS", "Chest, Shoulders", "BODYWEIGHT", "INTERMEDIATE", true,
                "Upright position on dip bars, lower body by bending elbows, push back up."));
        exercises.add(exercise("Diamond Push-up", "TRICEPS", "Chest", "BODYWEIGHT", "INTERMEDIATE", true,
                "Push-up with hands close together forming a diamond shape under chest."));

        // ──── CORE ────
        exercises.add(exercise("Plank", "CORE", null, "BODYWEIGHT", "BEGINNER", false,
                "Hold push-up position on forearms, keep body in straight line. Hold for time."));
        exercises.add(exercise("Ab Wheel", "CORE", null, "BODYWEIGHT", "INTERMEDIATE", false,
                "Kneel with ab wheel, roll forward stretching body out, roll back using abs."));
        exercises.add(exercise("Cable Crunch", "CORE", null, "CABLE", "BEGINNER", false,
                "Kneel at cable machine with rope behind head, crunch down squeezing abs."));
        exercises.add(exercise("Hanging Leg Raise", "CORE", null, "BODYWEIGHT", "INTERMEDIATE", false,
                "Hang from bar, raise straight legs to parallel or higher."));
        exercises.add(exercise("Russian Twist", "CORE", "Obliques", "BODYWEIGHT", "BEGINNER", false,
                "Sit with knees bent, lean back slightly, rotate torso side to side."));
        exercises.add(exercise("Dead Bug", "CORE", null, "BODYWEIGHT", "BEGINNER", false,
                "Lie on back, arms up, knees at 90 degrees. Extend opposite arm and leg alternately."));

        exerciseRepository.saveAll(exercises);
        log.info("Seeded {} exercises successfully", exercises.size());
    }

    private Exercise exercise(String name, String muscleGroup, String secondaryMuscles,
                              String equipment, String difficulty, boolean isCompound,
                              String instructions) {
        return Exercise.builder()
                .name(name)
                .muscleGroup(muscleGroup)
                .secondaryMuscles(secondaryMuscles)
                .equipment(equipment)
                .difficulty(difficulty)
                .isCompound(isCompound)
                .instructions(instructions)
                .build();
    }
}
