import { prisma } from "./client";

const icebreakerQuestions = [
  "What are the top 3 items on your bucket list?",
  "What's your favorite way to unwind after work?",
  "What song do you embarrassingly know every word to?",
  "What fashion trend are you glad is gone?",
  "What fashion trend would you like to see come back?",
  "What's been your favorite team moment at work so far?",
  'What\'s your "comfort" movie or TV show?',
  "What did you eat for breakfast?",
  "What's your go-to karaoke song? Or, if you're shy, what's your favorite song to sing in the shower?",
  "What is your biggest guilty pleasure TV show?",
  "What's your favorite ice cream flavor?",
  "Describe your morning routine and your favorite breakfast food.",
  "Would the person you are now be friends with your middle school self?",
  "If you were in a circus, what would your act be?",
  "Describe your high school experience in one word.",
  "What's your favorite quote, and where's it from?",
  "What quirk did your parents have growing up that you thought was weird or annoying that you now find yourself doing?",
  "Would you rather be the funniest or smartest person in the room?",
  "Do you have any hidden talents?",
  "If you had all the money in the world, describe the dream house you would build or buy.",
  "What's the weirdest food you've ever tried?",
  "What's the worst career advice you've ever been given?",
  "If you had an extra hour every day, how would you use it?",
  "What was your very first job?",
  "What piece of advice has helped your career the most?",
  "If you could work your current job from anywhere in the world, where would you work?",
  "Who's your professional inspiration?",
  "Do you have a favorite tech toy or gadget that's made your job easier?",
  "Are you a dog person or a cat person? Why?",
  "If you were a baseball player, what would your entrance theme song be?",
  'What would your "cartoon character" outfit be?',
  "What's your all-time favorite TV show?",
  'What\'s the worst movie someone has ever told you that you "HAVE" to see?',
  "What's the best prank you ever pulled?",
  "What's your favorite interesting fact?",
  "The zombie apocalypse is coming – what 3 co-workers MUST be on your team?",
  "If you were left on a deserted island with either your worst enemy or no one, which would you choose? Why?",
  "What are your top 3 emojis?",
  "If you could clone yourself, what would your clone be doing right now?",
  "If you were on a reality show like The Real Housewives, what would your tagline be?",
  "Would you go on a UFO if you were invited?",
  "Be honest — if you don't tuck your feet under the blanket at night, do you think a monster will get them?",
  "Who on your team is the R2D2 to your C3P0?",
  "What's a GIF that describes your week?",
  "Would you rather go back in time to meet your ancestors or go to the future and meet your descendants?",
  "What supernatural creature would you want to have as a pet?",
  "If you could only eat ice cream or pudding for the rest of your life, which one would you pick? What flavor?",
  "The object to your left is your weapon in the apocalypse. What is it, and do you think it will help?",
  "Would you rather live in the ocean or on the moon? Why?",
  "Quick! Open the last book you read, turn to page 65, and give us the line out of context.",
];

async function main() {
  console.log("Seeding icebreaker questions...");

  // Clear existing questions
  await prisma.question.deleteMany();

  // Create all 50 icebreaker questions
  for (let i = 0; i < icebreakerQuestions.length; i++) {
    await prisma.question.create({
      data: {
        dayIndex: i + 1,
        text: icebreakerQuestions[i]!,
      },
    });
  }

  console.log(
    `Successfully seeded ${icebreakerQuestions.length} icebreaker questions!`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
