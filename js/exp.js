

const exp = (function() {


    let p = {};

    let settings = {
        gameType: ['streak', 'bern'][Math.floor(Math.random() * 2)],
        difficulty: [['easy', 'hard'], ['hard', 'easy']][Math.floor(Math.random() * 2)],
        nTrials: 40,
        colors: [['purple', 'orange'], ['orange', 'purple']][Math.floor(Math.random() * 2)],
    };

    console.log(settings.gameType, settings.difficulty);

    if (settings.colors[0] == 'purple') {
        settings.gameName_1 = `<span class='purple-game'>Purple Game</span>`;
        settings.hex_1 = 'purple';
        settings.gameName_2 = `<span class='orange-game'>Orange Game</span>`;
        settings.hex_2 = '#FA6800'
    } else {
        settings.gameName_1 = `<span class='orange-game'>Orange Game</span>`;
        settings.hex_1 = '#FA6800'
        settings.gameName_2 = `<span class='purple-game'>Purple Game</span>`;
        settings.hex_2 = 'purple';
    };


    let text = {};

    if (settings.difficulty[0] == 'hard') {
        text.example_1 = `<span style="color: ${settings.hex_1}">>><>></span>`;
        text.arrowOrArrows = 'middle arrow';
        text.pointOrPoints = 'points';
        text.exception1 = `<p>First, in the ${settings.gameName_2}, each cue is made up of ${settings.colors[1]} arrows.</p>
        <p>Second, the middle arrow always points in the same direction as the other arrows (e.g., <span style="color: ${settings.hex_2}"><<<<<</span>).</p>
        <p>Therefore, you no longer have to focus exclusively on the middle arrow. You can simply indicate the direction in which all the arrows are pointing.</p>`;
        text.exception2 = `<p>The ${settings.gameName_2} is designed to ensure that players win fewer rounds than in the ${settings.gameName_1}.</p>`
    } else if (settings.difficulty[0] == 'easy') {
        text.example_1 = `<span style="color: ${settings.hex_1}"><<<<<</span>`;
        text.arrowOrArrows = 'arrows';
        text.pointOrPoints = 'point';
        text.exception1 = `<p>First, in the ${settings.gameName_2}, each cue is made up of ${settings.colors[1]} arrows.</p>
        <p>Second, you must indicate the direction of the <b>middle arrow only</b>.</p>
        <p>Sometimes, the middle arrow will point in the same direction as the other arrows (e.g., <span style="color: ${settings.hex_2}"><<<<<</span>), and other times it will point in the opposite direction (e.g., <span style="color: ${settings.hex_2}"><<><<</span>). You must indicate the direction of the middle arrow only, regardless of whether it matches the other arrows.</p>`;
        text.exception2 = `<p>The ${settings.gameName_2} is designed to ensure that players win more rounds than in the ${settings.gameName_1}.</p>`
    };

    jsPsych.data.addProperties({
        gameType: settings.gameType,
        difficulty_1: settings.difficulty[0],
        difficulty_2: settings.difficulty[1],
    });

   /*
    *
    *   INSTRUCTIONS
    *
    */


    function MakeAttnChk(settings, round) {

        let gameName = (round == 1) ? settings.gameName_1 : settings.gameName_2

        let correctAnswers_1 = [`10`, `50%`, `For each cue, I must indicate the direction of the arrows.`];
        let correctAnswers_2 = [`In the ${settings.gameName_2}, all arrows will point in the same direction.`, `50%`];

        let attnChk;

        if (round == 1) {
            attnChk = {
                type: jsPsychSurveyMultiChoice,
                preamble: `<div class='parent' style='text-align: left; color: rgb(109, 112, 114)'>
                    <p><strong>Please answer the following questions.</strong></p>
                    </div>`,
                questions: [
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>What score is required to win a round?</div>", 
                        name: `attnChk1`, 
                        options: [`5`, `10`, `15`, `20`],
                    },
                    {
                        prompt: `<div style='color: rgb(109, 112, 114)'>In the ${settings.gameName_1}, what percent of rounds are you expected to win?</div>`, 
                        name: `attnChk2`, 
                        options: [`10%`, `50%`, `90%`],
                    },
                    {
                        prompt: `<div style='color: rgb(109, 112, 114)'>Which statement best describes the rules of the ${settings.gameName_1}?</div>`, 
                        name: `attnChk3`, 
                        options: [`For each cue, I must indicate the direction of the arrows.`, `For each cue, I must indicate the direction of the middle arrow only.`, `For each cue, I must indicate the color of the arrows.`, `For each cue, I must indicate the number of arrows.`],
                    },
                ],
                scale_width: 500,
                on_finish: (data) => {
                    const totalErrors = dmPsych.getTotalErrors(data, correctAnswers_1);
                    data.totalErrors = totalErrors;
                },
            };
        } else if (round == 2) {
            attnChk = {
                type: jsPsychSurveyMultiChoice,
                preamble: `<div class='parent' style='text-align: left; color: rgb(109, 112, 114)'>
                    <p><strong>Please answer the following questions.</strong></p>
                    </div>`,
                questions: [
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>Which of the following statements is true?</div>", 
                        name: `attnChk4`, 
                        options: [`In the ${settings.gameName_2}, I must indicate the direction of the middle arrow only.`, `In the ${settings.gameName_2}, all arrows will point in the same direction.`],
                    },
                    {
                        prompt: `<div style='color: rgb(109, 112, 114)'>In the ${settings.gameName_2}, what percent of rounds are you expected to win?</div>`, 
                        name: `attnChk5`, 
                        options: [`10%`, `50%`, `90%`],
                    },
                ],
                scale_width: 500,
                on_finish: (data) => {
                    const totalErrors = dmPsych.getTotalErrors(data, correctAnswers_2);
                    data.totalErrors = totalErrors;
                },
            };
        }

        const errorMessage = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>You provided the wrong answer.</p><p>Please continue to try again.</p>`
                    },
                ],
            ],
            button_label_finish: 'Next',
        };

        const conditionalNode = {
          timeline: [errorMessage],
          conditional_function: () => {
            const fail = jsPsych.data.get().last(1).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        const instLoop = {
          timeline: [attnChk, conditionalNode],
          loop_function: () => {
            const fail = jsPsych.data.get().last(2).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        const practiceComplete_1 = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>Practice is now complete.</p>
                        <p>During the ${settings.gameName_1}, your goal is to win as many rounds as possible!</p></p><b>To win a round, you must score 10 points before time runs out.</b></p>
                        <p>To see what happens when you win a round, proceed to the following page.</p>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>If you score 10 points before time runs out, you'll see that you won the round:</p>
                        <div class="outcome-container-lose">
                        <div class="your-score">Your Score:<br><br><span style="color:green; font-weight:bold">10</span></div>
                        <div class="trophy"><img src="/mentalEffort_flanker/img/trophy.png" height="250px"></div>
                        </div>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>If time runs out before you score 10 points, you'll see that you lost the round...</p>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>For example, if you score only 8 points, you'll see:</p>
                        <div class="outcome-container-lose">
                        <div class="your-score">Your Score:<br><br><span style="color:red; font-weight:bold">8</span></div>
                        <div class="flanker-text" style="color:red">You lost!</div>
                        </div>`
                    },
                ],
            ],
            button_label_finish: 'Next',
        };

        const practiceComplete_2 = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>Practice is now complete. Soon, you'll play the ${settings.gameName_2}.</p>
                        ${text.exception2}`
                    },
                ],
            ],
            button_label_finish: 'Next',
        };

        const readyToPlay = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>You're now ready to play the ${gameName}.</p>
                        <p>To begin, continue to the next screen.</p>`
                    },
                ],

            ],
            button_label_finish: 'Next',
        };

        if (round == 1) {
            this.timeline = [practiceComplete_1, instLoop, readyToPlay];
        } else if (round == 2) {
            this.timeline = [practiceComplete_2, instLoop, readyToPlay];
        };
    };


    p.consent = {
        type: jsPsychExternalHtml,
        url: "./html/consent.html",
        cont_btn: "advance",
    };

    p.intro_task = {
        type: jsPsychSurvey,
        pages: [
            [
                {
                    type: 'html',
                    prompt: `<p><strong>What makes some activities more immersive and engaging than others?</strong></p>
                    <p>We're interested in why people feel effortlessly engaged in some activities (such as engrossing video games), but struggle to focus on other activities.</p>
                    <p>To help us, you'll play two different games. After each game, you'll report how immersed and engaged you felt.</p>
                    <p>The first game that you'll play is called the ${settings.gameName_1}.</p>
                    <p>To learn about and play the ${settings.gameName_1}, continue to the next screen.</p></p>`
                },

            ],

        ],
        button_label_finish: 'Next'
    };

    p.intro_1 = {
        type: jsPsychSurvey,
        pages: [
            [
                {
                    type: 'html',
                    prompt: `<p><strong>What makes some activities more immersive and engaging than others?</strong></p>
                    <p>We're interested in why people feel effortlessly engaged in some activities (such as engrossing video games), but struggle to focus on other activities.</p>
                    <p>To help us, you'll play two different games. After each game, you'll report how immersed and engaged you felt.</p>
                    <p>The first game that you'll play is called the ${settings.gameName_1}.</p>
                    <p>To learn about and play the ${settings.gameName_1}, continue to the next screen.</p></p>`
                },

            ],
            [
                {
                    type: 'html',
                    prompt: `<p>The ${settings.gameName_1} takes place over multiple rounds.</p>
                    <p>In each round, you'll see a series of cues composed of ${settings.colors[0]} arrows (e.g., ${text.example_1}).</p>
                    For each cue, you must indicate the <b>direction of the ${text.arrowOrArrows}</b>:
                    <ul>
                        <li>If the ${text.arrowOrArrows} ${text.pointOrPoints} left, you must press Q on your keyboard.</li>
                        <li>If the ${text.arrowOrArrows} ${text.pointOrPoints} right, you must press P on your keyboard.</li>
                    </ul>
                    <p>For each correct response you make, your score will increase by one.<br>
                    For instance, if you see ${text.example_1} and press Q, your score will increase by 1.</p>
                    <p>For every error you make, your score will decrease by one.<br>
                    For instance, if you see ${text.example_1} and press P, your score will decrease by 1.</p>`
                },

            ],
            [
                {
                    type: 'html',
                    prompt: `<p>To get a feel for the ${settings.gameName_1}, you'll complete multiple practice rounds. During the practice rounds, your goal is to achieve the highest score possible.</p>
                    <p>Continue to start practicing.</p>`,
                }
            ],

        ],
        button_label_finish: 'Next'
    };

    p.intro_2 = {
        type: jsPsychSurvey,
        pages: [
            [
                {
                    type: 'html',
                    prompt: `<p>The ${settings.gameName_1} is now complete!</p>
                    <p>Next, you'll play the second of two games. Specifically, you'll play the ${settings.gameName_2}.</p>
                    <p>Continue to learn about the ${settings.gameName_2}.</p>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>The ${settings.gameName_2} is identical to the ${settings.gameName_1} with two exceptions.</p>
                    ${text.exception1}
                    <p>To practice the ${settings.gameName_2}, continue to the next page.</p>`,
                }
            ],
        ],
        button_label_finish: 'Next'    
    };


    const attnChk1 = new MakeAttnChk(settings, 1);

    const attnChk2 = new MakeAttnChk(settings, 2);

    
   /*
    *
    *   TASK
    *
    */


    // temporary variables for flanker task


    const MakeTimeline = function(round, gameType, isPractice) {

        let correct, stim;
        let trial = 1;
        const congruentStim = [
            ['blue', 'blue', '20%', '30%', 'q'], 
            ['blue', 'blue', '20%', '80%', 'q'], 
            ['red', '#ff0000', '80%', '30%', 'p'], 
            ['red', '#ff0000', '80%', '80%', 'p'],
        ];
        const incongruentStim = [
            ['blue', 'blue', '80%', '30%', 'q'], 
            ['blue', 'blue', '80%', '80%', 'q'], 
            ['blue', '#ff0000', '80%', '30%', 'p'], 
            ['blue', '#ff0000', '20%', '80%', 'q'],
            ['blue', '#ff0000', '20%', '30%', 'p'], 
            ['blue', '#ff0000', '80%', '80%', 'q'],
            ['blue', '#ff0000', '20%', '30%', 'p'], 
            ['blue', '#ff0000', '80%', '80%', 'q'],
            ['red', '#ff0000', '20%', '30%', 'p'], 
            ['red', '#ff0000', '20%', '80%', 'p'],
            ['red', 'blue', '20%', '30%', 'q'], 
            ['red', 'blue', '80%', '80%', 'p'],
            ['red', 'blue', '80%', '30%', 'q'], 
            ['red', 'blue', '20%', '80%', 'p'],
            ['red', 'blue', '80%', '30%', 'q'], 
            ['red', 'blue', '20%', '80%', 'p'],
        ];

        // html
        const headerViz = (gameType == 'bern') ? 'hidden' : 'visible';
        const playArea = '<div class="play-area">' + `<div class="header" style="visibility:${headerViz}">{headerContent}</div>` + '<div class="tile" style="background-color:{tileColor}; border:{borderStyle}; top:{yPos}; left:{xPos}"></div>' + '<div class="stroop-stim" style="color:{stimColor}; top:{yPos}; left:{xPos}">{stimContent}</div>' +'</div>';
        const feedbackArea = '<div class="play-area">{token-text}{extra-text}</div>';
        const winText = '<div class="win-text">+10 Tokens</div>';
        const lossText = '<div class="loss-text">+0 Tokens</div>';
        const plusText = '<div class="plus-text">+5 Bonus</div>';
        const minusText = '<div class="minus-text">-5 Loss</div>';

        // make array of token outcomes 
        const makeTokenArray = function() {
          return jsPsych.randomization.repeat(['plus', 'minus', 'normal', 'normal', 'normal'], 1);
        };

        let tokenArray_win = makeTokenArray();
        let tokenArray_loss = makeTokenArray();

        // variables for streak condition
        let streak = 0;
        let finalStreak;

        const iti = {
            type:jsPsychHtmlKeyboardResponse,
            stimulus: () => {
                return playArea.replace('{headerContent}', `Current Streak: ${streak}`).replace('{tileColor}', 'white').replace('{stimColor}', 'black').replace('{stimContent}', '');
            },
            choices: "NO_KEYS",
            trial_duration: () => {
                let latency = Math.floor(Math.random() * 1500 + 250);
                return latency;
            },
            data: {phase: 'iti', round: round},
            on_finish: (data) => {
                data.trial_idx = trial;
            },
        };

        const response = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                if (settings.difficulty[round] == 'easy') {
                    stim = (Math.random() > .1) ? congruentStim[Math.floor(Math.random() * congruentStim.length)] : incongruentStim[Math.floor(Math.random() * incongruentStim.length)];
                } else {
                    stim = incongruentStim[Math.floor(Math.random() * incongruentStim.length)];
                }
                return playArea.replace('{headerContent}', `Current Streak: ${streak}`).replace('{tileColor}', '#b3b3b3').replaceAll('{xPos}', stim[2]).replaceAll('{yPos}', stim[3]).replace('{stimColor}', stim[1]).replace('{stimContent}', stim[0]);
            },
            trial_duration: 700,
            data: {phase: 'response', round: round},
            on_finish: (data) => {
                correct = (data.response == stim[4]) ? 1 : 0;
                data.trial_idx = trial;
                data.practice = isPractice;
                data.correct = correct;
            },
        };

        const outcome = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                let tileColor = (correct == 1) ? '#b3b3b3' : 'white';
                let stimColor = (correct == 1) ? stim[1] : 'white';
                let borderStyle = (correct == 1) ? '5px solid black' : null;
                return playArea.replace('{headerContent}', `Current Streak: ${streak}`).replace('{tileColor}', tileColor).replace('{borderStyle}', borderStyle).replaceAll('{xPos}', stim[2]).replaceAll('{yPos}', stim[3]).replace('{stimColor}', stimColor).replace('{stimContent}', stim[0]);
            },
            choices: "NO_KEYS",
            trial_duration: 1250,
            data: {phase: 'outcome', round: round},
            on_finish: (data) => {
                if (correct == 1) {
                    streak++;
                } else {
                    finalStreak = streak;
                    streak = 0;
                }
                data.trial_idx = trial;
                data.practice = isPractice;
            },
        };

        const tokens = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                let standardFeedback;
                if (correct == 1) {
                    standardFeedback = winText;
                } else if (gameType == 'bern') {
                    standardFeedback = lossText;
                } else if (finalStreak == 0) {
                    standardFeedback = lossText;
                } else if (finalStreak > 0) {
                    standardFeedback = winText.replace('10', `${10 * finalStreak}`)
                };
                let bonusFeedbackType = (correct == 1) ? tokenArray_win.pop() : tokenArray_loss.pop();
                let bonusFeedback = (bonusFeedbackType == 'plus') ? plusText : (bonusFeedbackType == 'minus') ? minusText : '';
                if (gameType == 'streak' && correct == 1) {
                    return playArea.replace('{headerContent}', `Current Streak: ${streak}`).replace('{tileColor}', 'white').replace('{stimColor}', 'black').replace('{stimContent}', '');
                } else {
                    return feedbackArea.replace('{token-text}', standardFeedback).replace('{extra-text}', bonusFeedback);
                }
            },
            choices: "NO_KEYS",
            trial_duration: 2000,
            data: {phase: 'feedback', round: round},
            on_finish: function(data) {
                if (tokenArray_win.length == 0) {
                    tokenArray_win = makeTokenArray();
                };
                if (tokenArray_loss.length == 0) {
                    tokenArray_loss = makeTokenArray();
                };
                data.trial_idx = trial;
                trial++;
                data.round = round + 1;
                data.practice = isPractice;
            },
        };

        if (!isPractice) {
            this.timeline = [iti, response, outcome, tokens];
            this.repetitions = settings.nTrials;
        } else {
            this.timeline = [iti, response, outcome];
            this.repetitions = 4;            
        }


    };

    const flanker_timeline_p1 = new MakeTimeline(0, settings.gameType, true);
    const flanker_timeline_p2 = new MakeTimeline(1, settings.gameType, true);
    const flanker_timeline_1 = new MakeTimeline(0, settings.gameType, false);
    const flanker_timeline_2 = new MakeTimeline(1, settings.gameType, false);


   /*
    *
    *   QUESTIONS
    *
    */

    // scales
    const zeroToExtremely = ["0<br>A little", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>Extremely"];
    const zeroToALot = ['0<br>A little', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10<br>A lot'];

    // constructor functions
    function MakeFlowQs(game, time) {
        this.type = jsPsychSurveyLikert;
        this.preamble = `<div style='padding-top: 50px; width: 850px; font-size:16px; color:rgb(109, 112, 114)'>
        <p>Thank you for completing the ${game}!</p>
        <p>During the ${game}, to what extent did you feel <b>immersed</b> and <b>engaged</b> in what you were doing?</p>
        <p>Report the degree to which you felt immersed and engaged by answering the following questions.</p></div>`;
        this.questions = [
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>During the ${game}, how <strong>absorbed</strong> did you feel in what you were doing?</div>`,
                name: `absorbed`,
                labels: ["0<br>Not very absorbed", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>More absorbed than I've ever felt"],
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>During the ${game}, how <strong>immersed</strong> did you feel in what you were doing?</div>`,
                name: `immersed`,
                labels: ["0<br>Not very immersed", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>More immersed than I've ever felt"],
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>During the ${game}, how <strong>engaged</strong> did you feel in what you were doing?</div>`,
                name: `engaged`,
                labels: ["0<br>Not very engaged", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>More engaged than I've ever felt"],
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>During the ${game}, how <strong>engrossed</strong> did you feel in what you were doing?</div>`,
                name: `engrossed`,
                labels: ["0<br>Not very engrossed", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>More engrossed than I've ever felt"],
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 700;
        this.data = {round: time};
        this.on_finish = (data) => {
            dmPsych.saveSurveyData(data);
        };
    };

    function MakeEnjoyQs(game, time) {
        this.type = jsPsychSurveyLikert;
        this.preamble = `<div style='padding-top: 50px; width: 850px; font-size:16px; color:rgb(109, 112, 114)'>

        <p>Below are a few more questions about the ${game}.</p>

        <p>Instead of asking about immersion and engagement, these questions ask about <strong>enjoyment</strong>.<br>
        Report how much you <strong>enjoyed</strong> the ${game} by answering the following questions.</p></div>`;
        this.questions = [
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How much did you <strong>enjoy</strong> playing the ${game}?</div>`,
                name: `enjoyable`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How much did you <strong>like</strong> playing the ${game}?</div>`,
                name: `like`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How much did you <strong>dislike</strong> playing the ${game}?</div>`,
                name: `dislike`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How much <strong>fun</strong> did you have playing the ${game}?</div>`,
                name: `fun`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How <strong>entertaining</strong> was the ${game}?</div>`,
                name: `entertaining`,
                labels: zeroToExtremely,
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 700;
        this.data = {round: time};
        this.on_finish = (data) => {
            dmPsych.saveSurveyData(data);
        };
    };

    function MakeEffortQs(game, time) {
        this.type = jsPsychSurveyLikert;
        this.questions = [
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How <b>effortful</b> was the ${game}?</div>`,
                name: `effort`,
                labels: zeroToALot,
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 700;
        this.data = {round: time};
        this.on_finish = (data) => {
            dmPsych.saveSurveyData(data);      
        };
    };


    // timeline: second wheel
    p.leftOrRight_timeline_1 = {
        timeline: [flanker_timeline_p1, attnChk1, flanker_timeline_1, new MakeFlowQs(settings.gameName_1, 1), new MakeEnjoyQs(settings.gameName_1, 1), new MakeEffortQs(settings.gameName_1, 1)],
    };

    p.leftOrRight_timeline_2 = {
        timeline: [flanker_timeline_p2, attnChk2, flanker_timeline_2, new MakeFlowQs(settings.gameName_2, 2), new MakeEnjoyQs(settings.gameName_2, 2), new MakeEffortQs(settings.gameName_2, 2)],
    };

   /*
    *
    *   Demographics
    *
    */

    p.demographics = (function() {


        const taskComplete = {
            type: jsPsychInstructions,
            pages: [`<div class='parent' style='color: rgb(109, 112, 114)'>
                    <p>Both games are now complete!</p>
                    <p>To finish this study, please continue to answer a few final questions.</p>
                    </div>`],
            show_clickable_nav: true,
            post_trial_gap: 500,
            allow_keys: false,
        };

        const meanOfEffScale = ['-2<br>Strongly<br>Disagree', '-1<br>Disagree', '0<br>Neither agree<br>nor disagree', '1<br>Agree', '2<br>Strongly<br>Agree'];

        const meanOfEff = {
            type: jsPsychSurveyLikert,
            preamble:
                `<div style='padding-top: 50px; width: 900px; font-size:16px; color: rgb(109, 112, 114)'>
                    <p><strong>Please answer the following questions as honestly and accurately as possible.</strong></p>
                </div>`,
            questions: [
                {
                    prompt: `Pushing myself helps me see the bigger picture.`,
                    name: `meanOfEff_1`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `I often don't understand why I am working so hard.`,
                    name: `meanOfEff_2r`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `I learn the most about myself when I am trying my hardest.`,
                    name: `meanOfEff_3`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `Things make more sense when I can put my all into them.`,
                    name: `meanOfEff_4`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I work hard, it rarely makes a difference.`,
                    name: `meanOfEff_5r`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I push myself, what I'm doing feels important.`,
                    name: `meanOfEff_6`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I push myself, I feel like I'm part of something bigger than me.`,
                    name: `meanOfEff_7`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `Doing my best gives me a clear purpose in life.`,
                    name: `meanOfEff_8`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I try my hardest, my life has meaning.`,
                    name: `meanOfEff_9`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I exert myself, I feel connected to my ideal life.`,
                    name: `meanOfEff_10`,
                    labels: meanOfEffScale,
                    required: true,
                },
            ],
            randomize_question_order: false,
            scale_width: 500,
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        };

        const gender = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>What is your gender?</p>',
            choices: ['Male', 'Female', 'Other'],
            on_finish: (data) => {
                data.gender = data.response;
            }
        };

        const age = {
            type: jsPsychSurveyText,
            questions: [
                {
                    prompt: "Age:", 
                    name: "age",
                    required: true,
                }
            ],
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        }; 

        const ethnicity = {
            type: jsPsychSurveyHtmlForm,
            preamble: '<p>What is your race / ethnicity?</p>',
            html: `<div style="text-align: left">
            <p>White / Caucasian <input name="ethnicity" type="radio" value="white"/></p>
            <p>Black / African American <input name="ethnicity" type="radio" value="black"/></p>
            <p>East Asian (e.g., Chinese, Korean, Vietnamese, etc.) <input name="ethnicity" type="radio" value="east-asian"/></p>
            <p>South Asian (e.g., Indian, Pakistani, Sri Lankan, etc.) <input name="ethnicity" type="radio" value="south-asian"/></p>
            <p>Latino / Hispanic <input name="ethnicity" type="radio" value="hispanic"/></p>
            <p>Middle Eastern / North African <input name="ethnicity" type="radio" value="middle-eastern"/></p>
            <p>Indigenous / First Nations <input name="ethnicity" type="radio" value="indigenous"/></p>
            <p>Bi-racial <input name="ethnicity" type="radio" value="indigenous"/></p>
            <p>Other <input name="other" type="text"/></p>
            </div>`,
            on_finish: (data) => {
                data.ethnicity = data.response.ethnicity;
                data.other = data.response.other;
            }
        };

        const english = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>Is English your native language?:</p>',
            choices: ['Yes', 'No'],
            on_finish: (data) => {
                data.english = data.response;
            }
        };  

        const finalWord = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Questions? Comments? Complains? Provide your feedback here!", rows: 10, columns: 100, name: "finalWord"}],
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        }; 


        const demos = {
            timeline: [taskComplete, gender, age, ethnicity, english, finalWord]
        };

        return demos;

    }());


   /*
    *
    *   SAVE DATA
    *
    */

    p.save_data = {
        type: jsPsychPipe,
        action: "save",
        experiment_id: "24gJDRWxlXPo",
        filename: dmPsych.filename,
        data_string: ()=>jsPsych.data.get().csv()
    };

    return p;

}());

const timeline = [exp.leftOrRight_timeline_2, exp.consent, exp.intro_1, exp.leftOrRight_timeline_1, exp.intro_2, exp.leftOrRight_timeline_2, exp.demographics, exp.save_data];

jsPsych.run(timeline);
