// tips.js — Tips & Techniques for Selective Exam Prep (kids-first voice)
// ─────────────────────────────────────────────────────────────────────────────

const TIPS_DATA = {

  // ── OVERVIEW CARDS (shown on Tips home) ────────────────────────────────────
  overview: [
    {
      id:'mindset', emoji:'🧠', title:'The Right Mindset',
      color:'var(--accent)', tagline:'Selective exams test HOW you think, not what you\'ve memorised.',
      preview:'The #1 mistake students make is trying to memorise facts. Here\'s what actually works.'
    },
    {
      id:'reading', emoji:'📖', title:'Reading & Comprehension',
      color:'var(--pink)', tagline:'Find the answer IN the text — your opinion doesn\'t count here.',
      preview:'3-step method to nail inference questions every time.'
    },
    {
      id:'maths', emoji:'🔢', title:'Mathematics',
      color:'var(--green)', tagline:'Underline what the question ASKS — not just what it gives you.',
      preview:'Speed tricks, working backwards, and avoiding the most common traps.'
    },
    {
      id:'verbal', emoji:'🧠', title:'Verbal Reasoning',
      color:'var(--purple)', tagline:'Word roots are your superpower — learn 20 roots, unlock 200+ words.',
      preview:'How to crack analogies, odd-one-out, and sentence completion fast.'
    },
    {
      id:'quant', emoji:'📐', title:'Quantitative Reasoning',
      color:'var(--orange)', tagline:'Look for the pattern before you calculate anything.',
      preview:'Sequence tricks, symbol substitution shortcuts, and grid puzzle tactics.'
    },
    {
      id:'writing', emoji:'✍️', title:'Writing',
      color:'var(--teal)', tagline:'Plan for 5 minutes. Write for 30. Never skip the plan.',
      preview:'The TEEL paragraph structure + how to hook a marker in the first 3 lines.'
    },
    {
      id:'examday', emoji:'⏱️', title:'Exam Day Strategy',
      color:'var(--yellow)', tagline:'60 seconds per question. Skip. Return. Never leave a blank.',
      preview:'Time management, guessing strategy, and how to stay calm under pressure.'
    },
    {
      id:'habits', emoji:'📅', title:'Study Habits That Work',
      color:'var(--red)', tagline:'20 minutes daily beats 3 hours once a week — every time.',
      preview:'Building a study routine that actually sticks, including fun ways to practice.'
    },
  ],

  // ── DETAILED TIP PAGES ──────────────────────────────────────────────────────
  pages: {

    mindset: {
      emoji:'🧠', title:'The Right Mindset', color:'var(--accent)',
      intro:'Selective exams are different from school tests. Your teacher can\'t help you study for them the normal way — because they don\'t test what you\'ve learned. They test HOW you think.',
      sections:[
        {
          heading:'🎯 What selective exams actually test',
          content:`Here's the big secret: selective exams don't care if you know the capital of France or how photosynthesis works.

They test:
• Can you spot a pattern nobody pointed out to you?
• Can you figure out what a word means even if you've never seen it?
• Can you read between the lines of a passage?
• Can you solve a maths problem you've never seen before?

This means you CAN get better at selective exams — but not by reading your school textbooks.`,
          tip:'💡 Tip: Read widely. News articles, novels, science magazines, puzzles. The best students aren\'t memorising — they\'re practising thinking.'
        },
        {
          heading:'🏋️ Thinking is a skill you train',
          content:`Your brain is a muscle. You get better at reasoning the same way you get better at sport — through regular practice, not cramming the night before.

The best preparation is:
1. Do a few questions every day (not 100 in one sitting)
2. When you get something wrong, understand WHY before moving on
3. Try to explain the answer to someone else — if you can explain it, you understand it`,
          tip:'💡 Tip: Getting a question wrong is useful — it shows you exactly what to work on. Don\'t skip over wrong answers!'
        },
        {
          heading:'😤 What to do when you\'re stuck',
          content:`Every student gets stuck. Here\'s a 3-step process:

Step 1 — Eliminate
Cross out answers you KNOW are wrong. Even if you can\'t find the right answer, you can often narrow it down to 2 options. That\'s already a 50% chance.

Step 2 — Plug in
For maths questions, try putting the answer options back into the question. Start from the middle value — if it\'s too big, try smaller.

Step 3 — Trust your gut
After eliminating, your first instinct is usually right. Don\'t second-guess unless you find a clear reason to.`,
          tip:'💡 Tip: Never leave a question blank — there\'s no penalty for guessing in selective exams. Always put something!'
        },
        {
          heading:'🧘 Managing nerves',
          content:`Feeling nervous before an exam is completely normal — even good students feel it. Here\'s what actually helps:

• Deep breaths really do work. Try breathing in for 4 counts, hold for 4, out for 4.
• If you panic mid-exam, skip the question and move on. Come back to it.
• Remember: every student in the room is feeling the same thing.
• You have practiced. Trust your preparation.`,
          tip:'💡 Tip: The night before, don\'t cram. Sleep is more valuable than last-minute studying — a tired brain makes silly mistakes.'
        }
      ]
    },

    reading: {
      emoji:'📖', title:'Reading & Comprehension', color:'var(--pink)',
      intro:'Reading comprehension looks easy — just read the passage and answer the questions, right? But most students lose marks by doing one thing wrong: they answer from their own knowledge or opinion instead of from the text.',
      sections:[
        {
          heading:'📜 The Golden Rule',
          content:`EVERYTHING you write must come from the text.

In selective exams, it doesn\'t matter if:
• You know more about the topic than what\'s written
• You personally disagree with the author
• You think a different answer "makes more sense"

The only answer that counts is the one the text supports.

Test yourself: Before you choose an answer, ask "Where in the passage does it say this?" If you can\'t point to it, that\'s probably not the right answer.`,
          tip:'💡 Tip: Underline key parts of the passage as you read. This gives you a map to find evidence quickly.'
        },
        {
          heading:'🔍 The 3-Step Method for Inference Questions',
          content:`Inference questions ask what the text IMPLIES — not what it says directly. These are the hardest, but there\'s a method:

Step 1 — Read the clue sentence
Find the part of the text the question is referring to.

Step 2 — Ask "What does this tell me?"
Don\'t look for words that directly state the answer. Look for what logically follows.

Step 3 — Test each option
Read each option and ask: "Does the passage support this?" Eliminate ones that go too far, or don\'t match.

Example: "She grabbed her umbrella before leaving." 
→ Inference: It was raining or she expected rain. NOT "She was going to the beach."`,
          tip:'💡 Tip: Wrong inference answers usually either (a) go TOO far beyond the text, or (b) directly contradict it. The correct answer is always firmly grounded in what\'s actually written.'
        },
        {
          heading:'📝 Question types and how to tackle them',
          content:`MAIN IDEA questions: Read the first and last paragraph. The main idea is almost always there. Ask: "What is this passage mostly about?"

VOCABULARY in context: Don\'t just use your knowledge of the word — read the sentence it\'s in. The context might give it a specific meaning.

AUTHOR\'S PURPOSE: Ask yourself — why did the writer write this? To inform? To persuade? To entertain? To criticise? Look at the tone and structure.

COMPARE/CONTRAST: Look for signal words — "however", "on the other hand", "unlike", "similarly", "whereas".

SEQUENCE/ORDER: Look for time words — "first", "then", "after", "finally", "before".`,
          tip:'💡 Tip: Answer the questions you\'re confident about first. Then go back to the hard ones. Don\'t spend 5 minutes on one question.'
        },
        {
          heading:'⚡ Speed techniques',
          content:`Reading passages in exams can feel slow. These techniques help:

Read the QUESTIONS first (quickly)
Before reading the passage, skim the questions. This means you know what to look for as you read.

Skim, then dive
Read the first sentence of each paragraph to understand the structure. Then go back for detail only where the questions point you.

Don\'t re-read the whole passage
Use your underlines. Find the relevant section. Don\'t re-read from the beginning every time.`,
          tip:'💡 Tip: Practice reading 1 article a day — news, science, anything. This builds your reading speed and vocabulary at the same time.'
        }
      ]
    },

    maths: {
      emoji:'🔢', title:'Mathematics', color:'var(--green)',
      intro:'Selective maths isn\'t about doing harder calculations — it\'s about solving unfamiliar problems cleverly. Speed and accuracy both matter. Here\'s how to get both.',
      sections:[
        {
          heading:'✏️ Always underline what the question ASKS',
          content:`The most common maths mistake: answering the wrong thing.

Example: "A rectangle has perimeter 40cm. Its length is twice its width. What is its AREA?"

Students often find the length and width, then stop — but the question asked for the AREA.

Before you calculate anything:
1. Read the question all the way through
2. Underline what it\'s actually asking for
3. Write down what you\'re solving for at the top of your working`,
          tip:'💡 Tip: Check your answer against the question. Does your answer actually answer what was asked?'
        },
        {
          heading:'🔄 Working backwards',
          content:`When you have 4 answer options, you can often plug them back into the question to test which one works. This is especially useful for:

• Age problems
• Word problems with multiple steps
• Any question where forward-solving gets complicated

Start with the middle option (B or C). If it\'s too big, try A. If it\'s too small, try D. This usually gets you the answer in 2 tries maximum.

Example: "A number tripled, then 5 is added, gives 23. What is the number?"
Try C: 6 → 6×3=18, +5=23 ✓ Done in one try.`,
          tip:'💡 Tip: Working backwards is faster than algebra for multiple-choice — use it whenever you see "find the number" type questions.'
        },
        {
          heading:'⚡ Speed maths shortcuts',
          content:`Percentage shortcuts:
• 10% = divide by 10
• 5% = half of 10%
• 15% = 10% + 5%
• 25% = divide by 4
• 1% = divide by 100, then multiply

Multiplication tricks:
• ×11: 36×11 = 3_6, put the sum of digits in the middle = 396
• ×9: Multiply by 10, subtract the number (27×9 = 270−27 = 243)
• ×5: Multiply by 10, divide by 2

Fractions of amounts:
• ¾ of 80: find ¼ first (=20), multiply by 3 (=60)
• ⅔ of 90: find ⅓ first (=30), multiply by 2 (=60)`,
          tip:'💡 Tip: Learn your times tables up to 15×15. It sounds boring but saves enormous time in exams.'
        },
        {
          heading:'🪤 Common traps to avoid',
          content:`Trap 1 — Units mismatch
Question gives km, asks for metres. Always check units match.

Trap 2 — "How many MORE"
"How many more does A have than B?" means A−B, not A+B.

Trap 3 — Percentage of percentage
A 20% increase then a 20% decrease does NOT return to the original. (100 → 120 → 96 = 4% less)

Trap 4 — Perimeter vs Area
Perimeter = around the outside. Area = the surface inside. Don\'t confuse them.

Trap 5 — Reading the diagram wrong
Check axis labels, scale, and units on any graph or diagram question.`,
          tip:'💡 Tip: Write down your working even when you think you can do it in your head. It\'s easier to spot mistakes, and you can check your answer by re-reading the steps.'
        }
      ]
    },

    verbal: {
      emoji:'🧠', title:'Verbal Reasoning', color:'var(--purple)',
      intro:'Verbal reasoning tests your ability to think with language — spotting relationships between words, understanding meanings in context, and classifying ideas. The good news: there are reliable patterns to learn.',
      sections:[
        {
          heading:'🔗 Cracking Analogies',
          content:`Analogies always follow a relationship. Your job is to find what that relationship is BEFORE looking at the options.

Step 1: State the relationship clearly
"DOG is to KENNEL as BIRD is to ___"
→ Relationship: animal → where it lives
→ Answer: NEST

Common relationship types:
• Part to whole (finger → hand)
• Tool to user (scalpel → surgeon)
• Young to adult (kitten → cat)
• Cause to effect (fire → smoke)
• Opposite (hot → cold, but as a relationship)
• Degree (warm → hot = cold → freezing)
• Function (pen → write = scissors → cut)`,
          tip:'💡 Tip: State the relationship as a full sentence BEFORE looking at the options. Students who look at options first get confused by distractors.'
        },
        {
          heading:'🔤 Word Roots — Learn 20, Unlock 200+',
          content:`English has hundreds of words built from the same Latin and Greek roots. Learning roots is a superpower for vocabulary questions.

Essential roots to know:
• BENE = good (benefit, benevolent, benefactor)
• MAL = bad (malicious, malfunction, malevolent)  
• CHRON = time (chronological, chronicle, synchronise)
• DICT = say/speak (dictate, predict, contradict)
• PORT = carry (transport, portable, import)
• VIS/VID = see (visible, vision, video, evident)
• SPEC = look (inspect, spectator, spectacle)
• SCRIB/SCRIPT = write (describe, inscribe, manuscript)
• MIS/MIT = send (transmit, mission, dismiss)
• RUPT = break (interrupt, erupt, corrupt)
• STRUCT = build (construct, structure, destroy)
• VERT/VERS = turn (reverse, convert, divert)
• CRED = believe (credible, incredible, credit)
• MICRO = small (microscope, microphone, microcosm)
• MEGA = large (megalith, megaphone, megabyte)`,
          tip:'💡 Tip: When you see an unknown word, look for a root you recognise. Even a rough guess based on roots is better than random guessing.'
        },
        {
          heading:'🦆 Odd One Out strategies',
          content:`The key: you\'re looking for the word that belongs to a DIFFERENT category.

Check multiple ways a word can be categorised:
• Meaning (angry, furious, livid, peaceful → peaceful is different)
• Type (noun, verb, adjective)
• Spelling pattern
• Number of syllables
• Associated field (science words, music words)

Watch for tricky distractors:
"Apple, Pear, Carrot, Grape" → Carrot is the vegetable
"Hammer, Saw, Screwdriver, Nail" → Nail is not a tool (it\'s a fastener)

One approach: for each word, ask "What group does this belong to?" The one that doesn\'t fit the majority group is the odd one out.`,
          tip:'💡 Tip: Sometimes there are two possible answers. In that case, look for the answer where ONLY ONE word doesn\'t fit. The examiner has a single intended answer.'
        },
        {
          heading:'📝 Sentence Completion shortcuts',
          content:`These questions give a sentence with a blank and ask you to fill it.

Strategy:
1. Read the whole sentence first
2. Predict your own word BEFORE looking at options
3. Look for signal words that hint at the relationship:
   
   CONTRAST signals (but, although, despite, however, while, yet)
   → The blank likely means the OPPOSITE of what comes before/after
   
   CONTINUATION signals (and, therefore, because, since, as a result)
   → The blank likely MATCHES or supports what comes before/after
   
   INTENSITY signals (so... that, such... that, too... to)
   → The blank likely intensifies the idea

4. Eliminate — cross out answers that don\'t fit the tone (too strong, too weak, wrong meaning)`,
          tip:'💡 Tip: Read the finished sentence with each option. Say it aloud in your head. The correct answer should "sound right" and make the sentence logically complete.'
        }
      ]
    },

    quant: {
      emoji:'📐', title:'Quantitative Reasoning', color:'var(--orange)',
      intro:'Quantitative reasoning is pattern-finding with numbers and symbols. Unlike school maths, you don\'t need formulas — you need to spot what\'s changing and why. Always look for the pattern BEFORE you calculate.',
      sections:[
        {
          heading:'🔢 Number Sequence Method',
          content:`Step 1: Find the differences
Write the difference between each pair of numbers.
8, 11, 14, 17, ___ → differences: 3, 3, 3 → next: 17+3 = 20

Step 2: If differences aren\'t constant, find second differences
1, 2, 4, 7, 11, ___ → differences: 1,2,3,4 → second differences: 1,1,1 → next difference is 5 → answer: 11+5 = 16

Step 3: Check for multiplication/division patterns
2, 6, 18, 54, ___ → each term × 3 → answer: 162

Step 4: Check for mixed operations
3, 5, 9, 15, 23, ___ → differences: 2,4,6,8 → next: 10 → answer: 33

Common patterns: +n, ×n, Fibonacci (add previous two), alternating, square numbers, cube numbers`,
          tip:'💡 Tip: Always write out the differences. Don\'t try to spot the pattern just by staring at the numbers.'
        },
        {
          heading:'🔠 Symbol Substitution tactics',
          content:`These give you equations with shapes instead of numbers and ask you to find values.

Method:
1. Look for equations where only ONE unknown appears
   ▲ + ▲ + ▲ = 15 → ▲ = 5

2. Then substitute to find the next unknown
   ▲ + ■ = 8 → 5 + ■ = 8 → ■ = 3

3. For two-variable equations, subtract one from the other:
   ▲ + ■ = 9
   ▲ + ▲ + ■ = 13
   Subtract: ▲ = 4, then ■ = 5

Always write substitutions clearly — don\'t do it in your head.`,
          tip:'💡 Tip: Circle each shape with a different colour or use letters (△=A, ■=B). Treating them as algebra makes it much cleaner.'
        },
        {
          heading:'📊 Grid and Matrix Puzzles',
          content:`Each row (and often column) follows the same rule. Find the rule first.

How to find the rule:
• Try addition/subtraction between columns: col1 + col2 = col3?
• Try multiplication: col1 × col2 = col3?
• Try mixed: col1 × col2 + something = col3?
• Check if rows are independent or if columns have their own pattern

Tips:
• Use two different rows to verify your rule before applying it to the missing cell
• If your rule doesn\'t work for all complete rows, it\'s wrong — find another rule
• The simplest rule is almost always the right one`,
          tip:'💡 Tip: Write your rule as a formula (e.g. "A × B = C") before filling in the blank. This helps you check it properly.'
        },
        {
          heading:'🎨 Spatial and Visual Patterns',
          content:`These questions show shapes rotating, reflecting, or transforming through a sequence.

Rotation questions:
• Track one feature (like an arrow or dot) through each step
• Note: 90° right, 90° left, 180°, or flip

Reflection questions:
• Find the line of reflection
• Check if the shape is flipped left-right or top-bottom

Pattern completion:
• Find what changes at each step (size? number of sides? shading? rotation?)
• Apply the same change to find the next

When in doubt:
• Hold the page up to light and look through it (for reflections)
• Cover all but two images and compare just those two`,
          tip:'💡 Tip: For rotation questions, physically turn your answer sheet. What you see is what the shape looks like rotated!'
        }
      ]
    },

    writing: {
      emoji:'✍️', title:'Writing', color:'var(--teal)',
      intro:'The writing section scares a lot of students — but it\'s actually one of the most learnable sections. Markers give points for specific things. Once you know what they want, you can deliver it every time.',
      sections:[
        {
          heading:'📋 What markers look for (4 criteria)',
          content:`Every selective writing piece is marked on 4 criteria, each out of 10:

1. IDEAS & CONTENT (10 pts)
Does your piece have original, interesting ideas? Is there a clear message or argument?
→ Use specific details, not vague statements. "The old man smiled" is weak. "The old man\'s eyes crinkled at the corners, the way they only did when he remembered something good" is strong.

2. STRUCTURE & ORGANISATION (10 pts)
Does it have a clear beginning, middle and end (narrative) or introduction, body, conclusion (persuasive)?
→ Every paragraph should have ONE clear purpose.

3. LANGUAGE & VOCABULARY (10 pts)
Do you use varied, precise, interesting words? Do you use literary techniques?
→ Replace "said" with declared, muttered, insisted, whispered. Replace "good" with exceptional, invaluable, remarkable.

4. GRAMMAR & MECHANICS (10 pts)
Spelling, punctuation, sentence structure.
→ Short sentences create tension. Longer sentences build atmosphere.`,
          tip:'💡 Tip: Write your best sentences — then ask yourself "can I make this 50% more specific or vivid?" Usually you can.'
        },
        {
          heading:'🗂️ The 5-Minute Plan (NEVER skip this)',
          content:`5 minutes of planning saves you 10 minutes of rambling and gets you a better mark.

For NARRATIVE (story):
• Setting: Where and when?
• Character: Who? One main character is enough.
• Problem/conflict: What goes wrong?
• Turning point: The key moment of change
• Resolution: How does it end? What has changed?

For PERSUASIVE:
• Position: Clearly state your YES or NO
• 3 arguments: What are your 3 best reasons?
• Counter-argument: What would the other side say? How do you defeat it?
• Conclusion: Restate position powerfully

Write bullet points for your plan — just a few words each. Don\'t write full sentences in your plan.`,
          tip:'💡 Tip: A mediocre story with a clear structure always beats a "brilliant" story that wanders without direction. Structure first, creativity second.'
        },
        {
          heading:'🎣 Hooking the marker in the first 3 lines',
          content:`Markers read hundreds of pieces. The opening sets the tone. If yours is boring, they start reading with lower expectations.

Strong narrative openings:
• Start in the middle of the action: "The door swung open before I could knock."
• Start with dialogue: "\'You weren\'t supposed to find that,\' she whispered."
• Start with a surprising image: "The last library on Earth smelled of dust and secrets."
• Start with a question to the reader: "Have you ever wanted something so badly you could feel it in your teeth?"

Weak openings to AVOID:
• "One day..." (cliché)
• "In this essay I will argue..." (too boring)
• "It was a dark and stormy night..." (overused)
• Starting by restating the prompt word for word`,
          tip:'💡 Tip: Write 3 different opening lines, then pick the best one. Having options helps you find something genuinely striking.'
        },
        {
          heading:'🏗️ The TEEL Paragraph (for persuasive writing)',
          content:`Every body paragraph in persuasive writing should follow TEEL:

T — TOPIC SENTENCE
State clearly what this paragraph argues.
"Students who use AI tools for homework develop a dangerous dependency."

E — EVIDENCE or EXAMPLE
Give a specific example, statistic, or scenario that supports it.
"A 2023 survey of Year 10 students found 40% could not complete basic writing tasks without AI assistance."

E — EXPLANATION
Explain HOW your evidence proves your point.
"This demonstrates that over-reliance on AI erodes the very skills students are meant to be developing."

L — LINK back
Connect back to your overall argument.
"Without self-sufficient thinking, students are poorly prepared for the challenges ahead."

One TEEL = one clear argument = one body paragraph.`,
          tip:'💡 Tip: Read your topic sentence alone. Does it make a clear claim? If it\'s wishy-washy ("Social media has good and bad points"), it\'s not strong enough.'
        }
      ]
    },

    examday: {
      emoji:'⏱️', title:'Exam Day Strategy', color:'var(--yellow)',
      intro:'Having good strategies for the actual exam is just as important as knowing the content. Many students know the answers but lose marks through poor time management or exam nerves.',
      sections:[
        {
          heading:'⏰ The 60-Second Rule',
          content:`Each question in a selective exam should take roughly 60 seconds — sometimes less, rarely more.

The system:
Pass 1 — Quick sweep (do all the easy ones)
Go through the whole section answering anything you\'re confident about immediately. Skip anything that needs more than 30 seconds of thought.

Pass 2 — Medium questions
Go back to questions you skipped but feel like you can figure out.

Pass 3 — Hard questions
Spend remaining time on the hardest questions. Use elimination strategies.

Why this works:
• You bank marks on easy questions first
• You never run out of time on easy questions because you spent too long on hard ones
• Knowing you\'ve already got many answers right calms you down for the hard ones`,
          tip:'💡 Tip: Mark questions you\'ve skipped with a small dot or circle in your booklet. This makes Pass 2 much faster.'
        },
        {
          heading:'❌ Elimination — your secret weapon',
          content:`Even if you don\'t know the right answer, you can often eliminate wrong answers.

How to eliminate:
1. Cross out answers that are obviously wrong
2. Cross out answers that are extreme ("always", "never", "all", "none") — these are rarely correct in reading questions
3. Cross out answers that repeat information from the passage without actually answering the question
4. Cross out answers that go WAY beyond what the text says

After eliminating, you\'ve usually gone from 1 in 4 to 1 in 2.

For maths:
• Eliminate answers that are the wrong order of magnitude (too big or too small)
• Eliminate answers that don\'t match the units
• Eliminate answers that are "trap" values (common calculation errors)`,
          tip:'💡 Tip: Physically cross out eliminated options in your booklet. Don\'t just think about it — crossing out stops your eye from drifting back to wrong answers.'
        },
        {
          heading:'🎯 Guessing strategy (never leave a blank)',
          content:`Selective exams in Australia do NOT penalise wrong answers. There is no mark deducted for a wrong answer.

This means:
• A blank answer is DEFINITELY worth 0 marks
• A guess has a chance of being worth 1 mark
• Therefore: ALWAYS put an answer, even if you have no idea

How to guess well:
1. Always eliminate first — even removing 1 wrong answer improves your odds
2. If completely stuck, go with B or C — these are statistically chosen as correct answers slightly more often in tests
3. If you change your answer, only change it if you have a clear reason — first instinct is usually better

After filling in guesses: go back and review if time allows. Don\'t fidget with answers you\'re confident about.`,
          tip:'💡 Tip: At the 5-minute mark, check you haven\'t left any blanks. Fill in anything empty, even if it\'s a pure guess.'
        },
        {
          heading:'🌅 The Night Before and Morning Of',
          content:`The night before:
✅ Do a light 15-minute review (look over your notes, try a few questions)
✅ Prepare everything you need (pencils, eraser, water bottle, ID)
✅ Get to bed at your normal time — extra sleep before exams rarely helps if it disrupts your routine
❌ Don\'t try to learn new content — your brain needs rest to consolidate, not more input
❌ Don\'t do 3 hours of practice papers — this causes anxiety, not confidence

The morning of:
✅ Eat a proper breakfast — your brain needs fuel
✅ Arrive early — being rushed creates anxiety that carries into the exam
✅ Do something calm you enjoy (music, a short walk, a game)
✅ Read through your notes briefly in the car/bus
❌ Don\'t discuss the exam nervously with friends — it\'s contagious`,
          tip:'💡 Tip: Create a "pre-exam playlist" — 3-5 songs that make you feel calm and confident. Listen to it on the way to the exam.'
        }
      ]
    },

    habits: {
      emoji:'📅', title:'Study Habits That Work', color:'var(--red)',
      intro:'The students who do best aren\'t the ones who study the most hours — they\'re the ones who study consistently and smartly. Here\'s how to build a routine that actually works for a busy kid.',
      sections:[
        {
          heading:'📆 The 20-Minute Daily Rule',
          content:`Research consistently shows that 20 minutes of focused practice every day beats 2 hours of cramming once a week.

Why daily practice works:
• Your brain processes and consolidates what you learned while you sleep
• You spot patterns across topics because you\'re building gradually
• It never feels overwhelming — 20 minutes is easy to fit in
• You build confidence slowly instead of panicking before exams

Sample 20-minute session:
• 5 min: 5 quick practice questions from any section
• 10 min: Focus area (the section you find hardest)
• 5 min: Review one thing you got wrong last time

You can do this after school, before dinner, or on the weekend. The time doesn\'t matter — the consistency does.`,
          tip:'💡 Tip: Stack your study with something you already do every day. "After I brush my teeth, I do 5 questions." This makes it automatic.'
        },
        {
          heading:'🧩 Active vs Passive Learning',
          content:`Passive learning (reading notes, watching videos, highlighting) FEELS productive but doesn\'t actually build the skill.

Active learning (doing questions, testing yourself, explaining answers) is what works.

The difference:
❌ Passive: Reading about how to solve analogies
✅ Active: Doing 10 analogy questions and checking your answers

❌ Passive: Watching a video on number sequences
✅ Active: Trying a sequence, getting it wrong, figuring out WHY

❌ Passive: Re-reading your notes before an exam
✅ Active: Writing out what you remember without looking at your notes (then checking)

Rule of thumb: If you\'re not answering questions or testing yourself, you\'re probably not learning as effectively as you think.`,
          tip:'💡 Tip: Use the portal\'s AI Tutor to quiz yourself. Say "quiz me on verbal analogies" — actively answering is always better than passively reading.'
        },
        {
          heading:'📈 Tracking what you\'re weak at',
          content:`Your weak areas are your goldmine. Getting better at something you\'re already good at gives smaller improvements than improving a weakness.

How to track weaknesses:
1. After any practice session, note which question types you got wrong
2. Look for patterns — is it always fractions? Always inference questions?
3. Focus your next session on that one area
4. After a week, test yourself again — measure the improvement

The portal does this automatically:
Your Profile page shows weak topics (under 60% accuracy after 3+ attempts). Use the "Fix it" button next to each weakness to get targeted practice.

One weakness at a time:
Don\'t try to fix everything at once. Pick your single biggest weakness, work on it for a week, then move to the next.`,
          tip:'💡 Tip: Write down your top 3 weak areas and stick them somewhere you see every day (bathroom mirror, desk). Visibility creates accountability.'
        },
        {
          heading:'🎮 Making practice actually enjoyable',
          content:`You\'re more likely to keep doing something if it\'s at least a bit fun. Here are ways to make practice less like a chore:

Turn it into a game:
• Challenge yourself to beat your previous score (the streak counter helps with this)
• Try to get 3 stars on every exam — not just finish it
• Set a timer and try to do 10 questions in 8 minutes

Make it social:
• Quiz a sibling or friend on word meanings
• Challenge someone to the same set of questions and compare scores
• Ask a parent to read you a maths puzzle at dinner

Vary what you do:
• Monday: 10 quick questions (any section)
• Tuesday: 5 hard questions in one section
• Wednesday: Fun Zone puzzles (still builds reasoning!)
• Thursday: Writing practice (set your timer, pick a prompt)
• Friday: Full mini-exam (choose a 10-question timed set)`,
          tip:'💡 Tip: The Fun Zone puzzles genuinely build reasoning skills — they\'re not just games. Brain teasers, logic puzzles, and word games all count as productive practice.'
        }
      ]
    }
  }
};
