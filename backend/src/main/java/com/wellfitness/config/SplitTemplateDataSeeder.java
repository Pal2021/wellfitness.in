package com.wellfitness.config;

import com.wellfitness.features.split.entity.SplitTemplate;
import com.wellfitness.features.split.entity.SplitTemplateDay;
import com.wellfitness.repository.SplitTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Order(2)
@RequiredArgsConstructor
public class SplitTemplateDataSeeder implements CommandLineRunner {

    private final SplitTemplateRepository splitTemplateRepository;

    @Override
    public void run(String... args) {
        if (splitTemplateRepository.count() > 0) {
            log.info("Split templates already seeded, skipping...");
            return;
        }

        seedPPL();
        seedUpperLower();
        seedBroSplit();
        seedFullBody();
        seedArnold();
        seedCustom();

        log.info("Seeded 6 split templates successfully");
    }

    private void seedPPL() {
        SplitTemplate t = SplitTemplate.builder()
                .name("Push Pull Legs").shortName("PPL").iconEmoji("🔄")
                .description("High frequency split hitting each muscle group twice per week")
                .frequencyDays(6).difficulty("INTERMEDIATE")
                .goal("Muscle growth + strength").build();

        addDay(t, "MON", "Push A", 1, false,
                "[{\"name\":\"Barbell Bench Press\",\"sets\":4,\"reps\":8},{\"name\":\"Overhead Press\",\"sets\":4,\"reps\":8},{\"name\":\"Incline DB Press\",\"sets\":3,\"reps\":10},{\"name\":\"Lateral Raise\",\"sets\":3,\"reps\":15},{\"name\":\"Tricep Pushdown\",\"sets\":3,\"reps\":12},{\"name\":\"Skull Crusher\",\"sets\":3,\"reps\":10}]");
        addDay(t, "TUE", "Pull A", 2, false,
                "[{\"name\":\"Pull-up\",\"sets\":4,\"reps\":8},{\"name\":\"Barbell Row\",\"sets\":4,\"reps\":8},{\"name\":\"Lat Pulldown\",\"sets\":3,\"reps\":10},{\"name\":\"Face Pull\",\"sets\":3,\"reps\":15},{\"name\":\"Barbell Curl\",\"sets\":3,\"reps\":10},{\"name\":\"Hammer Curl\",\"sets\":3,\"reps\":12}]");
        addDay(t, "WED", "Legs A", 3, false,
                "[{\"name\":\"Barbell Squat\",\"sets\":4,\"reps\":8},{\"name\":\"Romanian Deadlift\",\"sets\":3,\"reps\":10},{\"name\":\"Leg Press\",\"sets\":3,\"reps\":12},{\"name\":\"Leg Curl\",\"sets\":3,\"reps\":12},{\"name\":\"Leg Extension\",\"sets\":3,\"reps\":15},{\"name\":\"Calf Raise\",\"sets\":4,\"reps\":20}]");
        addDay(t, "THU", "Push B", 4, false,
                "[{\"name\":\"Incline Barbell Press\",\"sets\":4,\"reps\":8},{\"name\":\"Seated DB Press\",\"sets\":4,\"reps\":10},{\"name\":\"Cable Fly\",\"sets\":3,\"reps\":12},{\"name\":\"Lateral Raise\",\"sets\":3,\"reps\":15},{\"name\":\"Skull Crusher\",\"sets\":3,\"reps\":10},{\"name\":\"Overhead Tricep Extension\",\"sets\":3,\"reps\":12}]");
        addDay(t, "FRI", "Pull B", 5, false,
                "[{\"name\":\"Deadlift\",\"sets\":4,\"reps\":5},{\"name\":\"Cable Row\",\"sets\":4,\"reps\":10},{\"name\":\"Single Arm DB Row\",\"sets\":3,\"reps\":10},{\"name\":\"Straight Arm Pulldown\",\"sets\":3,\"reps\":12},{\"name\":\"Preacher Curl\",\"sets\":3,\"reps\":10},{\"name\":\"Concentration Curl\",\"sets\":3,\"reps\":12}]");
        addDay(t, "SAT", "Legs B", 6, false,
                "[{\"name\":\"Front Squat\",\"sets\":4,\"reps\":6},{\"name\":\"Hip Thrust\",\"sets\":4,\"reps\":10},{\"name\":\"Hack Squat\",\"sets\":3,\"reps\":10},{\"name\":\"Nordic Curl\",\"sets\":3,\"reps\":8},{\"name\":\"Leg Extension\",\"sets\":3,\"reps\":15},{\"name\":\"Calf Raise\",\"sets\":4,\"reps\":20}]");
        addDay(t, "SUN", "Rest", 7, true, "[]");

        splitTemplateRepository.save(t);
    }

