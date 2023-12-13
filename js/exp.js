

const exp = (function() {


    let p = {};

    const colorDraw = Math.floor(Math.random() * 2);
    const difficultyDraw = Math.floor(Math.random() * 2)

    let settings = {
        gameType: ['streak', 'bern'][Math.floor(Math.random() * 2)],
        difficulty: [['easy', 'hard'], ['hard', 'easy']][difficultyDraw],
        harderOrEasier: ['harder', 'easier'][difficultyDraw],
        pctCorrect: [['15%', '50%'], ['50%', '15%']][difficultyDraw],
        nTrials: 50,
        colorNames_1: [['blue', 'red'], ['purple', 'orange']][colorDraw],
        colorNames_2: [['blue', 'red'], ['purple', 'orange']][1 - colorDraw],
        colorHex_1: [['blue', '#ff0000'], ['purple', '#F37413']][colorDraw],
        colorHex_2: [['blue', '#ff0000'], ['purple', '#F37413']][1 - colorDraw],
        gameName_1: ["Blue vs. Red", "Purple vs. Orange"][colorDraw],
        gameName_2: ["Blue vs. Red", "Purple vs. Orange"][1 - colorDraw],
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

        let incorrectA = (settings.gameType == "streak") ? `30 tokens` : `10 tokens`;
        let pctA_1 = (settings.difficulty[0] == "hard") ? `50% of the time.` : `15% of the time.`;
        let pctA_2 = (settings.difficulty[1] == "hard") ? `50% of the time.` : `15% of the time.`;

        let correctAnswers_1 = [incorrectA, `0 tokens`, `20%`, `20%`, `If I respond after the tile disappears, my response will be incorrect.`, pctA_1];
        let correctAnswers_2 = [pctA_2];

        let attnChk;

        if (round == 1 && settings.gameType == "bern") {
            attnChk = {
                type: jsPsychSurveyMultiChoice,
                preamble: `<div class='parent' style='text-align: left; color: rgb(109, 112, 114)'>
                    <p><strong>Please answer the following questions.</strong></p>
                    </div>`,
                questions: [
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>If you respond correctly to a tile, you'll earn...</div>", 
                        name: `attnChk1`, 
                        options: [`0 tokens`, `10 tokens`, `20 tokens`, `30 tokens`],
                    },
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>If you respond incorrectly to a tile, you'll earn...</div>", 
                        name: `attnChk2`, 
                        options: [`0 tokens`, `10 tokens`, `20 tokens`, `30 tokens`],
                    },
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>After each response, what are your chances of winning 5 extra tokens?</div>", 
                        name: `attnChk3`, 
                        options: [`0%`, `10%`, `20%`, `30%`],
                    },
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>After each response, what are your chances of losing 5 tokens?</div>", 
                        name: `attnChk4`, 
                        options: [`0%`, `10%`, `20%`, `30%`],
                    },
                    {
                        prompt: `<div style='color: rgb(109, 112, 114)'>Which statement is true?</div>`, 
                        name: `attnChk5`, 
                        options: [`I can take as long as I want to respond to each tile.`, `If I respond after the tile disappears, my response will be incorrect.`],
                    },
                    {
                        prompt: `<div style='color: rgb(109, 112, 114)'>In ${settings.gameName_1}, how often do most players miss the tile?`, 
                        name: `attnChk6`, 
                        options: [`0% of the time.`, `15% of the time.`, `50% of the time.`, `85% of the time.`],
                    },
                ],
                scale_width: 500,
                on_finish: (data) => {
                    const totalErrors = dmPsych.getTotalErrors(data, correctAnswers_1);
                    data.totalErrors = totalErrors;
                },
            };
        } else if (round == 1 && settings.gameType == "streak") {
            attnChk = {
                type: jsPsychSurveyMultiChoice,
                preamble: `<div class='parent' style='text-align: left; color: rgb(109, 112, 114)'>
                    <p><strong>Please answer the following questions.</strong></p>
                    </div>`,
                questions: [
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>If you respond incorrectly after achieving a streak of three, you will earn...</div>", 
                        name: `attnChk1`, 
                        options: [`0 tokens`, `10 tokens`, `20 tokens`, `30 tokens`],
                    },
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>If you respond incorrectly after failing to start a streak, you will earn...</div>", 
                        name: `attnChk2`, 
                        options: [`0 tokens`, `10 tokens`, `20 tokens`, `30 tokens`],
                    },
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>After each streak, what are your chances of winning 5 extra tokens?</div>", 
                        name: `attnChk3`, 
                        options: [`0%`, `10%`, `20%`, `30%`],
                    },
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>After each streak, what are your chances of losing 5 tokens?</div>", 
                        name: `attnChk4`, 
                        options: [`0%`, `10%`, `20%`, `30%`],
                    },
                    {
                        prompt: `<div style='color: rgb(109, 112, 114)'>Which statement is true?</div>`, 
                        name: `attnChk5`, 
                        options: [`I can take as long as I want to respond to each tile.`, `If I respond after the tile disappears, my response will be incorrect.`],
                    },
                    {
                        prompt: `<div style='color: rgb(109, 112, 114)'>In ${settings.gameName_1}, how often do most players respond correctly?`, 
                        name: `attnChk6`, 
                        options: [`0% of the time.`, `55% of the time.`, `85% of the time.`, `100% of the time.`],
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
                    <p><strong>Please answer the following question.</strong></p>
                    </div>`,
                questions: [
                    {
                        prompt: `<div style='color: rgb(109, 112, 114)'>In ${settings.gameName_2}, how often do most players respond correctly?`, 
                        name: `attnChk7`, 
                        options: [`0% of the time.`, `55% of the time.`, `85% of the time.`, `100% of the time.`],
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


        const howToEarn1_bern = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>Practice is now complete.</p>
                        <p>Next, you'll play ${settings.gameName_1}. During ${settings.gameName_1}, you'll be competing for a chance to win a <b>$100.00 bonus prize</b>.</p>
                        <p>Specifically, you'll earn tokens. The tokens you earn will be entered into a lottery, and if one of your tokens is drawn, you'll win $100.00. To maximize your chances of winning a $100.00 bonus, you'll need to earn as many tokens as possible.</p>
                        <p>Continue to learn how to earn tokens!</p>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<div class='parent'>
                        <p>In ${settings.gameName_1}, players earn 10 tokens for every correct response.</p>
                        <p>Players earn 0 tokens for every incorrect response.</p>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>For example, if you respond correctly, you'll see this message indicating that you earned 10 tokens.</p> 
                        <div class="play-area-inst" style="border:0px solid white">               
                            <div class="win-text-inst" style="color:green">+10 Tokens</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>If you respond incorrectly, you'll see this message indicating that you earned 0 tokens.</p> 
                        <div class="play-area-inst" style="border:0px solid white">               
                            <div class="loss-text-inst">+0 Tokens</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>In addition to earning tokens through your performance, you can gain or lose tokens randomly.
                        Specifically, at the end of each round, you have a 20% chance of winning 5 extra tokens, and a 20% chance of losing 5 tokens.</p>`,

                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>If you see "+5 Bonus," this means you randomly won 5 extra tokens. For example, this is what you'd see if you randomly won 5 extra tokens after responding correctly:</p>
                        <div class="play-area-inst" style="border:0px solid white">               
                            <div class="win-text-inst" style="color:green">+10 Tokens</div>
                            <div class="plus-text-inst">+5 Bonus</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>This is what you'd see if you randomly won 5 extra tokens after responding incorrectly.</p>
                        <div class="play-area-inst" style="border:0px solid white">               
                            <div class="loss-text-inst">+0 Tokens</div>
                            <div class="plus-text-inst">+5 Bonus</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>If you see "-5 Loss," this means you randomly lost 5 tokens. For example, this is what you'd see if you randomly lost 5 tokens after responding correctly:</p>
                        <div class="play-area-inst" style="border:0px solid white">               
                            <div class="win-text-inst" style="color:green">+10 Tokens</div>
                            <div class="minus-text-inst">-5 Loss</div>,
                        </div>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>This is what you'd see if you randomly lost 5 tokens after responding incorrectly:</p>
                        <div class="play-area-inst" style="border:0px solid white">               
                            <div class="loss-text-inst">+0 Tokens</div>
                            <div class="minus-text-inst">-5 Loss</div>,
                        </div>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p><b>WARNING: During ${settings.gameName_1}, you must respond to each tile as fast as possible!</b></p>
                        <p>Each tile will disappear very quickly. If you fail to respond correctly before a tile disappears, your response will be considered a miss.</p>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>In ${settings.gameName_1}, most players miss the tile <b>${settings.pctCorrect[0]}</b> of the time.`
                    },
                ],
            ],
            button_label_finish: 'Next',
        };

        const howToEarn1_strk = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>Practice is now complete.</p>
                        <p>Next, you'll play ${settings.gameName_1}. During ${settings.gameName_1}, you'll be competing for a chance to win a <b>$100.00 bonus prize</b>.</p>
                        <p>Specifically, you'll earn tokens. The tokens you earn will be entered into a lottery, and if one of your tokens is drawn, you'll win $100.00. To maximize your chances of winning a $100.00 bonus, you'll need to earn as many tokens as possible.</p>
                        <p>Continue to learn how to earn tokens!</p>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>In ${settings.gameName_1}, players earn tokens for streaks of consecutive successes.</p>
                        <p>Specifically, players earn 10 tokens for every consecutive correct response.</p>
                        <p>For example, a streak of 2 consecutive successes is worth 20 cents, 
                        a streak of 3 consecutive successes is worth 30 cents, and so on.</p>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>Each time you respond correctly, you'll see the length of your current streak.</p>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>For example, if you respond correctly three times in a row, you'll see this message:</p> 
                        <div class="play-area-inst" style="border:0px solid white">    
                            <div class="streak-title-text" style="font-size:45px">Current Streak:</div> 
                            <div class="streak-number-text" style="font-size:60px">3</div>                                               
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>Each time you respond incorrectly, you'll see how many tokens you earned from your streak.</p>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>For example, if you respond incorrectly after achieving a streak of three, you'll see this message indicating that you earned 30 tokens.</p> 
                        <div class="play-area-inst" style="border:0px solid white">    
                            <div class="win-text-inst" style="color:green">+30 Tokens</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>If you respond incorrectly after failing to start a streak, you'll see this message indicating that you earned 0 tokens.</p> 
                        <div class="play-area-inst" style="border:0px solid white">    
                            <div class="loss-text-inst">+0 Tokens</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>In addition to earning tokens through your performance, you'll sometimes gain (or lose) tokens randomly.
                        Specifically, at the end of each streak, you have a 20% chance of winning 5 extra tokens, and a 20% chance of losing 5 tokens.</p>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>If you see "+5 Bonus," this means you randomly won 5 extra tokens. For example, this is what you'd see if you randomly won 5 extra tokens after a streak of three:</p>
                        <div class="play-area-inst" style="border:0px solid white">    
                            <div class="win-text-inst" style="color:green">+30 Tokens</div>
                            <div class="plus-text-inst">+5 Bonus</div>
                        </div>`,

                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>This is what you'd see if you randomly won 5 extra tokens after a streak of zero:</p>
                        <div class="play-area-inst" style="border:0px solid white">    
                            <div class="loss-text-inst">+0 Tokens</div>
                            <div class="plus-text-inst">+5 Bonus</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>If you see "-5 Loss," this means you randomly lost 5 tokens. For example, this is what you'd see if you randomly lost 5 tokens after a streak of three:</p></p>
                        <div class="play-area-inst" style="border:0px solid white">    
                            <div class="win-text-inst" style="color:green">+30 Tokens</div>
                            <div class="minus-text-inst">-5 Loss</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>This is what you'd see if you randomly lost 5 tokens after a streak of zero:</p></p>
                        <div class="play-area-inst" style="border:0px solid white">    
                            <div class="loss-text-inst">+0 Tokens</div>
                            <div class="minus-text-inst">-5 Loss</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p><b>WARNING: During ${settings.gameName_1}, you must respond to each tile as fast as possible!</b></p>
                        <p>Each tile will disappear very quickly. If you fail to respond correctly before a tile disappears, your response will be considered incorrect.</p>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>In ${settings.gameName_1}, most players miss the tile <b>${settings.pctCorrect[0]}</b> of the time.`
                    },
                ],
            ],
            button_label_finish: 'Next',
        };

        const intro_2 = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>Practice is now complete.</p>
                        <p>Continue to learn more about ${settings.gameName_2}</p>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>${settings.gameName_2} is designed to be ${settings.harderOrEasier} than ${settings.gameName_1}.</p>
                        <p>Specifically, in ${settings.gameName_2}, most players miss the tile <b>${settings.pctCorrect[1]}</b> of the time.</p>`
                    },
                ],
            ],
            button_label_finish: 'Next',
        };

        let inst;

        if (round == 2) {
            inst = intro_2;
        } else if (settings.gameType == "bern") {
            inst = howToEarn1_bern;
        } else if (settings.gameType == "streak") {
            inst = howToEarn1_strk;
        }

        const instLoop = {
          timeline: [inst, attnChk, conditionalNode],
          loop_function: () => {
            const fail = jsPsych.data.get().last(2).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        const readyToPlay = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>You're now ready to play ${[settings.gameName_1, settings.gameName_2][round - 1]}.</p>
                        <p><b>Remember, the more tokens you earn, the better your chances of winning $100.00 bonus!</b></p>
                        <p>To begin, continue to the next screen.</p>`
                    },
                ],

            ],
            button_label_finish: 'Next',
        };

        this.timeline = [instLoop, readyToPlay];
       
    };


    p.consent = {
        type: jsPsychExternalHtml,
        url: "./html/consent.html",
        cont_btn: "advance",
    };

    p.intro_wordReading = {
        type: jsPsychSurvey,
        pages: [
            [
                {
                    type: 'html',
                    prompt: `<p><strong>What makes some activities more immersive and engaging than others?</strong></p>
                    <p>We're interested in why people feel effortlessly engaged in some activities (such as engrossing video games), but struggle to focus on other activities.</p>
                    <p>To help us, you'll play two different games. After each game, you'll report how immersed and engaged you felt.</p>
                    <p>To learn about and play the first game, continue to the next screen.</p></p>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>The first came is called ${settings.gameName_1}. It takes place in a play area like this one:</p>
                    <div class="play-area-inst">
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>Throughout the game, tiles will appear in the play area. On each tile, 
                    you'll see the word "${settings.colorNames_1[0]}" or "${settings.colorNames_1[1]}" written in either ${settings.colorNames_1[0]} or ${settings.colorNames_1[1]} font. Proceed to see some examples.</p>
                    <div class="play-area-inst">
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>This tile displays the word "${settings.colorNames_1[0]}" in ${settings.colorNames_1[0]} font.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#D9D9D9; top:25%; left:20%"></div>
                        <div class="stroop-stim-inst" style="color:${settings.colorHex_1[0]}; top:25%; left:20%">${settings.colorNames_1[0]}</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>This tile displays the word "${settings.colorNames_1[0]}" in ${settings.colorNames_1[1]} font.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#D9D9D9; top:25%; left:80%"></div>
                        <div class="stroop-stim-inst" style="color:${settings.colorHex_1[1]}; top:25%; left:80%">${settings.colorNames_1[0]}</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>This tile displays the word "${settings.colorNames_1[1]}" in ${settings.colorNames_1[1]} font.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#D9D9D9; top:75%; left:20%"></div>
                        <div class="stroop-stim-inst" style="color:${settings.colorHex_1[1]}; top:75%; left:20%">${settings.colorNames_1[1]}</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>This tile displays the word "${settings.colorNames_1[1]}" in ${settings.colorNames_1[0]} font.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#D9D9D9; top:75%; left:80%"></div>
                        <div class="stroop-stim-inst" style="color:${settings.colorHex_1[0]}; top:75%; left:80%">${settings.colorNames_1[1]}</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>When a tile appears at the <b>bottom</b> of the play area, you must indicate whether the <b>word is "${settings.colorNames_1[0]}" or "${settings.colorNames_1[1]}"</b> (ignoring the font color).
                    Press Q on your keyboard if the word is "${settings.colorNames_1[0]}," and press P if the word is "${settings.colorNames_1[1]}."
                    <div class="play-area-inst">
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key">Q<br>"${settings.colorNames_1[0]}"</div>
                        <div class="p-key">P<br>"${settings.colorNames_1[1]}"</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>For example, you should respond to this tile by pressing Q.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#D9D9D9; top:75%; left:80%"></div>
                        <div class="stroop-stim-inst" style="color:${settings.colorHex_1[1]}; top:75%; left:80%">${settings.colorNames_1[0]}</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key">Q<br>"${settings.colorNames_1[0]}"</div>
                        <div class="p-key">P<br>"${settings.colorNames_1[1]}"</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>You should respond to this tile by pressing P.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#D9D9D9; top:75%; left:20%"></div>
                        <div class="stroop-stim-inst" style="color:${settings.colorHex_1[0]}; top:75%; left:20%">${settings.colorNames_1[1]}</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key">Q<br>"${settings.colorNames_1[0]}"</div>
                        <div class="p-key">P<br>"${settings.colorNames_1[1]}"</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>If you respond correctly, you'll see this message indicating that you got a hit.</p>
                    <div class="play-area-inst" style="border:0px solid white">
                        <div class="win-text-inst" style="color:green">Hit!</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key"></div>
                        <div class="p-key"></div>
                    </div>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>If you respond incorrectly, you'll see this message indicating that you got a miss.</p>
                    <div class="play-area-inst" style="border:0px solid white">
                        <div class="loss-text-inst">Miss!</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key"></div>
                        <div class="p-key"></div>
                    </div>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>To practice identifying the word on each tile, you'll complete a few practice rounds. During the practice rounds, tiles will always appear at the bottom of the play area, so your goal is always to
                    identify whether the word is "${settings.colorNames_1[0]}" or "${settings.colorNames_1[1]}."</p>
                    <p>Continue to start practicing.</p>`,
                }
            ],

        ],
        button_label_finish: 'Next'
    };

    p.intro_colorNaming = {
        type: jsPsychSurvey,
        pages: [
            [
                {
                    type: 'html',
                    prompt: `<p>Practice is now complete.</p>
                    <p>Next, you'll learn what happens when a tile appears at the top of the play area.</p>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>When a tile appears at the <b>top</b> of the play area, you must indicate whether the <b>font color is ${settings.colorNames_1[0]} or ${settings.colorNames_1[1]}</b> (ignoring the word).
                    Press Q if the font is ${settings.colorNames_1[0]}, and press P if the font is ${settings.colorNames_1[1]}.
                    <div class="play-area-inst">
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key"> Q<br><div class="${settings.colorNames_1[0]}-rec"></div> </div>
                        <div class="p-key"> P<br><div class="${settings.colorNames_1[1]}-rec"></div> </div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>For example, you should respond to this tile by pressing P.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#D9D9D9; top:25%; left:80%"></div>
                        <div class="stroop-stim-inst" style="color:${settings.colorHex_1[1]}; top:25%; left:80%">${settings.colorNames_1[0]}</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key"> Q <div class="${settings.colorNames_1[0]}-rec"></div> </div>
                        <div class="p-key"> P <div class="${settings.colorNames_1[1]}-rec"></div> </div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>You should respond to this tile by pressing Q.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#D9D9D9; top:25%; left:20%"></div>
                        <div class="stroop-stim-inst" style="color:${settings.colorHex_1[0]}; top:25%; left:20%">${settings.colorNames_1[1]}</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key"> Q <div class="${settings.colorNames_1[0]}-rec"></div> </div>
                        <div class="p-key"> P <div class="${settings.colorNames_1[1]}-rec"></div> </div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>To practice identifying the font color on each tile, you'll complete a few practice rounds. During the practice rounds, tiles will always appear at the top of the play area, so your goal is always to
                    identify whether the font is ${settings.colorNames_1[0]} or ${settings.colorNames_1[1]}.</p>
                    <p>Continue to start practicing.</p>`,
                }
            ],

        ],
        button_label_finish: 'Next'
    };

    p.intro_combined = {
        type: jsPsychSurvey,
        pages: [
            [
                {
                    type: 'html',
                    prompt: `<p>Practice is now complete.</p>
                    <p>Now that you've practiced both tasks (naming words and identifying font colors), you'll practice doing both tasks at once.</p>
                    <p>Specifically, in the next practice session, the tile will sometimes appear at the top of the play area (requiring you to identify the font color).
                    Other times, the tile will appear at the bottom of the play area (requiring you to identify the word).</p>
                    <p>Continue when you're ready to practice performing both tasks at once.</p>`
                },
            ],
        ],
        button_label_finish: 'Next'
    };

    p.intro_round2 = {
        type: jsPsychSurvey,
        pages: [
            [
                {
                    type: 'html',
                    prompt: `<p>${settings.gameName_1} is now complete!</p>
                    <p>Soon, you'll continue earning tokens by playing a second game called ${settings.gameName_2}.</p>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>${settings.gameName_2} is identical to ${settings.gameName_1} with two exceptions.</p>
                    <p>First, the words and colors are different: In ${settings.gameName_2}, you'll see the words "${settings.colorNames_2[0]}" and "${settings.colorNames_2[1]}" in ${settings.colorNames_2[0]} and ${settings.colorNames_2[1]} font.</p>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>When a tile appears at the <b>bottom</b> of the play area, you must indicate whether the <b>word is "${settings.colorNames_2[0]}" or "${settings.colorNames_2[1]}"</b> (ignoring the font color).
                    Press Q on your keyboard if the word is "${settings.colorNames_2[0]}," and press P if the word is "${settings.colorNames_2[1]}."
                    <div class="play-area-inst">
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key"> Q <div class="${settings.colorNames_2[0]}-rec"></div> "${settings.colorNames_2[0]}" </div> 
                        <div class="p-key"> P <div class="${settings.colorNames_2[1]}-rec"></div> "${settings.colorNames_2[1]}" </div>
                    </div>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>For example, you should respond to this tile by pressing Q.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#D9D9D9; top:75%; left:80%"></div>
                        <div class="stroop-stim-inst" style="color:${settings.colorHex_2[1]}; top:75%; left:80%">${settings.colorNames_2[0]}</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key"> Q <div class="${settings.colorNames_2[0]}-rec"></div> "${settings.colorNames_2[0]}" </div> 
                        <div class="p-key"> P <div class="${settings.colorNames_2[1]}-rec"></div> "${settings.colorNames_2[1]}" </div>
                    </div>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>You should respond to this tile by pressing P.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#D9D9D9; top:75%; left:20%"></div>
                        <div class="stroop-stim-inst" style="color:${settings.colorHex_2[0]}; top:75%; left:20%">${settings.colorNames_2[1]}</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key"> Q <div class="${settings.colorNames_2[0]}-rec"></div> "${settings.colorNames_2[0]}" </div> 
                        <div class="p-key"> P <div class="${settings.colorNames_2[1]}-rec"></div> "${settings.colorNames_2[1]}" </div>
                    </div>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>When a tile appears at the <b>top</b> of the play area, you must indicate whether the <b>font color is ${settings.colorNames_2[0]} or ${settings.colorNames_2[1]}</b> (ignoring the word).
                    Press Q if the font is ${settings.colorNames_2[0]}, and press P if the font is ${settings.colorNames_2[1]}.
                    <div class="play-area-inst">
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key"> Q <div class="${settings.colorNames_2[0]}-rec"></div> "${settings.colorNames_2[0]}" </div> 
                        <div class="p-key"> P <div class="${settings.colorNames_2[1]}-rec"></div> "${settings.colorNames_2[1]}" </div>
                    </div>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>For example, you should respond to this tile by pressing P.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#D9D9D9; top:25%; left:80%"></div>
                        <div class="stroop-stim-inst" style="color:${settings.colorHex_2[1]}; top:25%; left:80%">${settings.colorNames_2[0]}</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key"> Q <div class="${settings.colorNames_2[0]}-rec"></div> "${settings.colorNames_2[0]}" </div> 
                        <div class="p-key"> P <div class="${settings.colorNames_2[1]}-rec"></div> "${settings.colorNames_2[1]}" </div>
                    </div>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>You should respond to this tile by pressing Q.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#D9D9D9; top:25%; left:20%"></div>
                        <div class="stroop-stim-inst" style="color:${settings.colorHex_2[0]}; top:25%; left:20%">${settings.colorNames_2[1]}</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key"> Q <div class="${settings.colorNames_2[0]}-rec"></div> "${settings.colorNames_2[0]}" </div> 
                        <div class="p-key"> P <div class="${settings.colorNames_2[1]}-rec"></div> "${settings.colorNames_2[1]}" </div>
                    </div>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>Next, you'll practice ${settings.gameName_2}. Continue when you're ready to begin practicing.</p>`
                },
            ],

        ],
        button_label_finish: 'Next',        
    }

    const attnChk1 = new MakeAttnChk(settings, 1);

    const attnChk2 = new MakeAttnChk(settings, 2);

    
   /*
    *
    *   TASK
    *
    */


    // temporary variables for flanker task


    const MakeTimeline = function(round, gameType, isPractice, practiceType, colorNames, colorHex) {

        let correct, stim;
        let trial = 1;
        let top = 1;
        const trialType1 = (settings.difficulty[round] == "easy") ? "congruent" : "incongruent";
        const trialType2 = "doubleIncongruent";
        const trialType1_prob = (settings.difficulty[round] == "easy") ? .9 : .5;

        const congruentStim_top = [
            [colorNames[0], colorHex[0], '20%', '20%', 'q'], 
            [colorNames[1], colorHex[1], '80%', '20%', 'p'], 
        ];

        const congruentStim_bottom = [
            [colorNames[0], colorHex[0], '20%', '80%', 'q'], 
            [colorNames[1], colorHex[1], '80%', '80%', 'p'],
        ];

        const incongruentStim_top = [
            [colorNames[0], colorHex[0], '80%', '20%', 'q'], 
            [colorNames[0], colorHex[1], '80%', '20%', 'p'], 
            [colorNames[1], colorHex[1], '20%', '20%', 'p'], 
            [colorNames[1], colorHex[0], '20%', '20%', 'q'], 
        ];

        const incongruentStim_bottom = [
            [colorNames[0], colorHex[0], '80%', '80%', 'q'], 
            [colorNames[0], colorHex[1], '20%', '80%', 'q'],
            [colorNames[1], colorHex[1], '20%', '80%', 'p'],
            [colorNames[1], colorHex[0], '80%', '80%', 'p'],
        ];

        const doubleIncongruentStim_top = [
            [colorNames[0], colorHex[1], '20%', '20%', 'p'], 
            [colorNames[1], colorHex[0], '80%', '20%', 'q'], 
        ];

        const doubleIncongruentStim_bottom = [
            [colorNames[0], colorHex[1], '80%', '80%', 'q'],
            [colorNames[1], colorHex[0], '20%', '80%', 'p'],
        ];

        let practiceStim = [...congruentStim_top, ...incongruentStim_top];
        if (practiceType == "word") { practiceStim = [...congruentStim_bottom, ...incongruentStim_bottom] };

        let congruentStim_shuffled = {
            top: jsPsych.randomization.repeat(congruentStim_top, 1),
            bottom: jsPsych.randomization.repeat(congruentStim_bottom, 1)
        };

        let incongruentStim_shuffled = {
            top: jsPsych.randomization.repeat(incongruentStim_top, 1),
            bottom: jsPsych.randomization.repeat(incongruentStim_bottom, 1),
        };

        let doubleIncongruentStim_shuffled = {
            top: jsPsych.randomization.repeat(doubleIncongruentStim_top, 1),
            bottom: jsPsych.randomization.repeat(doubleIncongruentStim_bottom, 1),
        }

        let practiceStim_shuffled = jsPsych.randomization.repeat(practiceStim, 1);

        // html
        const headerViz = (gameType == 'bern' || isPractice) ? 'hidden' : 'hidden';
        const playArea = '<div class="play-area">' + `<div class="header" style="visibility:${headerViz}">{headerContent}</div>` + '<div class="tile" style="background-color:{tileColor}; border:{borderStyle}; top:{yPos}; left:{xPos}"></div>' + '<div class="stroop-stim" style="color:{stimColor}; top:{yPos}; left:{xPos}">{stimContent}</div>' +'</div>';
        const feedbackArea = '<div class="play-area" style="border:0px solid white">{token-text}{extra-text}</div>';
        const winText = '<div class="win-text">+10 Tokens</div>';
        const lossText = '<div class="loss-text">+0 Tokens</div>';
        const plusText = '<div class="plus-text">+5 Bonus</div>';
        const minusText = '<div class="minus-text">-5 Loss</div>';
        let keyLabels = `<div class="keycodes"> <div class="q-key"> Q <div class="${colorNames[0]}-rec"></div> "${colorNames[0]}" </div> <div class="p-key"> P <div class="${colorNames[1]}-rec"></div> "${colorNames[1]}" </div> </div>`;
        if (practiceType == "word") {
            keyLabels = `<div class="keycodes"> <div class="q-key">Q<br>"${colorNames[0]}"</div> <div class="p-key">P<br>"${colorNames[1]}"</div> </div>`;
        } else if (practiceType == "color") {
            keyLabels = `<div class="keycodes"> <div class="q-key"> Q <div class="${colorNames[0]}-rec"></div> </div> <div class="p-key"> P <div class="${colorNames[1]}-rec"></div> </div> </div>`;
        };

        // make array of token outcomes 
        const makeTokenArray = function() {
          return jsPsych.randomization.repeat(['plus', 'minus', 'normal', 'normal', 'normal'], 1);
        };

        const makeSwitchArray = function() {
            let arr = [];
  
            // Generate an array with 25 0s and 25 1s
            for (let i = 0; i < 35; i++) {
                arr.push("switch");
            };

            for (let i = 0; i < 15; i++) {
                arr.push("stay");
            };

            arr = jsPsych.randomization.repeat(arr, 1);

            // Shuffle and check the array to meet the condition
            const meetsCondition = (array) => {
                for (let i = 0; i < array.length - 3; i++) {
                  if (array[i] === array[i + 1] && array[i] === array[i + 2] && array[i] === array[i + 3]) {
                    return false;
                  };
                };
                return true;
            };

            // Keep shuffling until the condition is met
            while (!meetsCondition(arr)) {
                arr = jsPsych.randomization.repeat(arr, 1);
            };
            return arr;
        };

        let switchArray = makeSwitchArray();

        // make array of trial types
        const makeTrialTypeArray = function(trialType1, trialType2, trialType1_prob, nTrials) {
            const nTrialType1 = Math.round(10 * trialType1_prob);
            const nTrialType2 = 10 - nTrialType1;
            const nChunks = Math.round(nTrials / 10);
            const miniArray1 = Array(nTrialType1).fill(trialType1);
            const miniArray2 = Array(nTrialType2).fill(trialType2);
            const chunk = miniArray1.concat(miniArray2);
            let fullArray = [];
            for (let i = 0; i < nChunks; i++) {
                let chunk_shuffled = jsPsych.randomization.repeat(chunk, 1);
                fullArray.push(...chunk_shuffled);
            };
            return fullArray;
        };

        let tokenArray_win = makeTokenArray();
        let tokenArray_loss = makeTokenArray();
        let trialTypeArray = makeTrialTypeArray(trialType1, trialType2, trialType1_prob, settings.nTrials);
        let trialTypeArray_combined = makeTrialTypeArray("congruent", "incongruent", .5, 20);

        // variables for streak condition
        let streak = 0;
        let finalStreak;

        const iti = {
            type:jsPsychHtmlKeyboardResponse,
            stimulus: () => {
                return playArea.replace('{headerContent}', `Current Streak: ${streak}`).replace('{tileColor}', 'white').replace('{stimColor}', 'black').replace('{stimContent}', '') + keyLabels;
            },
            choices: "NO_KEYS",
            trial_duration: () => {
                let latency = Math.floor(Math.random() * 1500 + 250);
                return latency;
            },
            data: {phase: 'iti', round: round + 1},
            on_finish: (data) => {
                data.trial_idx = trial;
                data.practice = isPractice;
           },
        };

        const response = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                if (isPractice && practiceType !== "combined") {
                    stim = practiceStim_shuffled.pop()
                } else if (practiceType == "combined") {
                    top = (switchArray[trial - 1] == "stay") ? top : 1 - top * 1;
                    if (trialTypeArray_combined[trial - 1] == "congruent") {
                        stim = (top == 1) ? congruentStim_shuffled.top.pop() : congruentStim_shuffled.bottom.pop();
                    } else if (trialTypeArray_combined[trial - 1] == "incongruent") {
                        stim = (top == 1) ? incongruentStim_shuffled.top.pop() : incongruentStim_shuffled.bottom.pop();
                    };
                } else if (settings.difficulty[round] == 'easy') {
                    top = (switchArray[trial - 1] == "stay") ? top : 1 - top * 1;
                    if (trialTypeArray[trial - 1] == "congruent") {
                        stim = (top == 1) ? congruentStim_shuffled.top.pop() : congruentStim_shuffled.bottom.pop();
                    } else if (trialTypeArray[trial - 1] == "doubleIncongruent") {
                        stim = (top == 1) ? doubleIncongruentStim_shuffled.top.pop() : doubleIncongruentStim_shuffled.bottom.pop();
                    };
                } else {
                    top = (switchArray[trial - 1] == "stay") ? top : 1 - top * 1;
                    if (trialTypeArray[trial - 1] == "doubleIncongruent") {
                        stim = (top == 1) ? doubleIncongruentStim_shuffled.top.pop() : doubleIncongruentStim_shuffled.bottom.pop();
                    } else if (trialTypeArray[trial - 1] == "incongruent") {
                        stim = (top == 1) ? incongruentStim_shuffled.top.pop() : incongruentStim_shuffled.bottom.pop();
                    };
                };
                return playArea.replace('{headerContent}', `Current Streak: ${streak}`).replace('{tileColor}', '#D9D9D9').replaceAll('{xPos}', stim[2]).replaceAll('{yPos}', stim[3]).replace('{stimColor}', stim[1]).replace('{stimContent}', stim[0]) + keyLabels;
            },
            trial_duration: () => {
                if (isPractice) {
                    return 10000;
                } else {
                    return 850;
                }
            },
            data: {phase: 'response', round: round + 1},
            on_finish: (data) => {
                correct = (data.response == stim[4]) ? 1 : 0;
                data.trial_idx = trial;
                data.practice = isPractice;
                data.correct = correct;
                if (congruentStim_shuffled.top.length == 0 || congruentStim_shuffled.bottom.length == 0 || incongruentStim_shuffled.top.length == 0 || incongruentStim_shuffled.bottom.length == 0 || doubleIncongruentStim_shuffled.top.length == 0 || doubleIncongruentStim_shuffled.bottom.length == 0 || practiceStim_shuffled.length == 0) {
                    congruentStim_shuffled.top = jsPsych.randomization.repeat(congruentStim_top, 1);
                    congruentStim_shuffled.bottom = jsPsych.randomization.repeat(congruentStim_bottom, 1);
                    incongruentStim_shuffled.top = jsPsych.randomization.repeat(incongruentStim_top, 1);
                    incongruentStim_shuffled.bottom = jsPsych.randomization.repeat(incongruentStim_bottom, 1);
                    doubleIncongruentStim_shuffled.top = jsPsych.randomization.repeat(doubleIncongruentStim_top, 1);
                    doubleIncongruentStim_shuffled.bottom = jsPsych.randomization.repeat(doubleIncongruentStim_bottom, 1);
                    practiceStim_shuffled = jsPsych.randomization.repeat(practiceStim, 1);
                };
            },
        };

        const outcome = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                let tileColor = (correct == 1) ? 'green' : 'white';
                let stimColor = 'white';
                let stimContent = "&#x2713;"
                let borderStyle = (correct == 1) ? null : null;
                let outcome_html;
                let hitOrMiss = (correct == 1) ? winText.replace("+10 Tokens", "Hit!") : lossText.replace('+0 Tokens', "Miss!");
                return feedbackArea.replace('{token-text}', hitOrMiss).replace('{extra-text}', '');
            },
            choices: "NO_KEYS",
            trial_duration: 1000,
            data: {phase: 'outcome', round: round + 1},
            on_finish: (data) => {
                if (correct == 1) {
                    streak++;
                    if (trial == settings.nTrials) {
                        finalStreak = streak;
                        streak = 0;
                    };
                } else {
                    finalStreak = streak;
                    streak = 0;
                };
                data.trial_idx = trial;
                data.practice = isPractice;
                if (isPractice) { trial++ };
            },
        };

        const tokens = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                let standardFeedback;
                if (correct == 1) {
                    standardFeedback = winText;
                    if (gameType == 'streak' && trial == settings.nTrials) {
                        standardFeedback = winText.replace('10', `${10 * finalStreak}`)
                    };
                } else if (gameType == 'bern') {
                    standardFeedback = lossText;
                } else if (finalStreak == 0) {
                    standardFeedback = lossText;
                } else if (finalStreak > 0) {
                    standardFeedback = winText.replace('10', `${10 * finalStreak}`)
                };
                let bonusFeedbackType = (correct == 1) ? tokenArray_win.pop() : tokenArray_loss.pop();
                let bonusFeedback = (bonusFeedbackType == 'plus') ? plusText : (bonusFeedbackType == 'minus') ? minusText : '';
                if (gameType == 'streak' && correct == 1 && trial < settings.nTrials) {
                    return feedbackArea.replace('{token-text}', `<div class="streak-title-text">Current Streak:</div>`).replace('{extra-text}', `<div class="streak-number-text">${streak}</div>`);
                } else {
                    return feedbackArea.replace('{token-text}', standardFeedback).replace('{extra-text}', bonusFeedback);
                }
            },
            choices: "NO_KEYS",
            trial_duration: 2250,
            data: {phase: 'feedback', round: round + 1},
            on_finish: function(data) {
                if (tokenArray_win.length == 0) {
                    tokenArray_win = makeTokenArray();
                };
                if (tokenArray_loss.length == 0) {
                    tokenArray_loss = makeTokenArray();
                };
                data.trial_idx = trial;
                trial++;
                data.practice = isPractice;
            },
        };

        if (!isPractice) {
            this.timeline = [iti, response, outcome, tokens];
            this.repetitions = settings.nTrials;
        } else {
            this.timeline = [iti, response, outcome];
            this.repetitions = (practiceType == "combined") ? 20 : 10;            
        }


    };

    p.wordPractice = new MakeTimeline(0, settings.gameType, true, "word", settings.colorNames_1, settings.colorHex_1);
    p.colorPractice = new MakeTimeline(0, settings.gameType, true, "color", settings.colorNames_1, settings.colorHex_1);
    p.combinedPractice = new MakeTimeline(0, settings.gameType, true, "combined", settings.colorNames_1, settings.colorHex_1);
    p.combinedPractice2 = new MakeTimeline(0, settings.gameType, true, "combined", settings.colorNames_2, settings.colorHex_2);

    const flanker_timeline_1 = new MakeTimeline(0, settings.gameType, false, null, settings.colorNames_1, settings.colorHex_1);
    const flanker_timeline_2 = new MakeTimeline(1, settings.gameType, false, null, settings.colorNames_2, settings.colorHex_2);


   /*
    *
    *   QUESTIONS
    *
    */

    // scales
    const zeroToExtremely = ["0<br>A little", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>Extremely"];
    const zeroToALot = ['0<br>A little', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10<br>A lot'];

    // constructor functions
    function MakeFlowQs(round) {
        const gameName = (round == 1) ? settings.gameName_1 : settings.gameName_2
        this.type = jsPsychSurveyLikert;
        this.preamble = `<div style='padding-top: 50px; width: 850px; font-size:16px; color:rgb(109, 112, 114)'>
        <p>Thank you for completing ${gameName}!</p>
        <p>During ${gameName}, to what extent did you feel<br><b>immersed</b> and <b>engaged</b> in what you were doing?</p>
        <p>Report the degree to which you felt immersed and engaged by answering the following questions.</p></div>`;
        this.questions = [
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>During ${gameName}, how <strong>absorbed</strong> did you feel in what you were doing?</div>`,
                name: `absorbed`,
                labels: ["0<br>Not very absorbed", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>More absorbed than I've ever felt"],
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>During ${gameName}, how <strong>immersed</strong> did you feel in what you were doing?</div>`,
                name: `immersed`,
                labels: ["0<br>Not very immersed", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>More immersed than I've ever felt"],
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>During ${gameName}, how <strong>engaged</strong> did you feel in what you were doing?</div>`,
                name: `engaged`,
                labels: ["0<br>Not very engaged", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>More engaged than I've ever felt"],
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>During ${gameName}, how <strong>engrossed</strong> did you feel in what you were doing?</div>`,
                name: `engrossed`,
                labels: ["0<br>Not very engrossed", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>More engrossed than I've ever felt"],
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 700;
        this.data = {round: round};
        this.on_finish = (data) => {
            dmPsych.saveSurveyData(data);
        };
    };

    function MakeEnjoyQs(round) {
        const gameName = (round == 1) ? settings.gameName_1 : settings.gameName_2
        this.type = jsPsychSurveyLikert;
        this.preamble = `<div style='padding-top: 50px; width: 850px; font-size:16px; color:rgb(109, 112, 114)'>

        <p>Below are a few more questions about ${gameName}.</p>

        <p>Instead of asking about immersion and engagement, these questions ask about <strong>enjoyment</strong>.<br>
        Report how much you <strong>enjoyed</strong> ${gameName} by answering the following questions.</p></div>`;
        this.questions = [
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How much did you <strong>enjoy</strong> playing ${gameName}?</div>`,
                name: `enjoyable`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How much did you <strong>like</strong> playing ${gameName}?</div>`,
                name: `like`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How much did you <strong>dislike</strong> playing ${gameName}?</div>`,
                name: `dislike`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How much <strong>fun</strong> did you have playing ${gameName}?</div>`,
                name: `fun`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How <strong>entertaining</strong> was ${gameName}?</div>`,
                name: `entertaining`,
                labels: zeroToExtremely,
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 700;
        this.data = {round: round};
        this.on_finish = (data) => {
            dmPsych.saveSurveyData(data);
        };
    };

    function MakeEffortQs(round) {
        const gameName = (round == 1) ? settings.gameName_1 : settings.gameName_2
        this.type = jsPsychSurveyLikert;
        this.questions = [
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How <b>effortful</b> was ${gameName}?</div>`,
                name: `effort`,
                labels: zeroToALot,
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 700;
        this.data = {round: round};
        this.on_finish = (data) => {
            dmPsych.saveSurveyData(data);      
        };
    };


    // timeline: second wheel
    p.leftOrRight_timeline_1 = {
        timeline: [attnChk1, flanker_timeline_1, new MakeFlowQs(1), new MakeEnjoyQs(1), new MakeEffortQs(1)],
    };

    p.leftOrRight_timeline_2 = {
        timeline: [attnChk2, flanker_timeline_2, new MakeFlowQs(2), new MakeEnjoyQs(2), new MakeEffortQs(2)],
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
        experiment_id: "s8QSmUj1vsOe",
        filename: dmPsych.filename,
        data_string: ()=>jsPsych.data.get().csv()
    };

    return p;

}());

const timeline = [exp.consent, exp.intro_wordReading, exp.wordPractice, exp.intro_colorNaming, exp.colorPractice, exp.intro_combined, exp.combinedPractice, exp.leftOrRight_timeline_1, 
    exp.intro_round2, exp.combinedPractice2, exp.leftOrRight_timeline_2, exp.demographics, exp.save_data];

jsPsych.run(timeline);