    private void seedUpperLower() {
        SplitTemplate t = SplitTemplate.builder()
                .name("Upper / Lower").shortName("UPPER_LOWER").iconEmoji("⬆️")
                .description("4-day split alternating upper and lower body workouts")
                .frequencyDays(4).difficulty("BEGINNER")
                .goal("Strength + muscle").build();

        addDay(t, "MON", "Upper A", 1, false,
                "[{\"name\":\"Barbell Bench Press\",\"sets\":4,\"reps\":5},{\"name\":\"Barbell Row\",\"sets\":4,\"reps\":5},{\"name\":\"Overhead Press\",\"sets\":3,\"reps\":6},{\"name\":\"Pull-up\",\"sets\":3,\"reps\":6},{\"name\":\"Barbell Curl\",\"sets\":3,\"reps\":10},{\"name\":\"Tricep Pushdown\",\"sets\":3,\"reps\":10}]");
        addDay(t, "TUE", "Lower A", 2, false,
                "[{\"name\":\"Barbell Squat\",\"sets\":4,\"reps\":5},{\"name\":\"Romanian Deadlift\",\"sets\":4,\"reps\":6},{\"name\":\"Leg Press\",\"sets\":3,\"reps\":8},{\"name\":\"Leg Curl\",\"sets\":3,\"reps\":10},{\"name\":\"Calf Raise\",\"sets\":4,\"reps\":15}]");
        addDay(t, "WED", "Rest", 3, true, "[]");
        addDay(t, "THU", "Upper B", 4, false,
                "[{\"name\":\"Incline DB Press\",\"sets\":4,\"reps\":10},{\"name\":\"Cable Row\",\"sets\":4,\"reps\":10},{\"name\":\"Lateral Raise\",\"sets\":3,\"reps\":15},{\"name\":\"Face Pull\",\"sets\":3,\"reps\":15},{\"name\":\"Hammer Curl\",\"sets\":3,\"reps\":12},{\"name\":\"Skull Crusher\",\"sets\":3,\"reps\":12}]");
        addDay(t, "FRI", "Lower B", 5, false,
                "[{\"name\":\"Deadlift\",\"sets\":4,\"reps\":5},{\"name\":\"Hip Thrust\",\"sets\":4,\"reps\":10},{\"name\":\"Hack Squat\",\"sets\":3,\"reps\":12},{\"name\":\"Leg Extension\",\"sets\":3,\"reps\":15},{\"name\":\"Leg Curl\",\"sets\":3,\"reps\":15},{\"name\":\"Calf Raise\",\"sets\":4,\"reps\":20}]");
        addDay(t, "SAT", "Rest", 6, true, "[]");
        addDay(t, "SUN", "Rest", 7, true, "[]");

        splitTemplateRepository.save(t);
    }

    private void seedBroSplit() {
        SplitTemplate t = SplitTemplate.builder()
                .name("Bro Split").shortName("BRO_SPLIT").iconEmoji("💪")
                .description("Classic bodybuilding split — one muscle group per day")
                .frequencyDays(5).difficulty("INTERMEDIATE")
                .goal("Muscle definition + size").build();

        addDay(t, "MON", "Chest", 1, false,
                "[{\"name\":\"Barbell Bench Press\",\"sets\":4,\"reps\":8},{\"name\":\"Incline DB Press\",\"sets\":4,\"reps\":10},{\"name\":\"Decline Bench\",\"sets\":3,\"reps\":10},{\"name\":\"Cable Fly\",\"sets\":3,\"reps\":12},{\"name\":\"Pec Deck\",\"sets\":3,\"reps\":15},{\"name\":\"Chest Dip\",\"sets\":3,\"reps\":12}]");
        addDay(t, "TUE", "Back", 2, false,
                "[{\"name\":\"Deadlift\",\"sets\":4,\"reps\":5},{\"name\":\"Pull-up\",\"sets\":4,\"reps\":8},{\"name\":\"Barbell Row\",\"sets\":4,\"reps\":8},{\"name\":\"Cable Row\",\"sets\":3,\"reps\":10},{\"name\":\"Lat Pulldown\",\"sets\":3,\"reps\":12},{\"name\":\"Straight Arm Pulldown\",\"sets\":3,\"reps\":15}]");
        addDay(t, "WED", "Legs", 3, false,
                "[{\"name\":\"Barbell Squat\",\"sets\":4,\"reps\":8},{\"name\":\"Romanian Deadlift\",\"sets\":4,\"reps\":10},{\"name\":\"Leg Press\",\"sets\":4,\"reps\":12},{\"name\":\"Leg Curl\",\"sets\":3,\"reps\":12},{\"name\":\"Leg Extension\",\"sets\":3,\"reps\":15},{\"name\":\"Calf Raise\",\"sets\":5,\"reps\":20}]");
        addDay(t, "THU", "Shoulders", 4, false,
                "[{\"name\":\"Overhead Press\",\"sets\":4,\"reps\":8},{\"name\":\"Seated DB Press\",\"sets\":4,\"reps\":10},{\"name\":\"Lateral Raise\",\"sets\":4,\"reps\":15},{\"name\":\"Front Raise\",\"sets\":3,\"reps\":12},{\"name\":\"Rear Delt Fly\",\"sets\":3,\"reps\":15},{\"name\":\"Shrugs\",\"sets\":4,\"reps\":12}]");
        addDay(t, "FRI", "Arms", 5, false,
                "[{\"name\":\"Barbell Curl\",\"sets\":4,\"reps\":10},{\"name\":\"Skull Crusher\",\"sets\":4,\"reps\":10},{\"name\":\"Hammer Curl\",\"sets\":3,\"reps\":12},{\"name\":\"Tricep Pushdown\",\"sets\":3,\"reps\":12},{\"name\":\"Preacher Curl\",\"sets\":3,\"reps\":10},{\"name\":\"Overhead Tricep Extension\",\"sets\":3,\"reps\":12},{\"name\":\"Concentration Curl\",\"sets\":3,\"reps\":12},{\"name\":\"Tricep Dip\",\"sets\":3,\"reps\":12}]");
        addDay(t, "SAT", "Rest", 6, true, "[]");
        addDay(t, "SUN", "Rest", 7, true, "[]");

        splitTemplateRepository.save(t);
    }

    private void seedFullBody() {
        SplitTemplate t = SplitTemplate.builder()
                .name("Full Body").shortName("FULL_BODY").iconEmoji("🌐")
                .description("3-day full body program perfect for beginners")
                .frequencyDays(3).difficulty("BEGINNER")
                .goal("Strength foundation").build();

        addDay(t, "MON", "Full Body A", 1, false,
                "[{\"name\":\"Barbell Squat\",\"sets\":3,\"reps\":5},{\"name\":\"Barbell Bench Press\",\"sets\":3,\"reps\":5},{\"name\":\"Barbell Row\",\"sets\":3,\"reps\":5},{\"name\":\"Overhead Press\",\"sets\":3,\"reps\":8},{\"name\":\"Romanian Deadlift\",\"sets\":3,\"reps\":8},{\"name\":\"Plank\",\"sets\":3,\"reps\":60}]");
        addDay(t, "TUE", "Rest", 2, true, "[]");
        addDay(t, "WED", "Full Body B", 3, false,
                "[{\"name\":\"Deadlift\",\"sets\":3,\"reps\":5},{\"name\":\"Incline DB Press\",\"sets\":3,\"reps\":8},{\"name\":\"Pull-up\",\"sets\":3,\"reps\":8},{\"name\":\"Leg Press\",\"sets\":3,\"reps\":10},{\"name\":\"Lateral Raise\",\"sets\":3,\"reps\":12},{\"name\":\"Ab Wheel\",\"sets\":3,\"reps\":10}]");
        addDay(t, "THU", "Rest", 4, true, "[]");
        addDay(t, "FRI", "Full Body C", 5, false,
                "[{\"name\":\"Front Squat\",\"sets\":3,\"reps\":5},{\"name\":\"Chest Dip\",\"sets\":3,\"reps\":8},{\"name\":\"Cable Row\",\"sets\":3,\"reps\":8},{\"name\":\"Hip Thrust\",\"sets\":3,\"reps\":10},{\"name\":\"Face Pull\",\"sets\":3,\"reps\":15},{\"name\":\"Hanging Leg Raise\",\"sets\":3,\"reps\":12}]");
        addDay(t, "SAT", "Rest", 6, true, "[]");
        addDay(t, "SUN", "Rest", 7, true, "[]");

        splitTemplateRepository.save(t);
    }

    private void seedArnold() {
        SplitTemplate t = SplitTemplate.builder()
                .name("Arnold Split").shortName("ARNOLD").iconEmoji("🏆")
                .description("Arnold Schwarzenegger's classic 6-day high-volume split")
                .frequencyDays(6).difficulty("ADVANCED")
                .goal("Maximum muscle mass").build();

        addDay(t, "MON", "Chest + Back", 1, false,
                "[{\"name\":\"Barbell Bench Press\",\"sets\":4,\"reps\":8},{\"name\":\"Pull-up\",\"sets\":4,\"reps\":8},{\"name\":\"Incline DB Press\",\"sets\":3,\"reps\":10},{\"name\":\"Barbell Row\",\"sets\":4,\"reps\":8},{\"name\":\"Cable Fly\",\"sets\":3,\"reps\":12},{\"name\":\"Lat Pulldown\",\"sets\":3,\"reps\":10}]");
        addDay(t, "TUE", "Shoulders + Arms", 2, false,
                "[{\"name\":\"Overhead Press\",\"sets\":4,\"reps\":8},{\"name\":\"Barbell Curl\",\"sets\":4,\"reps\":10},{\"name\":\"Lateral Raise\",\"sets\":3,\"reps\":15},{\"name\":\"Skull Crusher\",\"sets\":4,\"reps\":10},{\"name\":\"Rear Delt Fly\",\"sets\":3,\"reps\":15},{\"name\":\"Hammer Curl\",\"sets\":3,\"reps\":12},{\"name\":\"Tricep Pushdown\",\"sets\":3,\"reps\":12}]");
        addDay(t, "WED", "Legs", 3, false,
                "[{\"name\":\"Barbell Squat\",\"sets\":4,\"reps\":8},{\"name\":\"Romanian Deadlift\",\"sets\":4,\"reps\":10},{\"name\":\"Leg Press\",\"sets\":3,\"reps\":12},{\"name\":\"Leg Curl\",\"sets\":3,\"reps\":12},{\"name\":\"Calf Raise\",\"sets\":5,\"reps\":20}]");
        addDay(t, "THU", "Chest + Back", 4, false,
                "[{\"name\":\"Incline Barbell Press\",\"sets\":4,\"reps\":8},{\"name\":\"Deadlift\",\"sets\":4,\"reps\":5},{\"name\":\"Pec Deck\",\"sets\":3,\"reps\":12},{\"name\":\"Cable Row\",\"sets\":4,\"reps\":10},{\"name\":\"Chest Dip\",\"sets\":3,\"reps\":10},{\"name\":\"Single Arm DB Row\",\"sets\":3,\"reps\":10}]");
        addDay(t, "FRI", "Shoulders + Arms", 5, false,
                "[{\"name\":\"Seated DB Press\",\"sets\":4,\"reps\":10},{\"name\":\"Preacher Curl\",\"sets\":3,\"reps\":10},{\"name\":\"Arnold Press\",\"sets\":3,\"reps\":10},{\"name\":\"Overhead Tricep Extension\",\"sets\":3,\"reps\":12},{\"name\":\"Upright Row\",\"sets\":3,\"reps\":12},{\"name\":\"Concentration Curl\",\"sets\":3,\"reps\":12},{\"name\":\"Tricep Dip\",\"sets\":3,\"reps\":12}]");
        addDay(t, "SAT", "Legs", 6, false,
                "[{\"name\":\"Front Squat\",\"sets\":4,\"reps\":6},{\"name\":\"Hip Thrust\",\"sets\":4,\"reps\":10},{\"name\":\"Hack Squat\",\"sets\":3,\"reps\":10},{\"name\":\"Nordic Curl\",\"sets\":3,\"reps\":8},{\"name\":\"Leg Extension\",\"sets\":3,\"reps\":15},{\"name\":\"Calf Raise\",\"sets\":5,\"reps\":20}]");
        addDay(t, "SUN", "Rest", 7, true, "[]");

        splitTemplateRepository.save(t);
    }

    private void seedCustom() {
        SplitTemplate t = SplitTemplate.builder()
                .name("Custom").shortName("CUSTOM").iconEmoji("✏️")
                .description("Build your own split from scratch")
                .frequencyDays(0).difficulty("ANY")
                .goal("User defined").build();

        addDay(t, "MON", "Day 1", 1, false, "[]");
        addDay(t, "TUE", "Day 2", 2, false, "[]");
        addDay(t, "WED", "Day 3", 3, false, "[]");
        addDay(t, "THU", "Day 4", 4, false, "[]");
        addDay(t, "FRI", "Day 5", 5, false, "[]");
        addDay(t, "SAT", "Day 6", 6, false, "[]");
        addDay(t, "SUN", "Rest", 7, true, "[]");

        splitTemplateRepository.save(t);
    }

    private void addDay(SplitTemplate template, String dayOfWeek, String label,
                        int displayOrder, boolean isRestDay, String exercises) {
        SplitTemplateDay day = SplitTemplateDay.builder()
                .template(template)
                .dayOfWeek(dayOfWeek)
                .label(label)
                .displayOrder(displayOrder)
                .isRestDay(isRestDay)
                .exercises(exercises)
                .build();
        template.getDays().add(day);
    }
}
